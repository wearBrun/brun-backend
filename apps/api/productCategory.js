import express from 'express';
const categoryRouter=express.Router()
import { addProductCategory,getProductCategory,getAllProductCategory,updateProductCategory,deleteProductCategory  } from '../services/productCategoryService.js';
import { verifyJWT,verifyPermission} from '../../middlewares/auth.mw.js';

categoryRouter.route('/').post(verifyJWT,verifyPermission,addProductCategory)
categoryRouter.route('/all/').get(getAllProductCategory)
categoryRouter.route('/:id').get(verifyJWT,verifyPermission,getProductCategory)
categoryRouter.route('/:id').patch(verifyJWT,verifyPermission,updateProductCategory)
categoryRouter.route('/:id').delete(verifyJWT,verifyPermission,deleteProductCategory)

export default categoryRouter