"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { toast } from "react-toastify";

export default function ClientLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        setError("");

        if (!email || !password) {
            toast.warning("Please enter email and password");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/client-login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await res.json();

            if (!data.success) {
                toast.error(data.message);
                return;
            }

            toast.success("User Login Successfully");

            localStorage.setItem("role", "client");
            localStorage.setItem("token", data.token);
            localStorage.setItem("user_id", data.user.id);

            router.push("/products");
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className={styles.wrapper}>
            <div className={styles.box}>

                <div className={styles.header}>
                    <div className={styles.icon}>📦</div>
                    <h1>Client Login</h1>
                    <p className={styles.subtitle}>Login to view products</p>
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.fields}>
                    <div className={styles.field}>
                        <label>Email</label>
                        <input type="email" placeholder="Enter Email"
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className={styles.field}>
                        <label>Password</label>
                        <input type="password" placeholder="Enter Password"
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>

                <button
                    className={styles.btn}
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
                
                <p className={styles.footer}>
                    Don't have an account?{" "}
                    <Link href="/register">Register</Link>
                </p>
                <p className={styles.footer}>
                    <Link href="/">Back To Home Page</Link>
                </p>

            </div>
        </div>
    );
}