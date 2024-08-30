import express from 'express';
import adminAuth from '../Middleware/adminAuth.js';
import upload from '../Cloudinary/multer.js';

const router = express.Router();

import { verifyLogin, getUserDetails, addUser, deleteUser, getUserToEdit, editUser } from '../Controllers/AdminController.js';

router.post('/login', verifyLogin);
router.get('/user-details',adminAuth, getUserDetails);
router.post('/add-user',adminAuth, addUser);
router.get('/edit-user/:userId',adminAuth, getUserToEdit);
router.put('/edit-user/:userId',adminAuth, upload.single('profileImage'), editUser);
router.delete('/delete-user/:id',adminAuth, deleteUser);


export default router;