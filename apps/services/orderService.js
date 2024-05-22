import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { catchAsync } from '../../utils/catchAsync.js';
import { razorpay_instance } from '../../utils/razorpay.js';
import { fetchUserById } from '../database/repository/userRepository.js';
import { fetchAddress } from '../database/repository/profileRepository.js';
import { fetchCartProductOfAuserByProductId, deleteProductFromCart } from '../database/repository/cartRepository.js'
import { fetchProductByProductId, updateTheProductStock } from '../database/repository/productRepository.js';
import { fetchCouponDetails, incrementTheCouponUseQuantity } from '../database/repository/couponRepository.js'
import { generateOrder, fetchOrderByOrderId, updateOrder, fetchAllOrder, fetchOrderById, verifyPaymentAndProcessOrder, deleteOrderById } from '../database/repository/orderRepository.js';
import { generateInvoiceNumber } from '../../utils/generateInvoice.js'
import crypto from 'crypto';
import env from '../../env.js';


export const createOrder = catchAsync(async (req, res) => {
    let order_object = {
        invoice_no: generateInvoiceNumber()
    }
    let [userExist, shippingaddressExist] = await Promise.all([
        fetchUserById(req.user.unique_id),
        fetchAddress(req.body.shipping_address)
    ])
    if (!shippingaddressExist) {
        throw new ApiError(400, 'no address found')
    }
    if (!userExist) {
        throw new ApiError(403, 'access denied')
    }
    order_object["user_id"] = userExist.id
    order_object["delivery_address"] = {
        full_name: userExist.first_name + " " + userExist.last_name,
        email: userExist.email,
        phone: shippingaddressExist.phone,
        address1: shippingaddressExist.address1,
        address2: shippingaddressExist.address2,
        city: shippingaddressExist.city,
        state: shippingaddressExist.state,
        pincode: shippingaddressExist.pincode
    }
    if (req.body.billing_address) {
        let billingAddressCheck = await fetchAddress(req.body.billing_address)
        if (!billingAddressCheck) {
            throw new ApiError(400, 'no address found')
        }
        order_object["billing_address"] = {
            full_name: userExist.first_name + " " + userExist.last_name,
            email: userExist.email,
            full_name: userExist.first_name + " " + userExist.last_name,
            email: userExist.email,
            phone: billingAddressCheck.phone,
            address1: billingAddressCheck.address1,
            address2: billingAddressCheck.address2,
            city: billingAddressCheck.city,
            state: billingAddressCheck.state,
            pincode: billingAddressCheck.pincode,
        }
    } 
        if (!Array.isArray(req.body.products)) {
            throw new ApiError(400, 'invalid product data')
        }
        order_object["products"] = req.body.products
        let priceObj = {}
        let totalAmount = 0
        for (let product of req.body.products) {
            let productDetails = await fetchProductByProductId(product.product_id)
            if (productDetails.stock < product.quantity) {
                throw new ApiError(400, 'product out of stock')
            }
            let price = Math.floor((((100 - productDetails.discount) / 100) * productDetails.price) * product.quantity)
            totalAmount += price
        }
        priceObj["price_after_discount"] = totalAmount
        if (req.body.coupon_id) {
            let couponDetails = await fetchCouponDetails(req.body.coupon_id)
            if (!couponDetails) {
                throw new ApiError(404, 'coupon not found')
            }
            let totalAmountAfterCoupon = Math.floor(((100 - couponDetails.discount) / 100) * totalAmount)
            if (totalAmount - totalAmountAfterCoupon > couponDetails.max_discount_amount) {
                totalAmount = totalAmount - couponDetails.max_discount_amount
                priceObj["coupon_discount"] = couponDetails.max_discount_amount
            } else {
                priceObj["coupon_discount"] = totalAmount - totalAmountAfterCoupon
                totalAmount = totalAmountAfterCoupon
            }
            priceObj["price_without_shipping_charge"] = totalAmount
            order_object["coupon_id"] = req.body.coupon_id
        }else{
            priceObj["coupon_discount"] =0 
        }
        priceObj["price_without_shipping_charge"] = totalAmount
        totalAmount = totalAmount + env.DELIVERY_CHARGES
        priceObj["shipping_charge"] = env.DELIVERY_CHARGES
        priceObj["Final_price"] = totalAmount
        order_object["price_details"] = priceObj
        order_object["amount_to_pay"] = totalAmount
        if (!req.body.cod) {
            let options = {
                amount: totalAmount * 100,
                currency: "INR"
            }
            let response = await razorpay_instance.orders.create(options)
            order_object["razorpay_order_id"] = response.id
        }
        order_object["cod"] = req.body.cod
        let newOrder = await generateOrder(order_object)
        return res.status(200).send(new ApiResponse(200, newOrder, "payment initiated..."))
    })

export const verifyOrder = catchAsync(async (req, res) => {
    const { order_id, payment_id, signature } = req.body;
    if (!(order_id && payment_id && signature)) {
        throw new ApiError(400, 'Invalid request body');
    }
    let userExist = await fetchUserById(req.user.unique_id)
    if (!userExist) {
        throw new ApiError(403, 'access denied')
    }
    const hmac = crypto.createHmac('sha256', env.RAZORPAY_KEY_SECRET);
    hmac.update(order_id + "|" + payment_id);
    let generatedSignature = hmac.digest('hex');
    if (generatedSignature !== signature) {
        throw new ApiError(400, 'Signature is not valid');
    }
    let update_order_data = {
        status: "success",
        payment_time: new Date(),
        razorpay_payment_id: payment_id,
        razorpay_signature_id: signature
    }
    let fetchOrder = await fetchOrderByOrderId(order_id)
    if (!fetchOrder) {
        throw new ApiError(400, 'no such order found')
    }
    if (fetchOrder.user_id !== userExist.id) {
        throw new ApiError(403, 'access denied')
    }

    let updateOrderDetails = await updateOrder(fetchOrder.id, update_order_data)
    if (!updateOrderDetails) {
        throw new ApiError(400, 'error while capture paument details')
    }
    await verifyPaymentAndProcessOrder(updateOrderDetails)
    // await incrementTheCouponUseQuantity(updateOrderDetails.coupon_id)
    // for (const product of updateOrderDetails.products) {
    //     await updateTheProductStock(product.product_id, product.quantity);
    //     const getCart = await fetchCartProductOfAuserByProductId(product.product_id, updateOrderDetails.user_id, product.colour, product.size);
    //     if (getCart) {
    //         await deleteProductFromCart(getCart.id);
    //     }
    // }
    return res.status(200).send(new ApiResponse(200, updateOrderDetails, "order placed successfuly"))
})

export const orderFailure = catchAsync(async (req, res) => {
    if (!req.body.order_id) {
        throw new ApiError(400, 'invalid request body')
    }
    let userExist = await fetchUserById(req.user.unique_id)
    if (!userExist) {
        throw new ApiError(403, 'access denied')
    }
    let orderExist = await fetchOrderByOrderId(req.body.order_id)
    if (!orderExist) {
        throw new ApiError(400, 'no such order found')
    }
    let updateOrderDetails = await updateOrder(orderExist.id, { status: "failed", order_status: "Cancelled" })
    return res.status(200).send(new ApiResponse(200, updateOrderDetails, 'payment failed'))
})

export const changeOrderStatus = catchAsync(async (req, res) => {
    let orderDetails = await fetchOrderById(req.params.order_id)
    if (!orderDetails) {
        throw new ApiError(404, 'order details not found')
    }
    if (orderDetails.status != "success") {
        throw new ApiError(403, `can't perform this action`)
    }
    let updateOrderDetails = await updateOrder(orderDetails.razorpay_order_id, req.body)
    return res.status(200).send(new ApiResponse(200, updateOrderDetails, "order updated successfuly"))
})

export const getAllOrder = catchAsync(async (req, res) => {
    let query = {}
    if (req.query.coupon_id) {
        query = {
            ...query,
            coupon_id: req.query.coupon_id
        }
    }
    if (req.query.user_id) {
        query = {
            ...query,
            user_id: req.query.user_id
        }
    }
    if (req.query.address_id) {
        query = {
            ...query,
            address_id: req.query.address_id
        }
    }
    if (req.query.order_status) {
        query = {
            ...query,
            order_status: req.query.order_status
        }
    }
    if (req.query.status) {
        query = {
            ...query,
            status: req.query.status
        }
    }
    let filter = {
        include: {
            user: {
                select: {
                    first_name: true,
                    last_name: true,
                    email: true
                }
            },
            address: true
        },
        where: query
    }
    if (req.query.sort) {
        filter.orderBy = {
            payment_time: req.query.sort
        }
    }
    let allOrder = await fetchAllOrder(filter)
    return res.status(200).send(new ApiResponse(200, allOrder, "all orders fetched successfuly"))
})

export const deleteOrder = catchAsync(async (req, res) => {

    let orderDetails = await fetchOrderById(req.params.order_id)
    if (!orderDetails) {
        throw new ApiError(404, 'order details not found')
    }
    let deleteOrderDetails = await deleteOrderById(req.params.order_id)
    return res.status(200).send(new ApiResponse(200, deleteOrderDetails, 'order deleted successfully'))
})