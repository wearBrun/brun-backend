import prisma from '../db.conntection.js';

export const createSubCategory = async (subcategoryData) => {
    return await prisma.ProductSubCategory.create({
        data: subcategoryData
    });
};

export const fetchAllSubCategoriesOfACategory = async (categoryId) => {
    return await prisma.ProductSubCategory.findMany({
        where:{
            category_id:categoryId
        }
    });
};

export const fetchSubCategory = async (subCategoryId) => {
    return await prisma.ProductSubCategory.findUnique({
        where: {
            id: subCategoryId
        }
    });
};

export const updateSubCategory = async (subCategoryId, subcategoryData) => {
     await prisma.ProductSubCategory.update({
        where: {
            id: subCategoryId
        },
        data: subcategoryData
    });
};

export const deleteSubCategory = async (subCategoryId) => {
    await prisma.ProductSubCategory.delete({
       where: {
           id: subCategoryId
       }
   });
};

export const deleteSubCategoryFromCategoryId = async (CategoryId) => {
    await prisma.ProductSubCategory.deleteMany({
       where: {
        category_id: CategoryId
       }
   });
};