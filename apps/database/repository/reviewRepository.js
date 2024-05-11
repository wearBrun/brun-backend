import prisma from '../db.conntection.js';

export const throwReviewOnproduct=async(reviewData)=>{
    return await prisma.Reviews.create({
        data:reviewData
    })
}

export const fetchProductReviewById=async(reviewId,reviewData)=>{
    return await prisma.Reviews.findUnique({
        where:{
            id:reviewId
        }
    })
}

export const modifyTheProductReview=async(reviewId,reviewData)=>{
    return await prisma.Reviews.update({
        where:{
            id:reviewId
        },
        data:reviewData
    })
}

export const deleteTheProductReview=async(reviewId)=>{
    return await prisma.Reviews.delete({
        where:{
            id:reviewId
        }
    })
}

export const deleteMultipleReviewOfproduct=async(productId)=>{
    return await prisma.Reviews.deleteMany({
        where:{
            product_id:productId
        }
    })
}

export const getAllReviewsOfAuser=async(userId)=>{
    return await prisma.Reviews.findMany({
        where:{
            user_id:userId
        }
    })
}

export const deleteMultipleReviewOfUser=async(userId)=>{
    return await prisma.Reviews.deleteMany({
        where:{
            user_id:userId
        }
    })
}