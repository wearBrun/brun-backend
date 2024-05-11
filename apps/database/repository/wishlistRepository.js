import prisma from '../db.conntection.js';

export const addProductToWishList = async (wishlistData) => {
    return await prisma.wishlist.create({
        data: wishlistData
    })
}

export const getproductFromWishList = async (wishlistData) => {
    return await prisma.wishlist.findFirst({
        where: wishlistData
    })
}

export const getAllWishListProductOfUser = async (userId) => {
    return await prisma.wishlist.findMany({
        where: {
            user_id: userId
        }
    })
}

export const getAllWishListOfAProduct = async (productId) => {
    return await prisma.wishlist.findMany({
        where: {
            product_id: productId
        }
    })
}

export const removeproductFromWishList = async (wishlistData) => {
    return await prisma.wishlist.delete({
        where: wishlistData
    })
}

export const removeAllproductFromWishList = async (productId) => {
    return await prisma.wishlist.deleteMany({
        where: {
            product_id: productId
        }
    })
}

export const getAllWishlistOfAuser=async(userId)=>{
    return await prisma.wishlist.findMany({
        where:{
            user_id:userId
        }
    })
}

export const deleteMultipleWishlistOfUser=async(userId)=>{
    return await prisma.wishlist.deleteMany({
        where:{
            user_id:userId
        }
    })
}