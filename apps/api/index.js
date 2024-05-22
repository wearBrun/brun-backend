import express from 'express';
const router=express.Router();
import healthCheckRouter from '../api/healthCheck.js';
import userRouter from '../api/userApi.js';
import profileRouter from '../api/profileApi.js';
import categoryRouter from '../api/productCategory.js';
import subCategoryRouter from '../api/productSubCategoryApi.js';
import productRouter from '../api/productApi.js';
import reviewRouter from '../api/reviewApi.js';
import cartRouter from '../api/cartApi.js';
import orderRouter from '../api/orderApi.js';
import couponRouter from './couponApi.js';
import newsletterRouter from './newsletter.js';

router.use('/api/v1',healthCheckRouter)
router.use('/api/v1/user',userRouter)
router.use('/api/v1/profile',profileRouter)
router.use('/api/v1/category',categoryRouter)
router.use('/api/v1/sub-category',subCategoryRouter)
router.use('/api/v1/product',productRouter)
router.use('/api/v1/review',reviewRouter)
router.use('/api/v1/cart',cartRouter)
router.use('/api/v1/order',orderRouter)
router.use('/api/v1/coupon',couponRouter)
router.use('/api/v1/newsletter',newsletterRouter)

export default router