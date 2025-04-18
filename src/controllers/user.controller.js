import { asyncHandler } from "../utils/asyncHandler.js";
import { Apierror } from "../utils/Apierror.js";
import { User } from "../models/user.models.js";
import {uploadoncloudinary} from "../utils/cloudinary.js";
import { Apiresponce } from "../utils/Apiresponce.js";
const registerUser=asyncHandler(async (req, res) => {
     //get user details from frontend 
     //validation -> not empty
     //check if user already exists in db : username ,email
     //chech for images,avatar
     //upload them to cloudianary,avatar
    //create user object -> create entry in db
    //remove password and responce tokeen field from response 
    //check for user creation
    //return response    
    const {fullName,email,username,password}=req.body
    //console.log("email:",email);
    if ([fullName,email,username,password].some((field) => field?.trim() === "")) {
        throw new Apierror(400,"All fields are required")
    }
    const existedUser=await User.findOne({
        $or:[
            {email},
            {username}
        ]
    })
    if (existedUser) {
        throw new Apierror(409,"User already exists")
    }
    const avatarLocalPath=req.files?.avatar[0]?.path;
    //const coverImageLocalPath=req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files &&Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
        
    }
    if (!avatarLocalPath) {
        throw new Apierror("Avatar is required",400)
    }
    const avatar=await uploadoncloudinary(avatarLocalPath)
    const coverImage=await uploadoncloudinary(coverImageLocalPath)
    if (!avatar){
        throw new Apierror(500,"Error uploading avatar")
    }
    const user=await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        username:req.body.username,
        password,
    })
    const CreatedUser=await User.findById(user._id).select(
        "-password -refreshToken "
    )
    if (!CreatedUser) {
        throw new Apierror(500,"Error creating user")
    }
    return res.status(201).json(
        new Apiresponce(200,CreatedUser,"User created successfully")
    )

})
export {registerUser}