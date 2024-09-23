import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';
import Member from '../models/member.model.js'; // Assuming users are separate from admins.
import generateTokenSetCookie from '../utils/generateToken.js'; // Ensure this is a utility for generating JWTs

// Admin Sign Up
export const signUpAdmin = async (req, res) => {
    try {
      const { userName, password } = req.body;
  
      console.log(req.body); // Add this to see if userName and password are being passed
  
      if (!userName || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      // Check if the admin already exists
      const existingAdmin = await Admin.findOne({ userName });
      if (existingAdmin) {
        return res.status(400).json({ error: "Admin already exists" });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
  
      const newAdmin = new Admin({ userName, password: hashPassword });
      await newAdmin.save();
  
      // Generate JWT token and set cookie
      generateTokenSetCookie(newAdmin._id, res);
  
      res.status(201).json({ _id: newAdmin._id, userName: newAdmin.userName });
    } catch (error) {
      console.error('Error in signUpAdmin controller:', error.message);
      res.status(500).json({ error: "Server error" });
    }
  };
  

// Admin Login
export const logInAdmin = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const admin = await Admin.findOne({ userName });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token and set cookie
    generateTokenSetCookie(admin._id, res);

    res.status(200).json({ _id: admin._id, userName: admin.userName });
  } catch (error) {
    console.error('Error in logInAdmin controller:', error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Admin Logout
export const logoutAdmin = (req, res) => {
  try {
      console.log("Admin Log Out");
      res.cookie("jwt", "", { maxAge: 0 }); // Clear the JWT cookie
      res.status(200).json({ message: "Logged Out Successfully" });
  } catch (error) {
      console.log("Error in logoutAdmin controller:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
  }
};

// Admin Change Password
export const changePassword = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded.userId;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const { oldPassword, newPassword } = req.body;

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error in changePassword controller:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Admin Delete Account
export const deleteAccountAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.user._id);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: "Admin account deleted successfully" });
  } catch (error) {
    console.error('Error in deleteAccountAdmin controller:', error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Admin-specific functionality: Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await Member.find().select('-password');
    const admins = await Admin.find().select('-password');
    res.status(200).json({ members: users, admins: admins });
  } catch (error) {
    console.error('Error in getAllUsers controller:', error.message);
    res.status(500).json({ error: "Server error" });
  }
};


// Admin-specific: Delete any user account (members or admins)
import mongoose from "mongoose";

export const deleteAnyUserAccount = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        // Attempt to delete a Member
        const user = await Member.findByIdAndDelete(id);

        // If not found, attempt to delete an Admin
        if (!user) {
            const admin = await Admin.findByIdAndDelete(id);
            if (!admin) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json({ message: "Admin deleted successfully" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

