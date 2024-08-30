import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../Models/UserModel.js';
import generateToken from '../Jwt/jwt.js';
import uploadImage from '../Cloudinary/cloudinary.js';
const profile_url = '/profile.png';

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
};


const signUp = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;

        const hashedPassword = await hashPassword(password);

        const user = new User({
            name,
            email,
            mobile,
            password: hashedPassword,
            profile_url: profile_url
        });

        const userData = await user.save();
        console.log(userData)

        res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }

};


const verifyLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log("req.body", req.body);
    try {
        const userData = await User.findOne({ email });
        console.log("user Data:", userData)
        if (!userData) {
            console.log("Invalid email or password1")
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, userData.password);

        if (!isMatch) {

            console.log("Invalid email or password2");

            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = generateToken(userData._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


const getUserData = async (req, res) => {
    try {

        const { payload } = req.user;

        const user = await User.findOne({ _id: payload });

        if (user) {
            res.status(200).json({
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    profile_url: user.profile_url
                }
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};


const editProfile = async (req, res) => {
    try {
        const { name, email, mobile } = req.body;
        const userId = req.user.userId;

        let profile_url;

        if (req.file) {
            profile_url = await uploadImage(req.file.buffer);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                name,
                email,
                mobile,
                ...(profile_url && { profile_url })
            },
            { new: true }
        );

        if (updatedUser) {
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                user: updatedUser
            });

        } else {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};


export {
    signUp,
    verifyLogin,
    getUserData,
    editProfile
};
