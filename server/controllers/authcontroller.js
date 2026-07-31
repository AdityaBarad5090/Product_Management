import db from "../config/db.js";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !name || !password) {
        return res.status(400).json({
            success: "False",
            message: "All Fields Are Required"
        });
    }
    const sql = "INSERT INTO clients (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Registration Failed" });
        }
        res.status(201).json({ success: true, message: "User Registered Successfully" });
    });
};

export const adminLogin = (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM admins WHERE email = ? AND password = ?", [email, password], (err, result) => {
        if (err) {
            console.error("Admin Login Db Error:", err);
            return res.status(500).json({ success: false, message: "Server Error" });
        }

        if (result.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid Email or Password" });
        }

        const token = jwt.sign(
            { id: result[0].id, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            success: true,
            message: "Login Successful",
            token,
        });
    });
};

export const clientLogin = (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM clients WHERE email = ? AND password = ?", [email, password], (err, result) => {
        if (err) {
            console.error("Client Login Db Error:", err);
            return res.status(500).json({ success: false, message: "Server Error" });
        }
        if (result.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid Email or Password" });
        }

        const token = jwt.sign(
            { id: result[0].id, role: "client" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: result[0].id,
                name: result[0].name,
                email: result[0].email,
            }
        });
    });
};