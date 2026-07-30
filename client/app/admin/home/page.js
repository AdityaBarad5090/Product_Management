"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";

const API = "http://localhost:5000";

export default function AdminHome() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalUsers: 0,
        totalCategories: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if(!token || !role){
            window.location.href="/admin/login";
        }

        fetch(`${API}/products/stats`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setStats(data.stats);
                    setLoading(false);
                }
            });
    }, []);

    const cards = [
        {
            title: "Total Products",
            value: stats.totalProducts,
            icon: "📦",
            color: "#4f46e5",
        },
        {
            title: "Total Users",
            value: stats.totalUsers,
            icon: "👥",
            color: "#10b981",
        },
        {
            title: "Total Categories",
            value: stats.totalCategories,
            icon: "🗂️",
            color: "#f59e0b",
        },
    ];

    return (
        <div className={styles.page}>

            {/* ── Header ── */}
            <div className={styles.header}>
                <h1>Welcome, Admin 👋</h1>
                <Link
                    href="/"
                    className={styles.btnLogout}
                    onClick={() => {
                        localStorage.removeItem("role");
                        localStorage.removeItem("token");
                    }}
                >
                    Logout
                </Link>
            </div>

            <p className={styles.subtitle}>Here's your store overview</p>

            {/* ── Stats Cards ── */}
            <div className={styles.cards}>
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className={styles.card}
                        style={{ borderTop: `4px solid ${card.color}` }}
                    >
                        <div className={styles.cardIcon}>{card.icon}</div>
                        <div className={styles.cardInfo}>
                            <p className={styles.cardTitle}>{card.title}</p>
                            <h2 className={styles.cardValue}>
                                {loading ? "..." : card.value}
                            </h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Quick Links ── */}
            <div className={styles.quickLinks}>
                <h2>Quick Actions</h2>
                <div className={styles.links}>
                    <Link href="/admin/dashboard" className={styles.link}>
                        📦 Manage Products
                    </Link>
                    <Link href="/admin/orders" className={styles.link}>
                        🛍️ Manage Orders
                    </Link>
                </div>
            </div>

        </div>
    );
}
