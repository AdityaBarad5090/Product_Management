"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { toast } from "react-toastify";

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token || role !== "client") {
            window.location.href = "/login/client";
            return;
        }

        const user_id = localStorage.getItem("user_id");
        if (user_id) fetchCart(user_id);
    }, []);

    const fetchCart = async (user_id) => {
        const res = await fetch(`http://localhost:5000/cart/${user_id}`);
        const data = await res.json();
        if (data.success) setCart(data.cart);
    };

    const removeFromCart = async (cart_id) => {
        const res = await fetch(`http://localhost:5000/cart/${cart_id}`, {
            method: "DELETE",
        });
        const data = await res.json();
        if (data.success) {
            const user_id = localStorage.getItem("user_id");
            fetchCart(user_id);
        }
    };

    const placeOrder = async () => {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) {
            alert("Please login first!");
            return;
        }

        setLoading(true);

        const res = await fetch("http://localhost:5000/orders/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id }),
        });

        const data = await res.json();
        setLoading(false);

        if (data.success) {
            alert("Order placed successfully! ✅");
            setCart([]);  
            window.location.href = "/orders";  
        } else {
            alert(data.message || "Something went wrong!");
        }
    };

    const checkout = async () => {

        if (cart.length === 0) {
            alert("Cart is empty!");
            return;
        }

        const user_id = localStorage.getItem("user_id");
        const res = await fetch(
            "http://localhost:5000/stripe/create-checkout-session",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cart,user_id }),
            }
        );
   
        const data = await res.json();

        if (data.success) {
            window.location.href = data.url;
        }
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className={styles.page}>

            <div className={styles.header}>
                <h1>🛒 My Cart</h1>
                <Link className={styles.btnBack} href="/products" >
                    ← Back to Products
                </Link>
                <button onClick={checkout}>Order Now</button>
            </div>

            {cart.length === 0 && (
                <p className={styles.empty}>Your cart is empty!</p>
            )}

            <div className={styles.cartList}>
                {cart.map(item => (
                    <div key={item.id} className={styles.cartItem}>
                        {item.image
                            ? <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.name} />
                            : <div className={styles.noImage}>📦</div>
                        }
                        <div className={styles.itemInfo}>
                            <h3>{item.name}</h3>
                            <p className={styles.price}>₹{item.price}</p>
                            <p className={styles.quantity}>Qty: {item.quantity}</p>
                            <p className={styles.subtotal}>
                                Subtotal: ₹{item.price * item.quantity}
                            </p>
                        </div>
                        <button className={styles.btnRemove} onClick={() => removeFromCart(item.id)}>  
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            {cart.length > 0 && (
                <div className={styles.totalBox}>
                    <h2>Total: ₹{total}</h2>
                </div>
            )}
        </div>
    );
}