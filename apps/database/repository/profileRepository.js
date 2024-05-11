import prisma from '../db.conntection.js';

export const addAddress = async (profileData) => {
    return await prisma.address.create({
        data:profileData
    });
};

export const fetchAddress = async (profileId) => {
    return await prisma.address.findUnique({
        where: {
            id: profileId
        }
    });
};

export const fetchAllAddressFromUserId = async (userId) => {
    return await prisma.address.findMany({
        where: {
            user_id: userId
        }
    });
};

export const updateAddress = async (profileId, profile) => {
    return await prisma.address.update({
        where: {
            id: profileId
        },
        data: profile
    });
};
export const deleteAddress = async (profileId) => {
    return await prisma.address.delete({
        where: {
            id: profileId
        }
    });
};
export const deleteMultipleAddressOfUser = async (userId) => {
    return await prisma.address.deleteMany({
        where: {
            user_id: userId
        }
    });
};