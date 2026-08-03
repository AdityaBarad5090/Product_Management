import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
    title: "Product Management",
    description: "Manage your products efficiently",
};

export default function Home() {
    return (
        <div className={styles.wrapper}>

            <div className={styles.icon}>📦</div>

            <h1 className={styles.title}>Product Management</h1>

            <p className={styles.subtitle}>Manage your products efficiently</p>

            <div className={styles.buttons}>
                <Link href="/login/admin">
                    <button className={styles.btnPrimary}>Admin Login</button>
                </Link>

                <Link href="/login/client">
                    <button className={styles.btnSecondary}>Client Login</button>
                </Link>
            </div>

            <p style={{ marginTop: "16px", fontSize: "13px", color: "var(--muted)" }}>
                New client?{" "}
                <Link href="/register" style={{ color: "var(--accent)" }}>
                    Register here
                </Link>
            </p>

            <p className={styles.footer}>© 2024 Product Management System</p>

        </div>
    );
}
