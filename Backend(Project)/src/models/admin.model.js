import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: true, // Admins will always have isAdmin set to true
    },
}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;