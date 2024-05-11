import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { catchAsync } from '../../utils/catchAsync.js';
import { addAddress,fetchAddress,updateAddress,deleteAddress,fetchAllAddressFromUserId } from '../database/repository/profileRepository.js';
import { fetchUserById } from '../database/repository/userRepository.js';

export const addAddressToProfile=catchAsync(async(req, res)=>{
    let userExists=await fetchUserById(req.body.user_id)
    if(!userExists){
        throw new ApiError(404,'no such user found')
    }
    let newAddress=await addAddress(req.body)
    return res.status(201).send(new ApiResponse(201,newAddress,'Address To Profile Successfully'))
})

export const getAddressFromProfile=catchAsync(async(req, res)=>{
    let profileAddress=await fetchAddress(req.params.id)
    if(!profileAddress){
        throw new ApiError(400,'no address addedd')
    }
    return res.status(200).send(new ApiResponse(200,profileAddress,'address fetched successfully'))
})

export const getAllAddressOfUser=catchAsync(async(req,res)=>{
    const checkUser=await fetchUserById(req.params.id)
    if(!checkUser){
        throw new ApiError(404,'no such user found')
    }
    let allAddress=await fetchAllAddressFromUserId(req.params.id)
    return res.status(200).send(new ApiResponse(200,allAddress,'Al Address Of The User Fetched SuccessFully'))
})
export const updateAddressFromProfile=catchAsync(async(req, res)=>{
    let profileAddress=await fetchAddress(req.params.id)
    if(!profileAddress){
        throw new ApiError(400,'no address addedd')
    }
    let updateProfileAddress=await updateAddress(req.params.id,req.body)
    return res.status(200).send(new ApiResponse(200,updateProfileAddress,'address updated successfully'))
})

export const deleteAddressFromProfile=catchAsync(async(req, res)=>{
    let profileAddress=await fetchAddress(req.params.id)
    if(!profileAddress){
        throw new ApiError(400,'no address addedd')
    }
    let deleteProfileAddress=await deleteAddress(req.params.id)
    return res.status(204).send(new ApiResponse(204,deleteProfileAddress,'address deleted successfully'))
})