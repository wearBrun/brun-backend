import prisma from '../db.conntection.js';

export const addCouponDetails=async(couponData)=>{
    return prisma.Coupon.create({
        data:couponData
    })
}

export const fetchCouponDetails=async(couponId)=>{
    return prisma.Coupon.findUnique({
        where:{
            id:couponId
        }
    })
}

export const fetchCouponDetailsFromCouponCode=async(couponCode)=>{
    return prisma.Coupon.findFirst({
        where:{
            coupon_code:couponCode
        }
    })
}

export const fetcAllhCouponDetails=async(couponFilter)=>{
    return prisma.Coupon.findMany(couponFilter)
}

export const updateCouponDetails=async(couponId,couponData)=>{
    return prisma.Coupon.update({
        where:{
            id:couponId
        },
        data:couponData
    })
}

export const deleteCouponDetails=async(couponId)=>{
    return prisma.Coupon.delete({
        where:{
            id:couponId
        }
    })
}

export const incrementTheCouponUseQuantity = async(couponId)=>{
    return await prisma.Coupon.update({
        where:{
            id:couponId
        },
        data:{
            used_coupons:{
                increment:1
            }
        }
    })
}