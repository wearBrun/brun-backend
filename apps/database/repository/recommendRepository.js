import prisma from '../db.conntection.js';

export const addRecommendations = async (data) => {
    return await prisma.recommendations.create({
        data: data
    })
}

export const getAllRecommendations = async (product1_id) => {
    return await prisma.recommendations.findMany({
        where: {
            product1_id: product1_id
        }
    })
}

export const getRecommendations = async (recommendation_id) => {
    return await prisma.recommendations.findUnique({
        where: {
            id: recommendation_id
        }
    })
}

export const deleteRecommendations = async (recommendation_id) => {
    return await prisma.recommendations.delete({
        where: {
            id: recommendation_id
        }
    })
}
export const deleteAllRecommendaOfAProduct = async (productId)=>{
    return await prisma.recommendations.deleteMany({
        where: {
            OR: [
                { product1_id: productId },
                { product2_id: productId }
            ]
        }
    })
}