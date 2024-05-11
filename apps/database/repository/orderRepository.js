import prisma from '../db.conntection.js';

export const generateOrder = async (orderData)=>{
    return await prisma.Order.create({
        data:orderData
    })
}

export const fetchOrderByOrderId=async(orderId)=>{
    return await prisma.Order.findFirst({
        where:{
            razorpay_order_id:orderId
        }
    })
}

export const fetchOrderById=async(orderId)=>{
    return await prisma.Order.findUnique({
        where:{
            id:orderId
        }
    })
}

export const fetchAllOrder=async(filter)=>{
    return await prisma.Order.findMany(filter)
}

export const updateOrder = async (orderId,orderData)=>{
    return await prisma.Order.update({
        where:{
            id:orderId
        },
        data:orderData
    })
}

export const deleteOrderById=async(orderId)=>{
    return await prisma.Order.delete({
        where:{
            id:orderId
        }
    })
}

export const fetchOrderFromUserIdAndCouponId=async(userId,couponId)=>{
    return await prisma.Order.findMany({
        where:{
            user_id:userId,
            coupon_id:couponId,
            status:"success"
        }
    })
}

export const verifyPaymentAndProcessOrder=async(updateOrderDetails)=>{
    return await prisma.$transaction([
        prisma.Coupon.update({
            where: {
                coupon_id: updateOrderDetails.coupon_id
            },
            data: {
                used_coupons: {
                    increment: 1
                }
            }
        }),
        ...updateOrderDetails.products.map(async (product) => {
            await prisma.Product.update({
                where: {
                    product_id: product.product_id
                },
                data: {
                    stock: {
                        decrement: product.quantity
                    }
                }
            });

            const getCart = await prisma.cart.findFirst({
                where: {
                    user_id: updateOrderDetails.user_id,
                    product_id: product.product_id,
                    colour: product.colour,
                    size: product.size
                }
            });
            if (getCart) {
                await prisma.cart.delete({
                    where: {
                        id: getCart.id
                    }
                });
            }
        })
    ]);
}

export const fetchOrderFromUserIdAndProductId=async(userId,productId)=>{
    return await prisma.Order.findMany({
        where:{
            user_id:userId,
            product_id:productId,
            status:"success"
        }
    })
}