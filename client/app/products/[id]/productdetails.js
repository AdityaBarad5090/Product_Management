"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./page.module.css";
import { toast } from "react-toastify";
import Link from "next/link";

export default function ProductDetail() {
    const { id } = useParams();  // ← get id from URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token || role !== "client") {
            window.location.href = "/login/client";
            return;
        }

        fetchProduct();
    }, []);

    const fetchProduct = async () => {
        const res = await fetch(`http://localhost:5000/products/${id}`);
        const data = await res.json();
        if (data.success) {
            setProduct(data.product);
            setLoading(false);
        }
    };

    const addToCart = async () => {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) { alert("Please login first!"); return; }

        const res = await fetch("http://localhost:5000/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, product_id: id }),
        });
        const data = await res.json();
        if (data.success) toast.success("Added to cart! ✅");
    };

    const placeOrder = async () => {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) { toast.error("Please login first!"); return; }

        const res = await fetch("http://localhost:5000/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id,
                product_id: id,
                quantity,
                total_price: product.price * quantity,
            }),
        });
        const data = await res.json();
        if (data.success) {
            toast.success("Order placed! ✅");
            window.location.href = "/orders";
        }
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.skeleton}>
                    <div className={styles.skeletonImage}></div>
                    <div className={styles.skeletonContent}>
                        <div className={styles.skeletonText}></div>
                        <div className={styles.skeletonTextShort}></div>
                        <div className={styles.skeletonTextShort}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className={styles.page}>
                <p className={styles.empty}>Product not found!</p>
            </div>
        );
    }

    const buyNow = async () => {

        const user_id = localStorage.getItem("user_id");

        if (!user_id) {
            alert("Please login first");
            return;
        }

        const res = await fetch(
            "http://localhost:5000/stripe/buy-now",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id,
                    product_id: Number(id),
                    quantity,
                }),
            }
        );

        const data = await res.json();

        if (data.success) {
            window.location.href = data.url;
        } else {
            alert(data.message);
        }
    };

    return (
        <div className={styles.page}>

            <div className={styles.header}>
                <Link
                    className={styles.btnBack}
                    href="/products"
                >
                    ← Back to Products
                </Link>
                <div className={styles.headerActions}>
                    <Link href="/cart" className={styles.btnCart}>🛒 Cart</Link>
                    <Link href="/orders" className={styles.btnOrders}>🛍️ Orders</Link>
                </div>
            </div>

            <div className={styles.detail}>

                <div className={styles.imageBox}>
                    {product.image
                        ? <img
                            src={`http://localhost:5000/uploads/${product.image}`}
                            alt={product.name}
                        />
                        : <div className={styles.noImage}>📦</div>
                    }
                </div>
 
                <div className={styles.info}>
                    <span className={styles.category}>{product.category}</span>
                    <h1 className={styles.name}>{product.name}</h1>
                    <p className={styles.price}>₹{product.price}</p>
                    <p className={styles.details}>{product.details}</p>

                    <div className={styles.quantityBox}>
                        <label>Quantity:</label>
                        <div className={styles.quantityControls}>
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className={styles.qtyBtn}
                            >−</button>
                            <span className={styles.qtyValue}>{quantity}</span>
                            <button 
                                onClick={() => setQuantity(q => q + 1)}
                                className={styles.qtyBtn}
                            >+</button>
                        </div>
                    </div>

                    {/* ── Total ── */}
                    <p className={styles.total}>
                        Total: ₹{product.price * quantity}
                    </p>

                    {/* ── Buttons ── */}
                    <div className={styles.btnGroup}>
                        <button
                            className={styles.btnAddCart}
                            onClick={addToCart}
                        >
                            🛒 Add to Cart
                        </button>
                        <button
                            className={styles.btnOrder}
                            onClick={buyNow}
                        >
                            🛍️ Order Now
                        </button>
                    </div>
                </div>
            </div>                               
        </div>
    );
}