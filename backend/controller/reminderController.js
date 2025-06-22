import Reminder from "../models/Reminder";
import Contest from "../models/Contest";
import User from "../models/User";

export const setReminder = async(req, res) => {
    try {
        const userId = req.user.id;
        const contestId = req.params.contestId;
        const { remiderTime } = req.body;

        const user = await User.findById(userId);

        const reminder = new Reminder({
            user: user,
            contest: contestId,
            remiderTime,
        })
        await reminder.save();
        res.status(200).json({message: "set Reminder", reminder});
    } catch (error) {
        res.status(500).json({message: "Failed to set Reminder", error});
    }
}
export const getUserReminders = async(req, res) => {
    try {
        const reminders = await Reminder.find({user: req.user.id}).populate("contest");
        res.status(200).json({message: "Get all reminders"}, reminders);
    } catch (error) {
        res.status(500).json({message: "Failed to get reminders"}, error);
    }
}
export const deleteReminders = async(req, res) => {
    try {
        await Reminder.findOneAndDelete(req.params.reminderId);
        res.status(200).json({ message: "Reminder deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting reminder", error });
    }
}