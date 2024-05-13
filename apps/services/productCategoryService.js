import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { catchAsync } from '../../utils/catchAsync.js';
import { createCategory,fetchCategory,fetchAllCategories,updateCategory,deleteCategory } from '../database/repository/productCategoryRepository.js';
import { deleteSubCategoryFromCategoryId } from '../database/repository/productSubCategoryRepository.js';
import { getAllProductFromCategoryId , deleteMProductImage ,deleteProductBySlug} from '../database/repository/productRepository.js';
import { deleteAllRecommendaOfAProduct } from '../database/repository/recommendRepository.js';
import { removeAllproductFromWishList } from '../database/repository/wishlistRepository.js';
import { deleteMultipleReviewOfproduct } from '../database/repository/reviewRepository.js';
import { removeProductsFromMultipleCart } from '../database/repository/cartRepository.js';

export const addProductCategory=catchAsync(async(req,res)=>{
    const {category_name}=req.body
    const newCategory=await createCategory(category_name)
    return res.status(201).send(new ApiResponse(201,newCategory,'category added successfully'))
})

export const getProductCategory=catchAsync(async(req,res)=>{
    let category=await fetchCategory(req.params.id)
    if(!category){
        throw new ApiError(404,'no category found')
    }
    return res.status(200).send(new ApiResponse(200,category,'Category Fetched Sucessfully'))
})

export const getAllProductCategory=catchAsync(async(req,res)=>{
    let allCategories=await fetchAllCategories()
    return res.status(200).send(new ApiResponse(200,allCategories,'All Category Fetched Sucessfully'))
})

export const updateProductCategory=catchAsync(async(req,res)=>{
    const {category_name}=req.body
    let category=await fetchCategory(req.params.id)
    if(!category){
        throw new ApiError(404,'no category found')
    }
    let updateCategoryDetails=await updateCategory(req.params.id,category_name)
    return res.status(200).send(new ApiResponse(200,updateCategoryDetails,'Update Category Sucessfully'))
})

export const deleteProductCategory=catchAsync(async(req,res)=>{
    let category=await fetchCategory(req.params.id)
    if(!category){
        throw new ApiError(404,'no category found')
    }
    let product_details =await getAllProductFromCategoryId(req.params.id)
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
    await deleteSubCategoryFromCategoryId(req.params.id)
    let deleteCategoryDetails=await deleteCategory(req.params.id)
    return res.status(204).send(new ApiResponse(204,deleteCategoryDetails,'delete Category Sucessfully'))
})