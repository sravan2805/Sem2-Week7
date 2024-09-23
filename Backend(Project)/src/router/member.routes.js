import express from 'express';
import {
  signUpUser,
  logInUser,
  logoutUser,
  deleteUserAccount,
  changePassword,
} from '../controllers/member.controller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

// Routes for signing up, logging in, and logging out
router.post('/signup', signUpUser);        // Sign up route (for members and admins)
router.post('/login', logInUser);          // Login route (for members and admins)
router.get('/logout', protectRoute, logoutUser); // Logout route (protected)

// Routes for password management and account deletion
router.put('/change-password', protectRoute, changePassword); // Change password route (protected)
router.delete('/delete-account', protectRoute, deleteUserAccount); // Delete account route (protected)

export default router;
