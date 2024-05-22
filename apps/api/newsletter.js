import express from 'express';
const newsletterRouter=express.Router()
import { subscribeNewsletter,unSubscribeNewsletter,getAllSubscriberList  } from '../services/newsletterService.js';
import { verifyJWT,verifyPermission} from '../../middlewares/auth.mw.js';

newsletterRouter.route('/subscribe').post(subscribeNewsletter)
newsletterRouter.route('/unsubscribe').post(unSubscribeNewsletter)
newsletterRouter.route('/list').get(verifyJWT,verifyPermission,getAllSubscriberList)

export default newsletterRouter