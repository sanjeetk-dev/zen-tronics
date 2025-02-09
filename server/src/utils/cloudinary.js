import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import { config } from '../config/dotenv.js'

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })
    fs.unlinkSync(localFilePath)
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath)
    return null;
  }
}

const deleteMultipleFromCloudinary = async (public_ids) => {
  try {
    if (!public_ids || public_ids.length === 0) return null;

    const response = await cloudinary.api.delete_resources(public_ids);

    return response;
  } catch (err) {
    return null
  }
}

const deleteFromCloudinary = async (public_id) => {
  try {
    if (!public_id) return null;

    const response = await cloudinary.uploader.destroy(public_id)

    return response;
  } catch (err) {
    return null
  }
}


export { uploadOnCloudinary, deleteFromCloudinary, deleteMultipleFromCloudinary }