import express from 'express';
const cartRouter=express.Router()
import { verifyJWT,verifyPermission } from '../../middlewares/auth.mw.js'
import { addProductInTocart,fetchAllProdctOfAUserFromCart,removeProductFromCart,getProductInsideCart,incrementProductQuantity,decrementProductQuantity} from '../services/cartService.js';

cartRouter.route('/add').post(verifyJWT,addProductInTocart)
cartRouter.route('/remove/:cart_id').delete(verifyJWT,removeProductFromCart)
cartRouter.route('/fetch-items').get(verifyJWT,fetchAllProdctOfAUserFromCart)
cartRouter.route('/product').get(verifyJWT,getProductInsideCart)
cartRouter.route('/inc/:cart_id').patch(verifyJWT,incrementProductQuantity)
cartRouter.route('/dec/:cart_id').patch(verifyJWT,decrementProductQuantity)
export default cartRouter