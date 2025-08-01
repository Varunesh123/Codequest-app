import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from 'morgan';
import connectDB from './config/connectDB.js'; 
import contestRoutes from './routes/contestRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reminderRoutes from './routes/remiderRoutes.js';
import leetcodeRoutes from './routes/leetcodeRoutes.js';


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use("/api/users", userRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/reminders', reminderRoutes);
app.use("/api/leetcode", leetcodeRoutes);

app.get('/', (req, res) => {
    res.send('Server Api is running');
})
app.use((err, req, res, next) => {
    res.status(501).json({message : err.message});
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
