import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://Mongo123:Mongo123@cluster0.zf66u.mongodb.net/Codequest?retryWrites=true&w=majority&appName=Cluster0");
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.log("❌ MongoDB Error:", error.message);
    }
};

export default connectDB;
