import express from "express";
import {
    getAllOrders,
    getUserOrders,
    placeOrder,
    placeOrderFromCart,
    updateOrderStatus
} from "../controllers/ordercontroller.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyAdmin, getAllOrders);           
router.get("/:user_id", getUserOrders);             
router.post("/", placeOrder);                        
router.post("/cart", placeOrderFromCart);            
router.put("/:id", verifyAdmin, updateOrderStatus);  

export default router;