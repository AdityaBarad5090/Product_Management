"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import styles from "./page.module.css";
import { useCategories } from "../../context/CategoryContext.js";
import { toast } from "react-toastify";
import ExcelJS from "exceljs";
import ProductTable from "./ProductTable.js";
import ProductModal from "./ProductModel.js";
import Sidebar from "./Sidebar.js";

const API = `${process.env.NEXT_PUBLIC_API_URL}/products`;

const initialForm = {
    name: "",
    price: "",
    details: "",
    category: "",
    image: null,
    existing_image: "",
};

export default function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [activeCategory, setActiveCategory] = useState("All");
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState("");

    const { categories } = useCategories();

    useEffect(() => {
        getProducts(page, perPage, search, activeCategory);
    }, [page, perPage, search, activeCategory]);

    const getProducts = async (page = 1, limit = perPage, searchText = search, category = activeCategory) => {

        const res = await fetch(
            `${API}?page=${page}&limit=${limit}&search=${encodeURIComponent(searchText)}&category=${encodeURIComponent(category)}`,
        );

        const data = await res.json();

        if (data.success) {
            setProducts(data.products);
            setTotalRows(data.total);
        }
    };

    const resetForm = () => {
        setForm(initialForm);
        setEditingId(null)
    };

    const openAdd = () => {
        resetForm();
        setShowModal(true);
    };

    const openEdit = (product) => {
        setForm({
            name: product.name,
            price: product.price,
            details: product.details,
            category: product.category,
            image: null,
            existing_image: product.image,
        });
        setEditingId(product.id);
        
        setShowModal(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm({ ...form, image: file });
       
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("price", form.price);
        formData.append("category", form.category);
        formData.append("details", form.details);
        if (form.image) {
            formData.append("image", form.image);
        } else {
            formData.append("existing_image", form.existing_image);
        }

        const url = editingId ? `${API}/${editingId}` : API;
        const method = editingId ? "PUT" : "POST";
        const res = await fetch(url, {
            method, headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }, body: formData
        });

        const data = await res.json();

        if (data.success) {
            toast.success(data.message);
        } else {
            toast.error(data.message);
        }

        setShowModal(false);
        resetForm();
        getProducts();
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this product?")) return;
        await fetch(`${API}/${id}`, { method: "DELETE" , headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
        getProducts();
    };

    const exportCSV = () => {

        if (products.length === 0) {
            alert("No products available");
            return;
        }
        const headers = [
            "ID",
            "Name",
            "Price",
            "Category",
            "Details",
            "Created Date"
        ];

        const rows = products.map(product => [
            product.id,
            product.name,
            product.price,
            product.category,
            product.details,
            product.created_at
        ]);

        const csvContent = [
            headers,
            ...rows
        ]
            .map(row => row.join(","))
            .join("\n");

        const blob = new Blob(
            [csvContent],
            {
                type: "text/csv;charset=utf-8;"
            }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = "products.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
        if (success) {

        }
    };

    const exportExcel = async () => {
        if (products.length === 0) {
            alert("No products found!");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Products");

        // Header row
        sheet.addRow(["ID", "Name", "Price", "Category", "Details", "Created Date"]);
        sheet.getRow(1).font = { bold: true };
        sheet.getRow(1).eachCell((cell) => {
            cell.border = { bottom: { style: "thin" } };
        });

        // Data rows
        products.forEach((product) => {
            sheet.addRow([
                product.id,
                product.name,
                product.price,
                product.category,
                product.details,
                product.created_at,
            ]);
        });

        // Column widths
        sheet.columns = [8, 30, 15, 20, 45, 22].map((width) => ({ width }));

        // Download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Products-${new Date().toISOString().split("T")[0]}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
    };

    const columns = [
        {
            name: "Image",
            cell: row =>
                row.image ? (
                    <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${row.image}`}
                        alt={row.name}
                        className={styles.productImg}
                        width={95}
                        height={95}
                        priority
                    />
                ) : (
                    <div className={styles.noImg}>📦</div>
                ),
            width: "120px",
        },
        {
            name: "Name",
            selector: row => row.name,
            sortable: true,
        },
        {
            name: "Price",
            selector: row => row.price,
            sortable: true,
            cell: row => `₹${row.price}`,
        },
        {
            name: "Category",
            selector: row => row.category,
            sortable: true,
        },
        {
            name: "Details",
            selector: row => row.details,
            grow: 2,
            sortable: true,
        },
        {
            name: "Actions",
            cell: row => (
                <div className={styles.actions}>
                    <button className={styles.btnEdit} onClick={() => openEdit(row)} >
                        Edit
                    </button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(row.id)} >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <h1>Manage Products</h1>
                <div className={styles.headerActions}>
                    <div className={styles.searchWrapper}>
                        <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            className={styles.searchInput}
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>
                    <button onClick={exportExcel}>
                        Export Excel
                    </button>
                    <button onClick={exportCSV}>
                        Export CSV
                    </button>
                    <Link href="/admin/home" className={styles.btnHome} >Home</Link>
                    <button className={styles.btnAdd} onClick={openAdd}>+ Add Product</button>
                    <Link href="/" className={styles.btnLogout} onClick={() => {
                        localStorage.removeItem("role");
                        localStorage.removeItem("user_id");
                        localStorage.removeItem("token");
                    }}>Logout</Link>
                </div>
            </div>  

            <div className={styles.layout}>

                <Sidebar
                    categories={categories}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    setPage={setPage}
                />
             
                <ProductTable
                    columns={columns}
                    products={products}
                    totalRows={totalRows}
                    perPage={perPage}
                    setPage={setPage}
                    setPerPage={setPerPage}
                />
            </div>

            <ProductModal
                showModal={showModal}
                editingId={editingId}
                form={form}
                categories={categories}
                setForm={setForm}
                handleImageChange={handleImageChange}
                handleSave={handleSave}
                resetForm={resetForm}
                setShowModal={setShowModal}
            />

        </div>
    );
}