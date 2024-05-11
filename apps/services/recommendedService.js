import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { catchAsync } from '../../utils/catchAsync.js';
import { addRecommendations,getRecommendations,getAllRecommendations,deleteRecommendations } from '../database/repository/recommendRepository.js';
import { fetchProductByProductId } from '../database/repository/productRepository.js';

export const addProductForRecommendation = catchAsync(async (req, res) => {
    let [product1Exist,product2Exist] = await Promise.all([fetchProductByProductId(req.body.product1_id),fetchProductByProductId(req.body.product2_id)])
    if (!(product1Exist&&product2Exist)) {
        throw new ApiError(404, 'product Not Found')
    }
    let recommendation = await addRecommendations(req.body)
    return res.status(201).send(new ApiResponse(201, recommendation, 'Product Add To Recommended List'))
    
})

export const getAllProductFormRecommendation = catchAsync(async (req, res) => {
    let recommendation = await getAllRecommendations(req.query.product1_id)
    if (!recommendation) {
        throw new ApiError(404, 'recommendation Not Found')
    }
    return res.status(200).send(new ApiResponse(204, recommendation, 'all recommendedation fetched'))
})

export const deleteProductFormRecommendation = catchAsync(async (req, res) => {
    let recommendation = await getRecommendations(req.params.recommendation_id)
    if (!recommendation) {
        throw new ApiError(404, 'recommendation Not Found')
    }
    let delete_recommendation = await deleteRecommendations( req.params.recommendation_id)
    return res.status(204).send(new ApiResponse(204, delete_recommendation, 'remove from recommendation'))
})
