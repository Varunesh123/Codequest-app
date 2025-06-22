import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contest',
        required: true
    },
    reminderTime: {
        type: Date,
        required: true
    },
    sent: {
        type: Boolean,
        default: false
    }
});
export default mongoose.model("Reminder", reminderSchema);