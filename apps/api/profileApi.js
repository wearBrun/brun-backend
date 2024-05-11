import express from 'express';
const profileRouter=express.Router()
import { addAddressToProfile,getAddressFromProfile,updateAddressFromProfile,deleteAddressFromProfile,getAllAddressOfUser } from '../services/profileService.js';
import { verifyJWT } from '../../middlewares/auth.mw.js';

profileRouter.route('/').post(verifyJWT,addAddressToProfile)
profileRouter.route('/all/:id').get(verifyJWT,getAllAddressOfUser)
profileRouter.route('/:id').get(verifyJWT,getAddressFromProfile)
profileRouter.route('/:id').patch(verifyJWT,updateAddressFromProfile)
profileRouter.route('/:id').delete(verifyJWT,deleteAddressFromProfile)

export default profileRouter