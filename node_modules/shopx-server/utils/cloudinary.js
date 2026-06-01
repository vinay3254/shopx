import { v2 as cloudinary } from "cloudinary";
import ApiError from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload a Multer memory buffer to Cloudinary.
 * @param {Buffer} buffer File buffer.
 * @param {string} folder Cloudinary folder name.
 * @returns {Promise<string>} Secure Cloudinary URL.
 */
export const uploadBufferToCloudinary = (buffer, folder = "shopx") =>
  new Promise((resolve, reject) => {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      reject(new ApiError(500, "Cloudinary is not configured"));
      return;
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ fetch_format: "auto", quality: "auto" }]
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });

export default cloudinary;
