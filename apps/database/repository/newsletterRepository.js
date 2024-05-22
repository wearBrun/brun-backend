import prisma from '../db.conntection.js';

export const subscribeToNewsLetter=async(data)=>{
    return prisma.newsletter.create({
        data:data
    })
}

export const unSubscribeToNewsLetter=async(subscriberEmail)=>{
    return prisma.newsletter.update({
        where:{
            email:subscriberEmail
        },
        data:{
            is_subscribed:false
        }
    })
}

export const unSubscribeToSubscribeNewsLetter=async(subscriberEmail)=>{
    return prisma.newsletter.update({
        where:{
            email:subscriberEmail
        },
        data:{
            is_subscribed:true
        }
    })
}

export const getAllNewsLetter=async()=>{
    return prisma.newsletter.findMany({
    })
}

export const getSubscriberFromEmail =async(email)=>{
    return prisma.newsletter.findUnique({
        where:{
            email:email
        }
    })
}
