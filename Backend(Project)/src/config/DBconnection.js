import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
    
const connectToDB = async () => {
    
    try {
        await mongoose.connect(process.env.DBCONNECT);
        console.log("Database connected ");
    } catch (error) {
        console.error("ERROR in connecting!", error);
    }
};
    
export default connectToDB;