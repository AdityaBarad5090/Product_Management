import db from "../config/db.js";

export const getCart = (req, res) => {
    const { user_id } = req.params;

    db.query(
        `SELECT cart.id, cart.quantity, products.name, products.price, products.image
         FROM cart 
         JOIN products ON cart.product_id = products.id 
         WHERE cart.user_id = ?`,
        [user_id],
        (err, result) => {
            if (err) return res.json({ success: false, error: err });
            res.json({ success: true, cart: result });
        }
    );
};

export const addToCart = (req, res) => {
    const { user_id, product_id } = req.body;

    db.query(
        "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
        [user_id, product_id],
        (err, result) => {
            if (err) return res.json({ success: false, error: err });

            if (result.length > 0) {
                
                db.query(
                    "UPDATE cart SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?",
                    [user_id, product_id],
                    (err) => {
                        if (err) return res.json({ success: false, error: err });
                        res.json({ success: true, message: "Quantity updated" });
                    }
                );
            } else {
              
                db.query(
                    "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1)",
                    [user_id, product_id],
                    (err) => {
                        if (err) return res.json({ success: false, error: err });
                        res.json({ success: true, message: "Added to cart" });
                    }
                );
            }
        }
    );
};

export const removeFromCart = (req, res) => {
    db.query(
        "DELETE FROM cart WHERE id = ?",
        [req.params.id],
        (err) => {
            if (err) return res.json({ success: false, error: err });
            res.json({ success: true, message: "Removed from cart" });
        }
    );
};