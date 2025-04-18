import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });
  const uploadoncloudinary = async (localfilePath) => {
   try{
    if (!localfilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localfilePath, {
            resource_type: "auto"
        })
        //file hasbeen uploaded on cloudinary
        //console.log("File uploaded on cloudinary", response.url);
        fs.unlinkSync(localfilePath)
        return response;
   }catch(error){
    fs.unlinkSync(localfilePath)
   }
  }
  export {uploadoncloudinary}