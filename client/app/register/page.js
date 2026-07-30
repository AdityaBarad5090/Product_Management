"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { toast } from "react-toastify";



export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRegister = async () => {
        setError("");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();

        if (!email || !password || !name) {
            toast.error("Please Enter All Fields");
        } else if (!data.success) {
            toast.error(data.message);
            return;
        } else {
            router.push("/login/client");
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.box}>

                <div className={styles.header}>
                    <div className={styles.icon}>📦</div>
                    <h1>Create Account</h1>
                    <p className={styles.subtitle}>Register to get started</p>
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.fields}>
                    <div className={styles.field}>
                        <label>Name</label>
                        <input type="text" placeholder="Enter Name"
                            onChange={(e) => setName(e.target.value)} required />
                    </div>

                    <div className={styles.field}>
                        <label>Email</label>
                        <input type="email" placeholder="Enter Email"
                            onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className={styles.field}>
                        <label>Password</label>
                        <input type="password" placeholder="Enter Password"
                            onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                </div>

                <button className={styles.btn} onClick={handleRegister}>Register</button>

                <p className={styles.footer}>
                    Already have an account?{" "}
                    <Link href="/login/client">Login</Link>
                </p>
                <p className={styles.footer}>
                    <Link href="/">Back To Home Page</Link>
                </p>

            </div>
        </div>
    );
}