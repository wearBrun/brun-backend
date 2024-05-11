import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { catchAsync } from '../../utils/catchAsync.js';
import { fetchProductByProductId } from '../database/repository/productRepository.js'
import { fetchUserById } from "../database/repository/userRepository.js";
import { throwReviewOnproduct,fetchProductReviewById,modifyTheProductReview,deleteTheProductReview } from '../database/repository/reviewRepository.js';
import { fetchOrderFromUserIdAndProductId } from '../database/repository/orderRepository.js'
//only those ppl can review who have brought the produc)check remaining
export const addReview=catchAsync(async(req,res)=>{
    let userExist = await fetchUserById(req.user.unique_id)
    if (!userExist) {
        throw new ApiError(404, 'User Not Found')
    }
    req.body.user_id=userExist.id
    let productExist = await fetchProductByProductId(req.body.product_id)
    if (!productExist) {
        throw new ApiError(404, 'product Not Found')
    }
    let orderExist = await fetchOrderFromUserIdAndProductId(req.body.user_id,req.body.product_id)
    if(!orderExist){
        throw new ApiError(403,"you only review the purchased products")
    }
    let newReview=await throwReviewOnproduct(req.body)
    return res.status(201).send(new ApiResponse(201,newReview,'Review Added To The Product'))
})

export const getReview=catchAsync(async(req,res)=>{
    let reviewDetails=await fetchProductReviewById(req.params.id)
    if(!reviewDetails){
        throw new ApiError(404,'no suh review found')
    }
    return res.status(200).send(new ApiResponse(200,reviewDetails,'review fetched successfully'))
})

export const editReview=catchAsync(async(req,res)=>{
    let reviewDetails=await fetchProductReviewById(req.params.id)
    if(!reviewDetails){
        throw new ApiError(404,'no suh review found')
    }
    let userExist = await fetchUserById(req.user.unique_id)
    if (!userExist) {
        throw new ApiError(404, 'User Not Found')
    }
    req.body.user_id=userExist.id
    if(req.body.product_id){
        let productExist = await fetchProductByProductId(req.body.product_id)
        if (!productExist) {
            throw new ApiError(404, 'product Not Found')
        }
    }
    let updateReview=await modifyTheProductReview(req.params.id,req.body)
    return res.status(200).send(new ApiResponse(200,updateReview,'review updated successfully'))
})

export const deleteReview=catchAsync(async(req,res)=>{
    let reviewDetails=await fetchProductReviewById(req.params.id)
    if(!reviewDetails){
        throw new ApiError(404,'no such review found')
    }
    let deleteReview=await deleteTheProductReview(req.params.id)
    return res.status(204).send(new ApiResponse(204,deleteReview,'delete successful'))
})