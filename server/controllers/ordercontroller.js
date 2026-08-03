import db from "../config/db.js";
import sendEmail from "../utils/sendEmail.js";
import orderConfirmedTemplate from "../templates/orderConfirmedTemplate.js";

export const getAllOrders = (req, res) => {
    db.query(
        `SELECT orders.id, orders.quantity, orders.total_price, 
         orders.status, orders.created_at,
         clients.name as user_name, clients.email as user_email,
         products.name as product_name, products.image as product_image
         FROM orders
         JOIN clients ON orders.user_id = clients.id
         JOIN products ON orders.product_id = products.id
         ORDER BY orders.created_at DESC`,
        (err, result) => {
            if (err) return res.json({ success: false, error: err });
            res.json({ success: true, orders: result });
        }
    );
};

export const getUserOrders = (req, res) => {
    const { user_id } = req.params;
    db.query(
        `SELECT orders.id, orders.quantity, orders.total_price,
         orders.status, orders.created_at,
         products.name as product_name, products.image as product_image,
         products.price as product_price
         FROM orders
         JOIN products ON orders.product_id = products.id
         WHERE orders.user_id = ?
         ORDER BY orders.created_at DESC`,
        [user_id],
        (err, result) => {
            if (err) return res.json({ success: false, error: err });
            res.json({ success: true, orders: result });
        }
    );
};

export const placeOrder = (req, res) => {
    const { user_id, product_id, quantity, total_price } = req.body;

    db.query(
        "INSERT INTO orders (user_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?)",
        [user_id, product_id, quantity || 1, total_price],
        (err, result) => {
            if (err) return res.json({ success: false, error: err });
            res.json({ success: true, message: "Order placed!", id: result.insertId });
        }
    );
};

export const placeOrderFromCart = (req, res) => {
    const { user_id } = req.body;

    db.query(
        `SELECT cart.product_id, cart.quantity, products.price FROM cart JOIN products ON cart.product_id = products.id WHERE cart.user_id = ?`,
        [user_id],
        (err, cartItems) => {
            if (err) return res.json({ success: false, error: err });
            if (cartItems.length === 0) {
                return res.json({ success: false, message: "Cart is empty!" });
            }

            const values = cartItems.map(item => [
                user_id,
                item.product_id,
                item.quantity,
                item.price * item.quantity
            ]);

            db.query(
                "INSERT INTO orders (user_id, product_id, quantity, total_price) VALUES ?",
                [values],
                (err) => {
                    if (err) return res.json({ success: false, error: err });

                    db.query(
                        "DELETE FROM cart WHERE user_id = ?",
                        [user_id],
                        (err) => {
                            if (err) return res.json({ success: false, error: err });
                            res.json({ success: true, message: "Order placed from cart!" });
                        }    
                    );
                }             
            );
        }
    );
};

export const updateOrderStatus = (req, res) => {
    const { status } = req.body;
    const orderId = req.params.id;

    db.query(
        "UPDATE orders SET status = ? WHERE id = ?",
        [status, orderId],
        (err) => {

            if (err) {
                return res.json({
                    success: false,
                    error: err,
                });
            }

            if (status !== "Confirmed") {
                return res.json({
                    success: true,
                    message: "Order status updated!",
                });
            }

            db.query(
                `SELECT c.name,c.email,p.name AS product_name,o.quantity,o.total_price FROM orders o JOIN clients c ON o.user_id = c.id JOIN products p ON o.product_id = p.id WHERE o.id = ?`,
                [orderId],
                async (err, result) => {

                    if (err) {
                        return res.json({
                            success: false,
                            error: err,
                        });
                    }

                    if (result.length === 0) {
                        return res.json({
                            success: false,
                            message: "Order not found",
                        });
                    }

                    const order = result[0];

                    res.json({
                        success: true,
                        message: "Order confirmed",
                    });

                    sendEmail({
                        to: order.email,
                        subject: "🎉 Order Confirmed",
                        html: orderConfirmedTemplate(order),
                    })
                        .then(() => {
                            console.log("Email sent");
                        })
                        .catch((err) => {
                            console.log(err);
                        });                                                 
                }
            );
        }
    );
};
