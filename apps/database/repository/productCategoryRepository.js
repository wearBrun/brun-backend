import prisma from '../db.conntection.js';

export const createCategory = async (categoryName) => {
    return await prisma.ProductCategory.create({
        data: {
            category_name: categoryName
        }
    });
};

export const fetchAllCategories = async () => {
    return await prisma.ProductCategory.findMany();
};

export const fetchCategory = async (categoryId) => {
    return await prisma.ProductCategory.findUnique({
        where: {
            id: categoryId
        },
        include:{
            subcategory:true  
        }
    });
};

export const updateCategory = async (categoryId, categoryName) => {
     await prisma.ProductCategory.update({
        where: {
            id: categoryId
        },
        data: {
            category_name: categoryName
        }
    });
};

export const deleteCategory = async (categoryId) => {
    await prisma.ProductCategory.delete({
       where: {
           id: categoryId
       }
   });
};