import prisma from '../db.conntection.js';

export const fetchCartOfAuser=async(userId)=>{
    return await prisma.Cart.findMany({
        where:{
            user_id:userId
        }
    })
}

export const addTocart = async (cartData)=>{
    return await prisma.Cart.create({
        data:cartData
    })
}

export const fetchCartProductOfAuserByProductId=async(productId,userId,colour,size)=>{
    return await prisma.Cart.findFirst({
        where:{
            product_id:productId,
            user_id:userId,
            colour:colour,
            size:size
        }
    })
}

export const updateCartData=async(cartId,updatedData)=>{
    return await prisma.Cart.update({
        where:{
            id:cartId
        },
        data:updatedData
    })
}

export const deleteProductFromCart = async(cartId)=>{
    return await prisma.Cart.delete({
        where:{
            id:cartId
        }
    })
}

export const fetchCartDetailsFromCartId = async(cartId)=>{
    return await prisma.Cart.findUnique({
        where:{
            id:cartId
        }
    })
}

export const incrementTheProductQuantity = async(cartId,price)=>{
    return await prisma.Cart.update({
        where:{
            id:cartId
        },
        data:{
            quantity:{
                increment:1
            },
            price:price
        }
    })
}

export const decrementTheProductQuantity = async(cartId,price)=>{
    return await prisma.Cart.update({
        where:{
            id:cartId
        },
        data:{
            quantity:{
                decrement:1
            },
            price:price
        }
    })
}

export const fetchAllCartFromProductId=async(productId)=>{
    return await prisma.Cart.findMany({
        where:{
            product_id:productId
        }
    })
}

export const removeProductsFromMultipleCart=async(productId)=>{
    return await prisma.Cart.deleteMany({
        where:{
            product_id:productId
        }
    })
}

export const deleteCartOfAuser=async(userId)=>{
    return await prisma.Cart.deleteMany({
        where:{
            user_id:userId
        }
    })
}