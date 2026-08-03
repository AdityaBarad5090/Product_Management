import db from "../config/db.js";

export const getAllProducts = (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    const offset = (page - 1) * limit;
    const search = req.query.search || "";
    const category = req.query.category || "All";

    let where = `
WHERE (
    name LIKE ?
    OR details LIKE ?
    OR category LIKE ?
    OR CAST(price AS CHAR) LIKE ?
)
`;
    const searchValue = `%${search}%`;
    const values = [searchValue, searchValue, searchValue, searchValue];

    if (category !== "All") {
        where += ` AND category = ?`;
        values.push(category);
    }

    // Get total number of products
    db.query(`SELECT COUNT(*) AS total FROM products ${where}`, values, (err, countResult) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message ,
            });
        }

        const total = countResult[0].total;

        // Get products for current page
        db.query(
            `SELECT * FROM products ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            [...values, limit, offset],
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Server Error",
                    });
                }

                res.json({
                    success: true,
                    products: result,
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                });
            }
        );
    }
    );
};

export const getProductById = (req, res) => {
    db.query("SELECT * FROM products WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Server Error" });
        if (result.length === 0) return res.status(404).json({ success: false, message: "Product not found" });
        res.json({ success: true, product: result[0] });
    });
};

export const createProduct = (req, res) => {
    const { name, price, details, category } = req.body;
    const image = req.file ? req.file.filename : null;

    db.query(
        "INSERT INTO products (name, price, details, category, image) VALUES (?, ?, ?, ?, ?)",
        [name, price, details, category, image],
        (err, result) => {
            if (err) return res.status(500).json({ success: false, message: "Server Error" });
            res.status(201).json({ success: true, message: "Product Created" });
        }
    );
};

export const updateProduct = (req, res) => {
    const { name, price, details, category } = req.body;
    const image = req.file ? req.file.filename : req.body.existing_image;

    db.query(
        "UPDATE products SET name=?, price=?, details=?, category=?, image=?, updated_at=NOW() WHERE id=?",
        [name, price, details, category, image, req.params.id],
        (err, result) => {
            if (err) return res.status(500).json({ success: false, message: "Server Error" });
            res.json({ success: true, message: "Product Updated" });
        }
    );
};

export const deleteProduct = (req, res) => {
    db.query("DELETE FROM products WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Server Error" });
        res.json({ success: true, message: "Product Deleted" });
    });
};

export const getStats = (req, res) => {
    const stats = {};

    // total products
    db.query(`SELECT COUNT(*) as total FROM products`, (err, result) => {
        if (err) return res.json({ success: false, error: err });
        stats.totalProducts = result[0].total;

        // total users
        db.query("SELECT COUNT(*) as total FROM clients", (err, result) => {
            if (err) return res.json({ success: false, error: err });
            stats.totalUsers = result[0].total;

            // total categories
            db.query("SELECT COUNT(DISTINCT category) as total FROM products", (err, result) => {
                if (err) return res.json({ success: false, error: err });
                stats.totalCategories = result[0].total;

                res.json({ success: true, stats });
            });
        });
    });
};