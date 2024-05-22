import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { catchAsync } from '../../utils/catchAsync.js';
import { subscribeToNewsLetter,getSubscriberFromEmail,unSubscribeToNewsLetter,unSubscribeToSubscribeNewsLetter,getAllNewsLetter } from '../database/repository/newsletterRepository.js';

export const subscribeNewsletter=catchAsync(async(req,res)=>{
    let subscribeDetails=await getSubscriberFromEmail(req.body.email)
    if(subscribeDetails){
        if(!subscribeDetails.is_subscribed){
            await unSubscribeToSubscribeNewsLetter(req.body.email)
        }
        return res.status(200).send(new ApiResponse(200,null,'you have already subscribed'))
    }
    const newSubscriber=await subscribeToNewsLetter(req.body)
    return res.status(201).send(new ApiResponse(201,null,'new Subscriber added successfully'))
})

export const unSubscribeNewsletter=catchAsync(async(req,res)=>{
    const {email}=req.body
    let subscribeDetails=await getSubscriberFromEmail(email)
    if(!subscribeDetails){
        return res.status(404).send(new ApiResponse(404,null,'you have not subscribed'))
    }
    const unsubscribe=await unSubscribeToNewsLetter(email)
    return res.status(201).send(new ApiResponse(201,unsubscribe,'unsubscribe successfully'))
})

export const getAllSubscriberList =catchAsync(async(req,res)=>{
    let data=await getAllNewsLetter()
    return res.status(200).send(new ApiResponse(200,data,'newsletter list Fetched Sucessfully'))
})