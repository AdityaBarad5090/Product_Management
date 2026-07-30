import express from "express";
import { getCart, addToCart, removeFromCart } from "../controllers/cartcontroller.js";


const router = express.Router();

router.get("/:user_id", getCart);       
router.post("/", addToCart);            
router.delete("/:id", removeFromCart);  

export default router;