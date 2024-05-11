import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { catchAsync } from '../../utils/catchAsync.js';
import { createSubCategory,fetchSubCategory,fetchAllSubCategoriesOfACategory,updateSubCategory,deleteSubCategory } from '../database/repository/productSubCategoryRepository.js';

export const addProductSubCategory=catchAsync(async(req,res)=>{
    const newSubCategory=await createSubCategory(req.body)
    return res.status(201).send(new ApiResponse(201,newSubCategory,'subcategory added successfully'))
})

export const getProductSubCategory=catchAsync(async(req,res)=>{
    let subCategory=await fetchSubCategory(req.params.id)
    if(!subCategory){
        throw new ApiError(404,'no subcategory found')
    }
    return res.status(200).send(new ApiResponse(200,subCategory,'SubCategory Fetched Sucessfully'))
})

export const getAllSubCategoryOfCategory=catchAsync(async(req,res)=>{
    let allSubCategories=await fetchAllSubCategoriesOfACategory(req.params.category_id)
    return res.status(200).send(new ApiResponse(200,allSubCategories,'All SubCategory Fetched Sucessfully'))
})

export const updateProductSubCategory=catchAsync(async(req,res)=>{
    let subCategory=await fetchSubCategory(req.params.id)
    if(!subCategory){
        throw new ApiError(404,'no category found')
    }
    let updateSubCategoryDetails=await updateSubCategory(req.params.id,req.body)
    return res.status(200).send(new ApiResponse(200,updateSubCategoryDetails,'Update SubCategory Sucessfully'))
})

export const deleteProductSubCategory=catchAsync(async(req,res)=>{
    let subCategory=await fetchSubCategory(req.params.id)
    if(!subCategory){
        throw new ApiError(404,'no category found')
    }
    let deleteSubCategoryDetails=await deleteSubCategory(req.params.id)
    return res.status(204).send(new ApiResponse(204,deleteSubCategoryDetails,'delete SubCategory Sucessfully'))
})