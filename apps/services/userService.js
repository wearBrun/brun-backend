import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { catchAsync } from '../../utils/catchAsync.js';
import { sendEmailOnSignUp,sendEmailOnForgotPassword } from "../../utils/nodeMailer.js";
import { generateEncryptedPassword, validateThePassword, generateAccessAndRefreshTokens,decodeRefreshToken,generatePasswordResetToken,decodeResetToken } from '../../utils/helper.js';
import { createUser, fetchUserByEmail, fetchUserById,deleteUserById,updateUserById,getAllUser } from '../database/repository/userRepository.js';
import { fetchCartOfAuser,deleteCartOfAuser } from '../database/repository/cartRepository.js';
import { getAllWishlistOfAuser,deleteMultipleWishlistOfUser } from '../database/repository/wishlistRepository.js';
import { getAllReviewsOfAuser,deleteMultipleReviewOfUser } from '../database/repository/reviewRepository.js';
import { fetchAllAddressFromUserId,deleteMultipleAddressOfUser } from '../database/repository/profileRepository.js';
import env from "../../env.js"

export const registerUser = catchAsync(async (req, res) => {
    let { first_name, last_name, email, password, role } = req.body
    const userExists = await fetchUserByEmail(email)
    if (userExists) {
        throw new ApiError(400, 'User Already Exists')
    }
    role === "admin" ? role = "admin" : role = "user"
    let hashedPassword = await generateEncryptedPassword(password)
    const newUser = await createUser(first_name, last_name, email, hashedPassword, role)
    if(newUser){
        let options={
            email:email,
            first_name:newUser.first_name,
            subject:"customer account confirmation"
        }
        await sendEmailOnSignUp(options);
    }
    return res.status(201).send(new ApiResponse(201, newUser, 'User Registred Successfully'))
})

export const loginUser= catchAsync( async(req, res)=>{
    const {email,password}=req.body
    const userExists = await fetchUserByEmail(email)
    if (!userExists) {
        throw new ApiError(404, 'User Not Found')
    }
    const correctPassword=await validateThePassword(password,userExists.password)
    if(!correctPassword){
        throw new ApiError(401,'Incorrect Password!')
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(userExists);
    if(accessToken&&refreshToken){
        await updateUserById(userExists.id,{last_access:new Date()})
    }
    return res.status(200).send(new ApiResponse(200,{accessToken,refreshToken,userId:userExists.id},'logged in successful'))
})

export const getAllUserList = catchAsync(async (req, res)=>{
    let userDetails=await getAllUser()
    if(!userDetails.length){
        throw new ApiError(404,'no user found')
    }
    return res.status(200).send(new ApiResponse(200,userDetails,'User List Fetched Successfully'))
})

export const getUserProfile = catchAsync(async (req, res)=>{
    let userDetails=await fetchUserById(req.params.id)
    if(!userDetails){
        throw new ApiError(404,'no user found')
    }
    if (userDetails && userDetails.wishlist) {
        userDetails.wishlist.forEach(wishlistItem => {
            if (wishlistItem.product && wishlistItem.product.image) {
                wishlistItem.product.image = wishlistItem.product.image.filter(img => img.is_banner === true);
            }
        });
    }
    return res.status(200).send(new ApiResponse(200,userDetails,'UserDetails Fetched Successfully'))
})

export const deleteUserProfile = catchAsync(async (req, res)=>{
    let userDetails=await fetchUserById(req.params.id)
    if(!userDetails){
        throw new ApiError(404,'no user found')
    }
    let [reviewOfuser,wishlistOfuser,addressOfUser,cartOfUser]=await Promise.all([
        getAllReviewsOfAuser(userDetails.id),
        getAllWishlistOfAuser(userDetails.id),
        fetchAllAddressFromUserId(userDetails.id),
        fetchCartOfAuser(userDetails.id)
    ])
    if(reviewOfuser.length){
        await deleteMultipleReviewOfUser(userDetails.id)
    }
    if(wishlistOfuser.length){
        await deleteMultipleWishlistOfUser(userDetails.id)
    }
    if(addressOfUser.length){
        await deleteMultipleAddressOfUser(userDetails.id)
    }
    if(cartOfUser.length){
        await deleteCartOfAuser(userDetails.id)
    }
    let deleteUser=await deleteUserById(req.params.id)
    return res.status(204).send(204,deleteUser,'user deleted')
})

export const updateUserProfile = catchAsync(async (req, res)=>{
    let userDetails=await fetchUserById(req.params.id)
    if(!userDetails){
        throw new ApiError(404,'no user found')
    }
    let updateUser=await updateUserById(req.params.id,req.body)
    return res.status(200).send(new ApiResponse(200,updateUser,'UserDetails Update Successfully'))
})

export const refreshAccessToken = catchAsync(async (req, res) => {
        const { refresh_token } = req.body
        const tokenCheck= decodeRefreshToken(refresh_token)
        if(!tokenCheck){
            throw new ApiError(403,'Please Login Again!!')
        }
        let userData=await fetchUserById(tokenCheck.user_id)
        if(!userData){
            throw new ApiError(404,'user not found')
        }
        const { accessToken, refreshToken } =await generateAccessAndRefreshTokens(userData)
        return res.status(200).send(new ApiResponse(200,{accessToken,refreshToken},'Access Token Generatred'))
})

export const forgetPassword = catchAsync(async (req, res) => {
        const {email} = req.body;
        const userExists = await fetchUserByEmail(email);
        if (!userExists){
            throw new ApiError(401,'There is no user with this email')
        }
        const resetToken = generatePasswordResetToken(email);
        const resetLink = `${env.FRONTEND_BASEURL}/api/v1/user/reset/${userExists.id}/${resetToken}`;
        let options={
            email:email,
            first_name:userExists.first_name,
            resetLink:resetLink,
            subject:"customer account password reset"
        }
        await sendEmailOnForgotPassword(options);

        res.status(200).send(new ApiResponse(200,null,`Email has been sent to ${email}`));
})

export const resetPassword = catchAsync(async (req, res) => {
        const { userId, resetToken } = req.params;
        const newPassword = req.body.password;
        const decodedToken = decodeResetToken(resetToken)
        if (!decodedToken) {
            throw new ApiError(403,'Invalid token');
        }
        const hashedPassword = await generateEncryptedPassword(newPassword); 
        const userExists = await fetchUserById(userId);
        if (!userExists){
            throw new ApiError(404,'Invalid user'); 
        } 
        const updatedUser = await updateUserById(userId, {password:hashedPassword});
        const { accessToken,refreshToken } =  await generateAccessAndRefreshTokens(updatedUser)
        return res.status(200).send(new ApiResponse(200,{accessToken,refreshToken},"New Password Set SuccessFully"))
})