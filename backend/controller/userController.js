import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js";

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if(existingUser) res.status(400).json({message : "User already registered"});

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name, 
            email,
            password: hashedPassword
        });
        const token = jwt.sign({id : newUser._id}, process.env.JWT_SECRET, {expired: '7d'});

        res.status(200).json({message: "User registered Successfully"});
    } catch (error) {
        res.status(500).json({message: "User failed to register"});
    }
}
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            res.status(404).json({message: "Email or Password is missing"});
        }  
        const user = await User.findOne({email});
        if(!user) res.status(404).json({message: "User not found"});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) res.status(400).json({message: "Invalid credntials"});

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.status(200).json({user, token, message: "User logged in successfully"});
    } catch (error) {
        res.status(500).json({message: "User logged in failed", error});
    }
}
export const addToFavorites = async (req, res) => {
    try { 
        const userId = req.user.id;
        const contestId = req.params.contestId;

        const user = await User.findById(userId);
        if(user.favorites.includes(contestId)){
            res.status(400).json({message : "Already added in favorite list"})
        }
        user.favorites.push(contestId);
        await user.save();
        res.status(200).json({message: "Added to favorites", favorites: user.favorites})
    } catch (error) {
        res.status(500).json({message : "Failed to add in favorite list", error})
    }
}
export const getUserProfiles = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate("favorites");
        res.status(200).json(user)
    } catch (error) {
        res.status(450).json({message : "Failed to fetched user profile"});
    }
}