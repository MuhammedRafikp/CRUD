import express from 'express';
import {userAuth,isValidUser} from '../Middleware/userAuth.js';
import upload from '../Cloudinary/multer.js';

const router = express.Router();

import { signUp, verifyLogin, getUserData, editProfile } from '../Controllers/UserController.js';

router.post('/signup', signUp);
router.post('/login', verifyLogin);
router.get('/user-details',userAuth,isValidUser, getUserData);
router.put('/edit-profile',userAuth,isValidUser, upload.single('profileImage'),editProfile)

export default router;
