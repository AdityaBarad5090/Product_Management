import express from "express";
import {
    createCheckoutSession,
    paymentSuccess,
    buyNowCheckout,
    stripeWebhook,
} from "../controllers/stripecontroller.js";

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.post("/payment-success", paymentSuccess);
router.post("/buy-now", buyNowCheckout);

// 👇 New Webhook Route
router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhook
);

export default router;