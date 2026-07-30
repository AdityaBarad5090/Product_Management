import { Suspense } from "react";
import styles from "./page.module.css";
import ProductsClient from "./ProductsClient";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

function ProductsSkeleton() {
    return (
        <div className={styles.layout}>
            <div className={styles.sidebar}>
                <h3>Categories</h3>
                <ul>
                    {[1, 2, 3, 4, 5].map(i => (
                        <li key={i} className={styles.skeletonItem}></li>
                    ))}
                </ul>
            </div>
            <div className={styles.grid}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className={styles.skeletonCard}>
                        <div className={styles.skeletonImage}></div>
                        <div className={styles.skeletonText}></div>
                        <div className={styles.skeletonTextShort}></div>
                        <div className={styles.skeletonBtn}></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
const API = `${process.env.NEXT_PUBLIC_API_URL}/products`;

async function getProducts() {
    const res = await fetch(API, {
        cache: "no-store",
    });

    const data = await res.json();

    return data.products;
}

export async function generateMetadata() {
    const products = await getProducts();

    const totalProducts = products.length;

    const categories = [...new Set(products.map((p) => p.category))];

    return {
        title: `${totalProducts} Products Available`,
        description: `Browse ${totalProducts} products from ${categories.length} categories.`,

        keywords: [
            ...categories,
            "Products",
            "Next.js",
            "Product Management",
        ],

        openGraph: {
            title: `${totalProducts} Products Available`,
            description: `Browse ${totalProducts} products from ${categories.length} categories.`,
        },
    };
}

export default function ProductsPage() {
    return (
        <div className={styles.page}>

            <div className={styles.header}>
                <h1>Products</h1>
                <div className={styles.headerActions}>
                    <Link href="/orders" className={styles.btnOrder}>
                        🛍️ My Orders
                    </Link>
                    <Link href="/cart" className={styles.btnCart}>
                        🛒 Cart
                    </Link>
                    <LogoutButton />
                </div>
            </div>

            <Suspense fallback={<ProductsSkeleton />}>
                <ProductsClient initialProducts={[]} />
            </Suspense>

        </div>
    );
}