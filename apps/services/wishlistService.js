import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { catchAsync } from '../../utils/catchAsync.js';
import { addProductToWishList, removeproductFromWishList, getproductFromWishList } from '../database/repository/wishlistRepository.js';
import { fetchProductByProductId } from '../database/repository/productRepository.js'
import { fetchUserById } from "../database/repository/userRepository.js";

export const pinAndUnpinProdctFromWishlist = catchAsync(async (req, res) => {
    let userExist = await fetchUserById(req.user.unique_id)
    if (!userExist) {
        throw new ApiError(404, 'User Not Found')
    }
    let productExist = await fetchProductByProductId(req.body.product_id)
    if (!productExist) {
        throw new ApiError(404, 'product Not Found')
    }
    let wishlist = await getproductFromWishList({ product_id: req.body.product_id, user_id: req.user.unique_id })
    if (!wishlist) {
        await addProductToWishList({ product_id: req.body.product_id, user_id: req.user.unique_id })
        return res.status(201).send(new ApiResponse(201, null, 'Product Pin To Wishlist'))
    } else {
        await removeproductFromWishList({ product_id: req.body.product_id, user_id: req.user.unique_id })
        return res.status(201).send(new ApiResponse(201, null, 'Product UnPin To Wishlist'))
    }
})
