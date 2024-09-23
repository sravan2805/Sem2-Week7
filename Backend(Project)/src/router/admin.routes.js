import express from 'express';
import { logInAdmin, logoutAdmin, signUpAdmin } from '../controllers/admin.controller.js';
import { getAllUsers, deleteAnyUserAccount } from '../controllers/admin.controller.js';
import protectRoute from '../middleware/protectRoute.js';
import { changePassword } from '../controllers/member.controller.js';

const router = express.Router();

// Admin sign-up and login routes
router.post('/signupAdmin', signUpAdmin);  // Admin-specific sign-up
router.post('/loginAdmin', logInAdmin);    // Admin login
router.get('/logoutAdmin', logoutAdmin); // Admin logout (protected)

// Admin-only routes to manage users
router.put('/change-password',changePassword)
router.get('/users', protectRoute, getAllUsers); // Admins can view all users
router.delete('/delete-user/:id', protectRoute, deleteAnyUserAccount); // Admins can delete any user

export default router;
