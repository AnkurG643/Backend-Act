import { asyncHandler } from "../utils/asyncHandler.js";
import { Apierror } from "../utils/Apierror.js";
import { User } from "../models/user.model.js";
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
    const {fullname,email,username,password}=req.body
    //console.log("email:",email);
    if ([fullname,email,username,password].some((field) => field?.trim() === "")) {
        throw new Apierror(400,"All fields are required")
    }
    const existedUser=User.findOne({
        $or:[
            {email},
            {username}
        ]
    })
    if (existedUser) {
        throw new Apierror(409,"User already exists")
    }
    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;
    if (!avatarLocalPath) {
        throw new Apierror(400,"Avatar is required")
    }
    const avatar=await uploadoncloudinary(avatarLocalPath)
    const coverImage=await uploadoncloudinary(coverImageLocalPath)
    if (!avatar){
        throw new Apierror(500,"Error uploading avatar")
    }
    const user=await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        username:username.toLowerCase(),
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