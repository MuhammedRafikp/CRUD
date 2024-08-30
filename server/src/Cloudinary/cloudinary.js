import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = (imageBuffer) => {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream({ folder: 'profiles' }, (error, result) => {
            if (error) {
                return reject(new Error('Failed to upload image'));
            }
            resolve(result.secure_url);
        }).end(imageBuffer);
    });
};

export default uploadImage;
