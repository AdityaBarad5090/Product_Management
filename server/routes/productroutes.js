import express from "express";
import upload from "../config/multer.js";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getStats
} from "../controllers/productcontroller.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/stats", getStats);
router.get("/:id", getProductById);
router.post("/", verifyAdmin, upload.single("image"), createProduct);
router.put("/:id", verifyAdmin, upload.single("image"), updateProduct);
router.delete("/:id", verifyAdmin, deleteProduct);

export default router;