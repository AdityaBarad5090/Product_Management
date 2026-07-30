"use client";

import styles from "./page.module.css";

export default function LogoutButton() {
    return (
        <button
            className={styles.btnLogout}
            onClick={() => {
                localStorage.removeItem("role");
                localStorage.removeItem("token");
                localStorage.removeItem("user_id");
                window.location.href = "/";
            }}
        >
            Logout
        </button>
    );
}