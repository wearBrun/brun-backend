import prisma from '../db.conntection.js';

export const createProduct = async (productData) => {
    return await prisma.Product.create({
        data: productData
    })
}

export const createMultipleProduct = async (products) => {
    return await prisma.Product.createMany({
        data: products,
        skipDuplicates: true
    })
}

export const fetchAllProduct = async (filter) => {
    return await prisma.Product.findMany(filter)
}

export const fetchProductByProductId = async (ProductId) => {
    return await prisma.Product.findUnique({
        where: {
            id: ProductId
        }
    })
}

export const fetchProductBySlug = async (slug) => {
    return await prisma.Product.findUnique({
        where: {
            slug: slug
        },
        include:{
            image:true,
            category:true,
            subcategory:true,
            review:{
                include:{
                    user:{
                        select:{
                            first_name:true,
                            last_name:true
                        }
                    }
                }
            },
            recommendations1:{
                include:{
                    product2:{
                        include:{
                            image:{
                                where:{
                                    is_banner:true
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

export const fetchProductBySlugAndUserId = async (slug,user_id,product_id) => {
    return await prisma.Product.findUnique({
        where: {
            slug: slug
        },
        include:{
            image:true,
            category:true,
            subcategory:true,
            review:{
                include:{
                    user:{
                        select:{
                            first_name:true,
                            last_name:true
                        }
                    }
                }
            },
            recommendations1:{
                include:{
                    product2:{
                        include:{
                            image:{
                                where:{
                                    is_banner:true
                                }
                            }
                        }
                    }
                }
            },
            wishlist:{
                where:{
                    user_id:user_id,
                    product_id:product_id
                }
            },
            cart:{
                where:{
                    user_id:user_id,
                    product_id:product_id
                }
            }
        }
    })
}

export const updateProductBySlug = async (slug,productData) => {
    return await prisma.Product.update({
        where: {
            slug: slug
        },
        data:productData
    })
}

export const deleteProductBySlug = async (slug) => {
    return await prisma.Product.delete({
        where: {
            slug: slug
        }
    })
}

export const updateTheProductStock = async(productId,quantity)=>{
    return await prisma.Product.update({
        where:{
            id:productId
        },
        data:{
            stock:{
                increment:-quantity
            }
        }
    })
}

export const addProductImage = async (productData) => {
    return await prisma.image.create({
        data: productData
    })
}

export const fetchImageById = async (imageId) => {
    return await prisma.image.findUnique({
        where: {
            id: imageId
        }
    })
}

export const fetchAllImageOfaProduct = async (productId) => {
    return await prisma.image.findMany({
        where: {
            product_id: productId
        }
    })
}

export const bannerImageCheck = async (productId)=>{
    return await prisma.image.findMany({
        where: {
            product_id: productId,
            is_banner:true
        }
    })
}

export const makeImageBannerImage = async (imageId) => {
    return await prisma.image.update({
        where:{
            id:imageId
        },
        data:{
            is_banner:true
        }
    })
}

export const deleteProductImage = async (imageId) => {
    return await prisma.image.delete({
        where: {
            id:imageId
        }
    })
}

export const deleteMultipleProductImage = async (productId) => {
    return await prisma.image.deleteMany({
        where: {
            product_id:productId
        }
    })
}
