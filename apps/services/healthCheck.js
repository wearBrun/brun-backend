import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { catchAsync } from '../../utils/catchAsync.js';

export const healthCheckService=catchAsync(async(req,res)=>{
    return res.status(200).send(new ApiResponse(200,{},'health check complete and successfull🔋🔋'))
})
export const healthCheckServicePrivate=catchAsync(async(req,res)=>{
    return res.status(200).send(new ApiResponse(200,{},'health check complete and successfull🔋🔋'))
})
export const healthCheckServiceAdmin=catchAsync(async(req,res)=>{
    return res.status(200).send(new ApiResponse(200,{},'health check complete and successfull🔋🔋'))
})