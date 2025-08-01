import express from "express";
import { getLeetCodeContests } from "../controller/plateforms/LeetcodeController.js";

const router = express.Router();

router.get("/contests", getLeetCodeContests);

export default router;
