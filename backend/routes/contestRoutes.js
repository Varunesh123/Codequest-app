import express from 'express';
import { 
    getAllContests, 
    getContestById, 
    createContest, 
    deleteContest
} from '../controller/contestController.js';

const router = express.Router();

router.get('/', getAllContests);
router.get('/:id', getContestById);
router.post('/', createContest);
router.delete('/:id', deleteContest);

export default router;