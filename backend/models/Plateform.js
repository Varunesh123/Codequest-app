import mongoose from "mongoose";

const plateformSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true
    },
    logo: String
});
export default mongoose.model("Plateform", plateformSchema);