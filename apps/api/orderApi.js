import express from 'express';
const orderRouter=express.Router()
import { verifyJWT,verifyPermission } from '../../middlewares/auth.mw.js'
import { createOrder,verifyOrder,orderFailure,changeOrderStatus,getAllOrder,deleteOrder} from '../services/orderService.js';

orderRouter.route('/initiate').post(verifyJWT,createOrder)
orderRouter.route('/verify').post(verifyJWT,verifyOrder)
orderRouter.route('/failure').post(verifyJWT,orderFailure)
orderRouter.route('/all').get(verifyJWT,getAllOrder)
orderRouter.route('/:order_id').patch(verifyJWT,changeOrderStatus)
orderRouter.route('/:order_id').delete(verifyJWT,verifyPermission,deleteOrder)

export default orderRouter