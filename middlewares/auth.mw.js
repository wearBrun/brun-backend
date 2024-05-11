import jwt from 'jsonwebtoken';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { catchAsync } from '../utils/catchAsync.js';
import { decodeAccessToken } from '../utils/helper.js';

export const verifyJWT = catchAsync(async (req, res, next) => {
    let token = req.header('Authorization')?.replace("Bearer ", "")
    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = decodeAccessToken(token)
    if (!decodedToken.is_active) {
        throw new ApiError(401, "Unauthorized request");
    }
    req.user = decodedToken
    next()
})

export const verifyPermission = catchAsync(async (req, res, next) => {
    if (!req.user?.unique_id) {
      throw new ApiError(401, "Unauthorized request");
    }
    if (req.user.role === "admin") {
      next();
    } else {
      throw new ApiError(403, "You are not allowed to perform this action");
    }
  });