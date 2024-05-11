import express from 'express';
const productRouter=express.Router()
import { UploadFile } from '../../middlewares/multer.mw.js'
import { addProductToStock, getAllProductInStock, addBulkProductToStock,updateProductInstock,removeProductToStock,addProductImages,getAllImageOfAProduct,makeProductImageBannerImage,removeProductImage,stockProductDetails} from './../services/productService.js'
import { pinAndUnpinProdctFromWishlist } from '../services/wishlistService.js'
import { addProductForRecommendation,getAllProductFormRecommendation,deleteProductFormRecommendation } from '../services/recommendedService.js'
import { verifyJWT,verifyPermission} from '../../middlewares/auth.mw.js'

productRouter.route('/').post( verifyJWT,verifyPermission,addProductToStock)
productRouter.route('/bulk-add').post(verifyJWT,verifyPermission,addBulkProductToStock)
productRouter.route('/').get(getAllProductInStock)
productRouter.route('/:slug').get(stockProductDetails)
productRouter.route('/:slug').patch(verifyJWT,verifyPermission,updateProductInstock)
productRouter.route('/:slug').delete(verifyJWT,verifyPermission,removeProductToStock)

productRouter.route('/image').post(verifyJWT,verifyPermission,UploadFile.fields([{name:'product_image',maxCount:10}]),addProductImages)
productRouter.route('/image/:product_id').get(verifyJWT,verifyPermission,getAllImageOfAProduct)
productRouter.route('/image/:id').patch(verifyJWT,verifyPermission,makeProductImageBannerImage)
productRouter.route('/image/:id').delete(verifyJWT,verifyPermission,removeProductImage)

productRouter.route('/fav').post(verifyJWT,pinAndUnpinProdctFromWishlist)

productRouter.route('/recommend').post(verifyJWT,verifyPermission,addProductForRecommendation)
productRouter.route('/recommend/all').get(verifyJWT,verifyPermission,getAllProductFormRecommendation)
productRouter.route('/recommend/:recommendation_id').delete(verifyJWT,verifyPermission,deleteProductFormRecommendation)
export default productRouter