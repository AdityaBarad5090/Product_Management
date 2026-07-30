import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    // get token from request header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    try {
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // ← save user data in request    
        next();              // ← allow request to continue
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Admin access only" });
        }
        next();
    });
};

export const verifyClient = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== "client") {
            return res.status(403).json({ success: false, message: "Client access only" });
        }
        next();
    });
};