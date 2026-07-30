"use client";

import styles from "./page.module.css";

export default function Sidebar({
    categories,
    activeCategory,
    setActiveCategory,
    setPage,
}) {
    return (
        <div className={styles.sidebar}>
            <h3>Categories</h3>

            <ul>
                {categories.map((cat) => (
                    <li
                        key={cat}
                        className={activeCategory === cat ? styles.active : ""}
                        onClick={() => {
                            setActiveCategory(cat);
                            setPage(1);
                        }}
                    >
                        {cat}
                    </li>
                ))}
            </ul>
        </div>
    );
}