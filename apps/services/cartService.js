import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { catchAsync } from '../../utils/catchAsync.js';
import { fetchCartOfAuser, fetchCartProductOfAuserByProductId, updateCartData, addTocart, deleteProductFromCart ,fetchCartDetailsFromCartId,incrementTheProductQuantity,decrementTheProductQuantity} from '../database/repository/cartRepository.js'
import { fetchProductByProductId } from '../database/repository/productRepository.js'
import { fetchUserById } from '../database/repository/userRepository.js'
import { fetchCouponDetailsFromCouponCode } from '../database/repository/couponRepository.js'

export const fetchAllProdctOfAUserFromCart = catchAsync(async (req, res) => {
    let [userExist, fetchProducts] = await Promise.all([
        fetchUserById(req.user.unique_id),
        fetchCartOfAuser(req.user.unique_id)
    ])
    if (!userExist) {
        throw new ApiError(404, 'User Not Found')
    }
    let totalAmount = 0;
    fetchProducts.forEach(product => {
        let totalPrice = (product.price * product.quantity);
        totalAmount += totalPrice - ((totalPrice / 100) * product.discount)
    });
    if (req.query.coupon) {
        let couponDetails = await fetchCouponDetailsFromCouponCode(req.query.coupon)
        if (!couponDetails) {
            throw new ApiError(404, 'coupon not found')
        }
        totalAmount=Math.round(totalAmount-((totalAmount/100)*couponDetails.discount))
    }
    return res.status(200).send(new ApiResponse(200, {fetchProducts,totalAmount}, 'fetched successfully'))
})

export const addProductInTocart = catchAsync(async (req, res) => {
    let [userExist, productExist, productExistsInCart] = await Promise.all([
        fetchUserById(req.user.unique_id),
        fetchProductByProductId(req.body.product_id),
        fetchCartProductOfAuserByProductId(req.body.product_id, req.user.unique_id,req.body.colour,req.body.size)
    ])
    if (!userExist) {
        throw new ApiError(404, 'User Not Found')
    }
    if (!productExist) {
        throw new ApiError(404, 'product Not Found')
    }
    let cart=null
    if (productExistsInCart) {
        let updateCart = {
            product_id: req.body.product_id,
            user_id: userExist.id,
            quantity: productExistsInCart.quantity + req.body.quantity,
            price: productExist.price * (productExistsInCart.quantity + req.body.quantity),
            discount:productExist.discount,
            colour:req.body.colour,
            size:req.body.size
        }
        cart=await updateCartData(productExistsInCart.id, updateCart)
    } else {
        cart=await addTocart({
            product_id: req.body.product_id,
            user_id: userExist.id,
            quantity: req.body.quantity,
            price:  productExist.price*req.body.quantity,
            discount:productExist.discount,
            colour:req.body.colour,
            size:req.body.size
        })
    }
    return res.status(201).send(new ApiResponse(201, cart, 'product added to the cart'))
})

export const removeProductFromCart = catchAsync(async (req, res) => {
    let [userExist, productExistInCart] = await Promise.all([
        fetchUserById(req.user.unique_id),
        fetchCartDetailsFromCartId(req.params.cart_id),
        ])
    if (!userExist) {
        throw new ApiError(404, 'User Not Found')
    }
    if (!productExistInCart) {
        throw new ApiError(404, 'product remove from the cart')
    }
    await deleteProductFromCart(req.params.cart_id)
    return res.status(200).send(new ApiResponse(200, null, 'product remove from the cart'))
})

export const getProductInsideCart = catchAsync(async(req,res)=>{
    let [userExist, productExist, productExistsInCart] = await Promise.all([
        fetchUserById(req.user.unique_id),
        fetchProductByProductId(req.body.product_id),
        fetchCartProductOfAuserByProductId(req.body.product_id, req.user.unique_id,req.body.colour,req.body.size)
    ])
    if (!userExist) {
        throw new ApiError(404, 'User Not Found')
    }
    if (!productExist) {
        throw new ApiError(404, 'product Not Found')
    }
    if (!productExistsInCart) {
        throw new ApiError(404, 'product not exist in cart')
    }
    return res.status(200).send(new ApiResponse(200, productExistsInCart, 'product fetched successfully'))

})

export const incrementProductQuantity = catchAsync(async(req,res)=>{
    let [userExist, productExistInCart] = await Promise.all([
        fetchUserById(req.user.unique_id),
        fetchCartDetailsFromCartId(req.params.cart_id),
        ])
    if (!userExist) {
        throw new ApiError(404, 'User Not Found')
    }
    if (!productExistInCart) {
        throw new ApiError(404, 'product remove from the cart')
    }
    let updatePrice=(productExistInCart.price/productExistInCart.quantity)*(productExistInCart.quantity+1)
    let updateQuantity=await incrementTheProductQuantity(req.params.cart_id,updatePrice)
    return res.status(200).send(new ApiResponse(200, updateQuantity, 'product quantity increased successfully'))

})

export const decrementProductQuantity = catchAsync(async(req,res)=>{
    let [userExist, productExistInCart] = await Promise.all([
        fetchUserById(req.user.unique_id),
        fetchCartDetailsFromCartId(req.params.cart_id),
        ])
    if (!userExist) {
        throw new ApiError(404, 'User Not Found')
    }
    if (!productExistInCart) {
        throw new ApiError(404, 'product remove from the cart')
    }
    if(productExistInCart.quantity>1){
        let updatePrice=(productExistInCart.price/productExistInCart.quantity)*(productExistInCart.quantity-1)
        let updateQuantity=await decrementTheProductQuantity(req.params.cart_id,updatePrice)
        return res.status(200).send(new ApiResponse(200, updateQuantity, 'product quantity increased successfully'))
    }
    await deleteProductFromCart(req.params.cart_id)
    return res.status(200).send(new ApiResponse(200, null, 'product remove from the cart'))
})