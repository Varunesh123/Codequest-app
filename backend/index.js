import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from './config/connectDB.js'; // ✅ Fixed here

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is Working");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
