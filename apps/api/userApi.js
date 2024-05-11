import express from 'express';
const userRouter = express.Router()
import { registerUser, loginUser, getUserProfile, deleteUserProfile, updateUserProfile, getAllUserList, forgetPassword, resetPassword, refreshAccessToken } from '../services/userService.js';
import { verifyJWT, verifyPermission } from '../../middlewares/auth.mw.js';

userRouter.route('/register').post(registerUser)
userRouter.route('/login').post(loginUser)
userRouter.route('/list').get(verifyJWT, verifyPermission, getAllUserList)
userRouter.route('/:id').get(verifyJWT, getUserProfile)
userRouter.route('/:id').delete(verifyJWT, verifyPermission, deleteUserProfile)
userRouter.route('/:id').patch(verifyJWT, updateUserProfile)
userRouter.route('/refresh').post(refreshAccessToken)
userRouter.route('/:userId/:resetToken').patch(resetPassword)
userRouter.route('/forgot-password').post(forgetPassword)

export default userRouter