"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function SearchBar({ onSearch }) {
    const [search, setSearch] = useState("");

    useEffect(() => {
        onSearch(search);
    }, [search, onSearch]);

    return (
        <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
        />
    );
}