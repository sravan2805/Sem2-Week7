import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }
        const user = await Admin.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        req.user = user; // Attach user to the request object

        // Check if the user is admin for admin-only routes
        if (req.originalUrl.startsWith('/api/admin') && !user.isAdmin) {
            return res.status(403).json({ error: "Access denied: Admins only" });
        }

        next();
    } catch (error) {
        console.log("Error in protectedRoute middleware:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default protectRoute;
