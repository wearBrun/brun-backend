import express from 'express';
const couponRouter=express.Router()
import { verifyJWT,verifyPermission } from '../../middlewares/auth.mw.js'
import { createCoupon,getCoupon,getAllCoupon,updateCoupon,verifyCoupon,deleteCoupon} from '../services/couponService.js';

couponRouter.route('/').post(verifyJWT,verifyPermission,createCoupon)
couponRouter.route('/all').get(verifyJWT,getAllCoupon)
couponRouter.route('/:coupon_id').get(verifyJWT,verifyPermission,getCoupon)
couponRouter.route('/:coupon_id').patch(verifyJWT,verifyPermission,updateCoupon)
couponRouter.route('/:coupon_id').delete(verifyJWT,verifyPermission,deleteCoupon)
couponRouter.route('/apply').post(verifyJWT,verifyCoupon)
export default couponRouter