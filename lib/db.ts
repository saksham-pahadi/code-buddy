import mongoose from "mongoose";


const MONGO_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  if (!MONGO_URI) {
    throw new Error("MONGODB_URI environment variable is not defined.");
  }

  return mongoose.connect(MONGO_URI, {
      dbName: "code-buddy", // you can change this db name
    }); // ✅ no need for options
}

export default connectDB;
