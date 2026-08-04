"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token || role !== "client") {
            window.location.href = "/login/client";
            return;
        }

        const user_id = localStorage.getItem("user_id");
        if (user_id) fetchOrders(user_id);
    }, []);

    const fetchOrders = async (user_id) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${user_id}`);
        const data = await res.json();
        if (data.success) {
            setOrders(data.orders);
            setLoading(false);
        }
    };

    // ← status color
    const getStatusColor = (status) => {
        if (status === "Pending") return styles.statusPending;
        if (status === "Confirmed") return styles.statusConfirmed;
        if (status === "Delivered") return styles.statusDelivered;
    };

    return (
        <div className={styles.page}>

            {/* ── Header ── */}
            <div className={styles.header}>
                <h1>🛍️ My Orders</h1>
                <Link href="/products" className={styles.btnBack}>
                    ← Back to Products
                </Link>
            </div>

            {/* ── Loading ── */}
            {loading && <p className={styles.loading}>Loading orders...</p>}

            {/* ── Empty State ── */}
            {!loading && orders.length === 0 && (
                <p className={styles.empty}>No orders yet!</p>
            )}

            {/* ── Orders List ── */}
            <div className={styles.ordersList}>
                {orders.map(order => (
                    <div key={order.id} className={styles.orderCard}>

                        {/* ── Product Image ── */}
                        <div className={styles.orderImage}>
                            {order.product_image
                                ? <img
                                    src={order.product_image}
                                    alt={order.product_name}
                                />
                                : <div className={styles.noImage}>📦</div>
                            }
                        </div>

                        {/* ── Order Info ── */}
                        <div className={styles.orderInfo}>
                            <h3>{order.product_name}</h3>
                            <p className={styles.price}>₹{order.product_price}</p>
                            <p className={styles.quantity}>Qty: {order.quantity}</p>
                            <p className={styles.total}>Total: ₹{order.total_price}</p>
                            <p className={styles.date}>
                                Ordered: {new Date(order.created_at).toLocaleDateString()}
                            </p>
                        </div>

                        {/* ── Status Badge ── */}
                        <div className={`${styles.status} ${getStatusColor(order.status)}`}>
                            {order.status}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}