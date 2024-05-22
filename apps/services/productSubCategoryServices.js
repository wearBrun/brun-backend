import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { catchAsync } from '../../utils/catchAsync.js';
import { createSubCategory,fetchSubCategory,fetchAllSubCategoriesOfACategory,fetchAllSubCategories,updateSubCategory,deleteSubCategory } from '../database/repository/productSubCategoryRepository.js';
import { getAllProductFromSubCategoryId , deleteMProductImage ,deleteProductBySlug} from '../database/repository/productRepository.js';
import { deleteAllRecommendaOfAProduct } from '../database/repository/recommendRepository.js';
import { removeAllproductFromWishList } from '../database/repository/wishlistRepository.js';
import { deleteMultipleReviewOfproduct } from '../database/repository/reviewRepository.js';
import { removeProductsFromMultipleCart } from '../database/repository/cartRepository.js';

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

export const getAllSubCategory=catchAsync(async(req,res)=>{
    let allSubCategories=await fetchAllSubCategories()
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
    let product_details =await getAllProductFromSubCategoryId(req.params.id)
    if(product_details.length){
        await Promise.all(product_details.map(async (product)=>{
            await removeProductsFromMultipleCart(product.id)
            await deleteMultipleReviewOfproduct(product.id)
            await removeAllproductFromWishList(product.id)
            await deleteAllRecommendaOfAProduct(product.id)
            await deleteMProductImage(product.id)
            await deleteProductBySlug(product.slug)
        }))
    }
    let deleteSubCategoryDetails=await deleteSubCategory(req.params.id)
    return res.status(204).send(new ApiResponse(204,deleteSubCategoryDetails,'delete SubCategory Sucessfully'))
})