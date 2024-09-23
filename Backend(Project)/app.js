import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors
import cookieParser from 'cookie-parser'; // For handling cookies
import helmet from 'helmet'; // For securing HTTP headers
import rateLimit from 'express-rate-limit'; // To prevent brute-force attacks
import router from './src/router/admin.routes.js'; // Admin Routes
import memberRoutes from './src/router/member.routes.js'; // Member Routes
import connectToDB from './src/config/DBconnection.js'; // Database Connection

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to parse incoming JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Security Middleware
app.use(helmet()); // Secure HTTP headers

// CORS Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || '*', // Modify this to restrict to a specific domain for security
  credentials: true, // To allow sending cookies in cross-origin requests
};
app.use(cors(corsOptions)); // Enable CORS for all routes with specific options

// Rate limiting middleware to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/admin', router); // Admin routes
app.use('/api/member', memberRoutes); // Member routes

// Connect to the Database
connectToDB();

// Catch-all route for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
