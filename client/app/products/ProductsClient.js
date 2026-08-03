"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { useCategories } from "../context/CategoryContext";
import { toast } from "react-toastify";
import Link from "next/link";

export default function ProductsClient({ initialProducts }) {
    const API = `${process.env.NEXT_PUBLIC_API_URL}/products`;

    const [products, setProducts] = useState(initialProducts);
    const [activeCategory, setActiveCategory] = useState("All");
    const [search, setSearch] = useState("");
    const { categories } = useCategories();
    const [page, setPage] = useState(1);
    const [perPage] = useState(12);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        getProducts(page, search, activeCategory);
    }, [page, search, activeCategory]);

    const getProducts = async (pageNo, searchText, category) => {
        const res = await fetch(
            `${API}?page=${pageNo}&limit=${perPage}&search=${encodeURIComponent(searchText)}&category=${encodeURIComponent(category)}`
        );

        const data = await res.json();

        if (data.success) {
            setProducts(data.products);
            setTotalPages(data.totalPages);
        }
    };

    const addToCart = async (product_id) => {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) {
            toast.error("Please login first!");
            return;
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, product_id }),
        });
        const data = await res.json();
        if (data.success) toast.success("Added to cart! ✅");
    };


    return (
        <div>

            <div className={styles.searchBar}>
                <input
                    className={styles.searchInput}
                    placeholder="🔍 Search products..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
                {search && (
                    <button
                        className={styles.clearSearch}
                        onClick={() => setSearch("")}
                    >
                        ✕
                    </button>
                )}
            </div>

            <div className={styles.layout}>

                <div className={styles.sidebar}>
                    <h3>Categories</h3>
                    <ul>
                        {categories.map(cat => (
                            <li
                                key={cat}
                                className={activeCategory === cat ? styles.active : ""}
                                onClick={() => { setActiveCategory(cat); setPage(1); }}
                            >
                                {cat}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.grid}>
                    {products.length === 0 && (
                        <p className={styles.empty}>
                            {search ? `No results for "${search}"` : "No products found."}
                        </p>
                    )}
                    {products.map((p, index) => (
                        <div key={p.id} className={styles.card} onClick={() => window.location.href = `/products/${p.id}`} style={{ cursor: "pointer" }}>
                            {p.image
                                ? <Image src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${p.image}`} alt={p.name} width={300} height={160} className={styles.cardImg} style={{ width: "100%", height: "auto" }}  {...(index === 0
                                    ? { priority: true }
                                    : { loading: "lazy" })} />
                                : <div className={styles.noImage}>📦</div>
                            }
                            <div className={styles.cardBody}>
                                <h3 className={styles.name}>{p.name}</h3>
                                <p className={styles.price}>₹{p.price}</p>
                                <p className={styles.details}>{p.details}</p>
                                <button className={styles.btnAddCart} onClick={() => addToCart(p.id)}>
                                    🛒 Add to Cart
                                </button>
                                <Link href={`/products/${p.id}`} className={styles.btnBuyNow}>
                                    Buy Now
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
            <div className={styles.pagination}>

                <button
                    className={styles.pageBtn}
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    ← Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;

                    return (
                        <button
                            key={pageNumber}
                            className={
                                page === pageNumber
                                    ? `${styles.pageBtn} ${styles.activePage}`
                                    : styles.pageBtn
                            }
                            onClick={() => setPage(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    );
                })}

                <button
                    className={styles.pageBtn}
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Next →
                </button>

            </div>

        </div>
    );
}