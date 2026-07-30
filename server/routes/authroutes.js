import express from "express";
import { register, adminLogin, clientLogin } from "../controllers/authcontroller.js";

const router = express.Router();

router.post("/register", register);
router.post("/admin-login", adminLogin);
router.post("/client-login", clientLogin);

export default router;