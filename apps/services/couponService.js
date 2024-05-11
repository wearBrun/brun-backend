import moment from 'moment';
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { catchAsync } from '../../utils/catchAsync.js';
import { fetchUserById } from '../database/repository/userRepository.js';
import { fetchOrderFromUserIdAndCouponId } from '../database/repository/orderRepository.js';
import { addCouponDetails, fetchCouponDetails, fetchCouponDetailsFromCouponCode, fetcAllhCouponDetails, updateCouponDetails, deleteCouponDetails } from '../database/repository/couponRepository.js'

export const createCoupon = catchAsync(async (req, res) => {
    let couponExist=await fetchCouponDetailsFromCouponCode(req.body.coupon_code)
    if(couponExist){
        throw new ApiError(400,'coupon with this code already exists')
    }
    req.body.validity=moment(req.body.validity)
    let newCoupn = await addCouponDetails(req.body)
    return res.status(201).send(new ApiResponse(201, newCoupn, 'coupon added'))
})

export const getCoupon = catchAsync(async (req, res) => {
    let couponDetails = await fetchCouponDetails(req.params.coupon_id)
    if (!couponDetails) {
        throw new ApiError(404, 'coupon not found')
    }
    return res.status(200).send(new ApiResponse(200, couponDetails, 'coupon details fetched successfully'))
})

export const getAllCoupon = catchAsync(async (req, res) => {
    let query = {}
    if(req.query.expired){
        req.query.expired=="true"?req.query.expired=true:req.query.expired=false
        query={
            ...query,
            is_expired:req.query.expired
        }
    }
    if(req.query.published){
        req.query.published=="true"?req.query.published=true:req.query.published=false
        query={
            ...query,
            is_published:req.query.published
        }
    }
    let filter= {
        where:query
    }
    if(req.query.sort){
            filter.orderBy={
                created_at:req.query.sort
            }
    }
    let allCoupons = await fetcAllhCouponDetails(filter)
    return res.status(200).send(new ApiResponse(200, allCoupons, 'coupon list fetched successfully'))

})

export const updateCoupon = catchAsync(async (req, res) => {
    let couponDetails = await fetchCouponDetails(req.params.coupon_id)
    if (!couponDetails) {
        throw new ApiError(404, 'coupon not found')
    }
    if(req.body.coupon_code){
        let couponExist=await fetchCouponDetailsFromCouponCode(req.body.coupon_code)
        if(couponExist){
            throw new ApiError(400,'coupon with this code already exists')
        }
    }
    if(req.body.validity){
        req.body.validity=moment(req.body.validity)
    }
    let updateCoupon = await updateCouponDetails(req.params.coupon_id,req.body)
    return res.status(200).send(new ApiResponse(200, updateCoupon, 'coupon details updated successfully'))

})

export const deleteCoupon = catchAsync(async (req, res) => {
    let couponDetails = await fetchCouponDetails(req.params.coupon_id)
    if (!couponDetails) {
        throw new ApiError(404, 'coupon not found')
    }
    let deleteCoupon=await deleteCouponDetails(req.params.coupon_id)
    return res.status(204).send(new ApiResponse(204, deleteCoupon, 'coupon details deleted successfully'))

})

export const verifyCoupon = catchAsync(async (req, res) => {
    let userExist=await fetchUserById(req.user.unique_id)
    if(!userExist){
        throw new ApiError(403,'access denied')
    }
    let getCouponDetails=await fetchCouponDetailsFromCouponCode(req.body.coupon_code)
    if(!getCouponDetails){
        throw new ApiError(404,'coupon not exist')
    }
    if (getCouponDetails.is_published==false) {
        throw new ApiError(400,`You can't use this coupon`)
    }
    if (getCouponDetails.is_expired) {
        throw new ApiError(400,'coupon is exired')
    }
    let current_date = moment(new Date())
    let coupon_validity_date = moment(getCouponDetails.validity)
    if (current_date > coupon_validity_date) {
        await updateCouponDetails(getCouponDetails.id,{is_expired:true})
        throw new ApiError(400,'coupon is exired')
    }
    if (getCouponDetails.total_coupons <=getCouponDetails.used_coupons) {
        await updateCouponDetails(getCouponDetails.id,{is_expired:true})
        throw new ApiError(400,'coupon is exired')
    }
    let couponUsagesCheck = await fetchOrderFromUserIdAndCouponId(userExist.id,getCouponDetails.id)
    if (couponUsagesCheck.length > getCouponDetails.coupon_per_user) {
        throw new ApiError(400,'limit exceded')
    }
    return res.status(200).send(new ApiResponse(200,getCouponDetails,'coupon applied successfully'))
})
