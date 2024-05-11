import ImageKit from 'imagekit';
import env from '../env.js';
// import fs from 'fs';
import fs from 'fs/promises';

const imagekit = new ImageKit({
    publicKey: env.imagekit_publicKey,
    privateKey: env.imagekit_privateKey,
    urlEndpoint: env.imagekit_urlEndpoint
});

export const deleteImage = async (imageId) => {
    return imagekit.deleteFile(imageId);
};


export const multiUpload = async (images) => {
    const uploadPromises = images.map((image) => {
        return singleUpload(image);
    });

    try {
        const results = await Promise.all(uploadPromises);
        return results;
    } catch (error) {
        throw error;
    }
}

export const singleUpload = async (image) => {
    const fileBuffer = await fs.readFile(image.path);
    const options = {
        file:fileBuffer.toString('base64'),
        fileName: image.originalname,
        folder: '/products',
    };
    try {
        const uploadResponse = await imagekit.upload(options);
        return uploadResponse
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}


export const view_image_details = (image_id) => {
    return imagekit.getFileDetails(image_id)
}
