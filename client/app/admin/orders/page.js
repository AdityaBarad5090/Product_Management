"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { toast } from "react-toastify";

const API = `${process.env.NEXT_PUBLIC_API_URL}/orders`;

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeStatus, setActiveStatus] = useState("All");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token || role !== "admin") {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "/login/admin";
            return;
        }

        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch(API, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
            setOrders(data.orders);
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        const data = await res.json();
        if (data.success) {
            setOrders(prevOrders => prevOrders.map(order => order.id === id ? { ...order, status } : order));
            toast.success("Order status updated successfully!");
            fetchOrders();
        }
    };

    // ← status color
    const getStatusColor = (status) => {
        if (status === "Pending") return styles.statusPending;
        if (status === "Confirmed") return styles.statusConfirmed;
        if (status === "Delivered") return styles.statusDelivered;
    };

    // ← filter by status
    const filtered = activeStatus === "All"
        ? orders
        : orders.filter(o => o.status === activeStatus);

    return (
        <div className={styles.page}>

            {/* ── Header ── */}
            <div className={styles.pageHeader}>
                <h1>🛍️ Manage Orders</h1>
                <div className={styles.headerActions}>
                    <Link href="/admin/home" className={styles.btnHome}>Home</Link>
                    <Link href="/admin/dashboard" className={styles.btnDashboard}>Products</Link>
                    <Link href="/" className={styles.btnLogout} onClick={() => {
                        localStorage.removeItem("role");
                        localStorage.removeItem("token");
                    }}>Logout</Link>
                </div>
            </div>

            {/* ── Status Filter Tabs ── */}
            <div className={styles.tabs}>
                {["All", "Pending", "Confirmed", "Delivered"].map(status => (
                    <button
                        key={status}
                        className={`${styles.tab} ${activeStatus === status ? styles.activeTab : ""}`}
                        onClick={() => setActiveStatus(status)}
                    >
                        {status}
                        <span className={styles.tabCount}>
                            {status === "All"
                                ? orders.length
                                : orders.filter(o => o.status === status).length
                            }
                        </span>
                    </button>
                ))}
            </div>

            {/* ── Loading ── */}
            {loading && <p className={styles.loading}>Loading orders...</p>}

            {/* ── Empty State ── */}
            {!loading && filtered.length === 0 && (
                <p className={styles.empty}>No orders found!</p>
            )}

            {/* ── Orders Table ── */}
            {!loading && filtered.length > 0 && (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Image</th>
                                <th>Product</th>
                                <th>Customer</th>
                                <th>Qty</th>
                                <th>Total</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(order => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>
                                        {order.product_image ? (
                                            <img
                                                className={styles.productImg}
                                                src={order.product_image}
                                                alt={order.product_name}
                                            />
                                        ) : (
                                            <div className={styles.noImg}>📦</div>
                                        )}
                                    </td>
                                    <td>{order.product_name}</td>
                                    <td>
                                        <p className={styles.customerName}>{order.user_name}</p>
                                        <p className={styles.customerEmail}>{order.user_email}</p>
                                    </td>
                                    <td>{order.quantity}</td>
                                    <td>₹{order.total_price}</td>
                                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`${styles.status} ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className={styles.statusSelect}
                                            value={order.status}
                                            onChange={e => updateStatus(order.id, e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}