import Stripe from "stripe";
import db from "../config/db.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    try {

        const { cart, user_id } = req.body;

        if (!cart || cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty",
            });
        }

        const line_items = cart.map((item) => ({
            price_data: {
                currency: "inr",

                product_data: {
                    name: item.name,
                    description: item.details,
                },

                unit_amount: item.price * 100,
            },

            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            metadata: {
                user_id: user_id,
            },
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
        });

        res.json({
            success: true,
            url: session.url,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const paymentSuccess = async (req, res) => {
    try {
        const { user_id, session_id } = req.body;  // ← add session_id

        // ← get session from Stripe to verify payment
        const session = await stripe.checkout.sessions.retrieve(session_id);

        // ← verify payment was actually successful
        if (session.payment_status !== "paid") {
            return res.status(400).json({
                success: false,
                message: "Payment not completed",
            });
        }

        const { type, product_id, quantity } = session.metadata;

        // ← handle buy_now order
        if (type === "buy_now") {
            const total_price = session.amount_total / 100;

            db.query(
                "INSERT INTO orders (user_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?)",
                [user_id, product_id, quantity, total_price],
                (err) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Order Insert Failed",
                        });
                    }
                    res.json({
                        success: true,
                        message: "Order Placed Successfully",
                    });
                }
            );
        }

        // ← handle cart order
        else {
            db.query(
                `SELECT c.user_id, c.product_id, c.quantity, p.price 
                 FROM cart c 
                 JOIN products p ON c.product_id = p.id 
                 WHERE c.user_id = ?`,
                [user_id],
                (err, cartItems) => {
                    if (err) return res.status(500).json({ success: false, message: "Database Error" });
                    if (cartItems.length === 0) return res.json({ success: false, message: "Cart is empty" });

                    const orderValues = cartItems.map(item => [
                        item.user_id,
                        item.product_id,
                        item.quantity,
                        item.price * item.quantity,
                    ]);

                    db.query(
                        "INSERT INTO orders (user_id, product_id, quantity, total_price) VALUES ?",
                        [orderValues],
                        (err) => {
                            if (err) return res.status(500).json({ success: false, message: "Order Insert Failed" });

                            db.query(
                                "DELETE FROM cart WHERE user_id = ?",
                                [user_id],
                                (err) => {
                                    if (err) return res.status(500).json({ success: false, message: "Cart Clear Failed" });
                                    res.json({ success: true, message: "Order Placed Successfully" });
                                }
                            );
                        }
                    );
                }
            );
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const buyNowCheckout = async (req, res) => {
    try {

        const { user_id, product_id, quantity } = req.body;

        db.query(
            "SELECT * FROM products WHERE id = ?",
            [product_id],
            async (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Database Error",
                    });
                }

                if (result.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "Product not found",
                    });
                }

                const product = result[0];

                const session = await stripe.checkout.sessions.create({

                    payment_method_types: ["card"],

                    line_items: [
                        {
                            price_data: {
                                currency: "inr",

                                product_data: {
                                    name: product.name,
                                    description: product.details,
                                },

                                unit_amount: product.price * 100,
                            },

                            quantity,
                        },
                    ],

                    mode: "payment",

                    metadata: {
                        user_id,
                        product_id,
                        quantity,
                        type: "buy_now",
                    },
                    success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${process.env.CLIENT_URL}/cancel`,
                });

                res.json({
                    success: true,
                    url: session.url,
                });
            }
        );

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

export const stripeWebhook = async (req, res) => {
    console.log("✅ Webhook received");

    res.sendStatus(200);
};