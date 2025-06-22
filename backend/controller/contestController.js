import Contest from "../models/Contest.js";

export const getAllContests = async () => {
    try {
        const allContests = await Contest.find().sort({startTime : 1});
        res.status(200).json(allContests);
    } catch (error) {
        res.status(500).json({message : "Server error", error})
    }
}
export const getContestById = async (req, res) => {
    const id = req.params.id;
    if(!id){
        res.status(404).json({message: "Id is Missing"});
    }
    try {
        const contest = await Contest.findById(id);
        if(!contest){
            res.status(404).json({message: "Contest not found"})
        }
        res.status(200).json(contest)
    } catch (error) {
        res.status(500).json({message: "Server error", error})
    }
}
export const createContest = async () => {
    try {
        const newContest = new Contest({
            name,
            plateform,
            startTime,
            endTime,
            duration,
            url,
            tags
        })
        await newContest.save();
        res.status(201).json({newContest, message: "Contest created successfully"});
    } catch (error) {
        res.status(500).json({message: "Failed to create contest", error});
    }
}
export const deleteContest = async (req, res) => {
    try {
        const id = req.params.id
        if(!id) res.status(404).json({message: "Id is missing"});
        const contest = await Contest.findById(id);
        if(!contest) res.status(404).json({message: "Contest is missing"});

        await contest.deleteOne();
        res.status(200).json({message: "Contest is deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Failed to delete contest", error});
    }
}