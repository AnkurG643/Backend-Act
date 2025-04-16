//require("dotenv").config({path: "./.env"});

import dotenv from "dotenv";
import{ app }from './app.js'
import connectDB from "./db/index.js";
dotenv.config({path: "./.env"});

connectDB()
.then(() => {
    app.listen(process.env.PORT ||8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.error("MongoDB connection error:", error);
})




/*(async()=>{
    try{
         await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
    }catch(e){
        console.log("ERROR",error);
        throw error
    }
})()*/