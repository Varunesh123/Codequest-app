import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authUser = async(req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) res.status(401).json({message: 'Unauthorized'});
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        res.status(500).json({message: "Token Failed", error});
    }
}
export default authUser;