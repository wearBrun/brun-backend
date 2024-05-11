import express from 'express';
const reviewRouter=express.Router()
import { verifyJWT,verifyPermission } from '../../middlewares/auth.mw.js'
import { addReview,getReview,editReview,deleteReview } from '../services/reviewService.js';

reviewRouter.route('/').post(verifyJWT,addReview)
reviewRouter.route('/:id').get(verifyJWT,getReview)
reviewRouter.route('/:id').patch(verifyJWT,verifyPermission,editReview)
reviewRouter.route('/:id').delete(verifyJWT,verifyPermission,deleteReview)

export default reviewRouter