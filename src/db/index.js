import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const { connection: ConnectionInstance, ConnectionStates } = mongoose;

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(
            `MongoDB connected successfully || DB Host: ${ConnectionInstance.host} || DB Name: ${ConnectionInstance.name}`
        );
    } catch (error) {
        console.log("ERROR:", error);
        process.exit(1);
    }
};

export default connectDB;
