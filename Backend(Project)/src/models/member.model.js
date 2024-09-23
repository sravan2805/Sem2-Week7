import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
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
        default: false, // Regular users will have isAdmin set to false
    },
}, { timestamps: true });

const Member = mongoose.model("Member", memberSchema);

export default Member;
