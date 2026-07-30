"use client";

import styles from "./page.module.css";

export default function ProductModal({
    showModal,
    editingId,
    form,
    categories,
    setForm,
    handleImageChange,
    handleSave,
    resetForm,
    setShowModal,
}) {
    if (!showModal) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>{editingId ? "Edit Product" : "Add Product"}</h2>

                <div className={styles.field}>
                    <label>Name</label>
                    <input
                        placeholder="Product name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    />
                </div>

                <div className={styles.field}>
                    <label>Price</label>
                    <input
                        type="number"
                        placeholder="Product price"
                        value={form.price}
                        onChange={(e) =>
                            setForm({ ...form, price: e.target.value })
                        }
                    />
                </div>

                <div className={styles.field}>
                    <label>Details</label>
                    <textarea
                        placeholder="Product details..."
                        value={form.details}
                        onChange={(e) =>
                            setForm({ ...form, details: e.target.value })
                        }
                    />
                </div>

                <div className={styles.field}>
                    <label>Category</label>
                    <select
                        value={form.category || ""}
                        onChange={(e) =>
                            setForm({ ...form, category: e.target.value })
                        }
                    >
                        <option value="">-- Select Category --</option>

                        {categories
                            .filter((cat) => cat !== "All")
                            .map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                    </select>
                </div>

                <div className={styles.field}>
                    <label>Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>

                <div className={styles.modalActions}>
                    <button
                        className={styles.btnSave}
                        onClick={handleSave}
                    >
                        Save
                    </button>

                    <button
                        className={styles.btnCancel}
                        onClick={() => {
                            setShowModal(false);
                            resetForm();
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}