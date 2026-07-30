"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { toast } from "react-toastify";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        setError("");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if(!email || !password){
            toast.warning("Please Enter Email And Password");
        }else if (!data.success) {
            toast.error(data.message);
            return;
        }else{
            toast.success("Admin Login Successfully");
            localStorage.setItem("role", "admin");
            localStorage.setItem("token",data.token);
            router.push("/admin/home");
        }

    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.box}>

                <div className={styles.header}>
                    <div className={styles.icon}>🔐</div>
                    <h1>Admin Login</h1>
                    <p className={styles.subtitle}>Access the admin dashboard</p>
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

                <button className={styles.btn} onClick={handleLogin}>Login</button>

                <p className={styles.footer}>
                    <Link href="/">Back To Home Page</Link>
                </p>

            </div>
        </div>
    );
}