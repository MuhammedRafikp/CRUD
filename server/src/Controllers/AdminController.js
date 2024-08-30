import User from "../Models/UserModel.js";
import generateToken from "../Jwt/jwt.js";
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import uploadImage from '../Cloudinary/cloudinary.js';
const profile_url = '/profile.png';


dotenv.config();

const verifyLogin = async (req, res) => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        console.log("adminEmail", adminEmail, "adminPassword", adminPassword)

        const { email, password } = req.body;

        if (email === adminEmail && password === adminPassword) {

            const token = generateToken(adminEmail);

            console.log("token :", token)

            res.status(200).json({
                success: true,
                message: 'Successfully Logged In',
                token: token
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getUserDetails = async (req, res) => {
    try {
        // Get pagination details from query parameters
        const { page = 1, limit = 10 } = req.query;

        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Fetch users with pagination
        const users = await User.find()
            .select('-password')
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        const totalUsers = await User.countDocuments({});

        res.status(200).json({
            success: true,
            users,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching user details',
            error: error.message,
        });
    }
};



const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
};

const addUser = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;

        if (!name || !email || !mobile || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        const hashedPassword = await hashPassword(password);

        const user = new User({
            name,
            email,
            mobile,
            password: hashedPassword,
            profile_url:profile_url
        });

        const userData = await user.save();
        console.log(userData);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                name: userData.name,
                email: userData.email,
                mobile: userData.mobile
            }
        });

    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("delete user")
        console.log("id:", id)

        if (!id) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        // Handle errors
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


const getUserToEdit = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                profile_url: user.profile_url,

            }
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};



const editUser = async (req, res) => {
    try {
        const { name, email, mobile } = req.body;
        const { userId } = req.params;

        console.log("edit user...............", userId);

        const existingUserWithEmail = await User.findOne({ email });
        if (existingUserWithEmail && existingUserWithEmail._id.toString() !== userId) {
            return res.json({
                success: false,
                message: 'Email address already in use'
            });
        }

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
        console.error('Error updating profile:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};


export {
    verifyLogin,
    getUserDetails,
    addUser,
    deleteUser,
    getUserToEdit,
    editUser
}