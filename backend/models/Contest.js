import mongoose from "mongoose";

const contestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    plateform: {
        type: String,
        required: true,
        enum: ["Codeforces", "LeetCode", "AtCoder", "HackerRank", "CodeChef", "Others"]
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    duration: {
        type: String
    },
    url: {
        type: String,
        required: true
    },
    tags: [String]
});

export default mongoose.model("Contest", contestSchema);