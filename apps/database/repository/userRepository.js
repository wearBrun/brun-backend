import prisma from '../db.conntection.js';

export const createUser = async (first_name,last_name, email, password,role) => {
    return await prisma.user.create({
        data: {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password,
            role:role
        }
    });
};
export const fetchUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email: email
        }
    });
};
export const fetchUserById = async (userId) => {
    return await prisma.user.findUnique({
        where: {
            id: userId
        },
        include:{
            Address:true,
            orders:true,
            cart:true,
            wishlist:{
                include:{
                    product:{
                        include:{
                            image:true
                        }
                    }
                }
            }
        }
    });
};
export const deleteUserById = async (userId) => {
    return await prisma.user.delete({
        where: {
            id: userId
        }
    });
};
export const updateUserById = async (userId,updateData) => {
    return await prisma.user.update({
        where: {
            id: userId
        },
        data:updateData
    });
};
export const getAllUser = async () => {
    return await prisma.user.findMany({
        orderBy:{
         created_at:"desc"
        }
     });
};