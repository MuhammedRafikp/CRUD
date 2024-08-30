import jwt from 'jsonwebtoken';
import User from '../Models/UserModel.js';

const userAuth = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 

    if (token) {
        
        console.log("user auth!!!!!!!!!!!!!!!")

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
           
            if (err) return res.sendStatus(403);
           
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401); 
    }
};

const isValidUser =async (req,res,next)=>{
    try {
        const { payload } = req.user;

        const user = await User.findOne({ _id: payload });

        if (user) {
            next();
        } else {
            res.status(403).json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        console.log(error)
    }
}


export {
    userAuth,
    isValidUser
} 
