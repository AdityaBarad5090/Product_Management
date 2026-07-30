"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CategoryContext = createContext();

export function CategoryProvider({ children }) {
    const [categories, setCategories] = useState(["All"]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const unique = [
                        "All",
                        ...new Set(data.products.map(p => p.category || "Uncategorized"))
                    ];
                    setCategories(unique);
                }
            });
    }, []);

    return (
        <CategoryContext.Provider value={{ categories }}>
            {children}
        </CategoryContext.Provider>
    );
}

export const useCategories = () => useContext(CategoryContext);