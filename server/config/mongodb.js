import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`);
    
    console.log(`✅ MongoDB connected! DB Name: ${connectionInstance.connection.name}`);
    console.log(`🌐 Connected to Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;