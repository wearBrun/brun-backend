import express from 'express';
const subcategoryRouter=express.Router()
import { addProductSubCategory,getAllSubCategoryOfCategory,getProductSubCategory,updateProductSubCategory,deleteProductSubCategory } from '../services/productSubCategoryServices.js';
import { verifyJWT,verifyPermission} from '../../middlewares/auth.mw.js';

subcategoryRouter.route('/').post(verifyJWT,verifyPermission,addProductSubCategory)
subcategoryRouter.route('/all/:category_id').get(getAllSubCategoryOfCategory)
subcategoryRouter.route('/:id').get(verifyJWT,verifyPermission,getProductSubCategory)
subcategoryRouter.route('/:id').patch(verifyJWT,verifyPermission,updateProductSubCategory)
subcategoryRouter.route('/:id').delete(verifyJWT,verifyPermission,deleteProductSubCategory)

export default subcategoryRouter