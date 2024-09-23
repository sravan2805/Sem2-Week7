import jwt from 'jsonwebtoken'; 
import bcrypt from 'bcryptjs';
import Member from '../models/member.model.js';
import Admin from '../models/admin.model.js';
import generateTokenSetCookie from '../utils/generateToken.js';

// Sign-up logic for both members and admins
export const signUpUser = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Basic validation to ensure input is provided
    if (!userName || !password) {
      return res.status(400).json({ error: 'Please provide both username and password' });
    }

    const existingUser = await Member.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newMember = new Member({ userName, password: hashedPassword });
    await newMember.save();

    generateTokenSetCookie(newMember._id, res);

    res.status(201).json({ userName: newMember.userName, _id: newMember._id });
  } catch (error) {
    console.error('Error in signUpMember controller:', error.message);  // Log the error
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Log-in logic for both members and admins
export const logInUser = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Basic validation for username and password
    if (!userName || !password) {
      return res.status(400).json({ error: 'Please provide both username and password' });
    }

    // Find user by username
    const member = await Member.findOne({ userName });
    if (!member) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the provided password matches the hashed password in the database
    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: member._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Set JWT as a cookie (if using cookies) or return it in the response
    res.cookie('jwt', token, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Ensure the cookie is sent over HTTPS in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error in logInMember controller:', error.message);  // Log the error
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Log-out logic
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};

// Change password logic
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



// Delete account logic
export const deleteUserAccount = async (req, res) => {
  try {
    const user = req.user; // Comes from protectRoute middleware

    await (user.isAdmin ? Admin.findByIdAndDelete(user._id) : Member.findByIdAndDelete(user._id));

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
