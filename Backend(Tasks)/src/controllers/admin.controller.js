import bycrypt from 'bcryptjs';
import Admin from '../models/admin.model.js';
import generateTokenSetCookie from "../utils/generateToken.js";

export const signUpAdmin = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await Admin.findOne({userName });
    
        if (user) {
            return res.status(400).json({ error: "User Already Exists" });
        }
        
        //Hashing the password
        const salt = await bycrypt.genSalt(10);
        const hashPassword = await bycrypt.hash (password, salt);
    
        const newUser = new Admin({ 
            userName,
            password: hashPassword,
        })
    
        if (newUser) {
            //Generate JWT tokens
            generateTokenSetCookie(newUser._id, res);
            await newUser.save();
            console.log("New Admin Created")
            res.status(201).json({ 
                _id: newUser._id,
                userName: newUser.userName, 
            })
        }
        else {
            res.status(400).json({ error: "Invalid user data" });
        }
    
    } catch (error) {
        console.log("Error in signUp controller",error.message);
        res.status(500).json({ error: "Internal Server error"})
    }
}
export const logInAdmin = async (req, res) => {
    try {
        const { userName, password} = req.body;
        const user = await Admin.findOne({ userName });
        const isPasswordCorrect = await bycrypt.compare (password, user?.password || "");
    
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ success: false, error: "Invalid Username or Password"});
        }
    
        generateTokenSetCookie(user._id, res);
    
        console.log("Admin Logged In", user);
        res.status(200).json ({success: true, userName: user.userName});
    
    } catch (error) {
        console.log("Error in Login controller", error.message);
        res.status(500).json({success: false, error: 'Internal Server Error' });
    
    }
}
    
export const logoutAdmin = (req, res) => {
    try {
        console.log("Admin Log Out");
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({message: "Logged Out Successfully" });
    } catch (error) {
        console.log("Error in Login controller", error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
}