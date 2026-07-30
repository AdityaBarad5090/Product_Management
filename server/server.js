import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import db from "./config/db.js";
import authRoutes from "./routes/authroutes.js";
import productRoutes from "./routes/productroutes.js";
import cartRoutes from "./routes/cartroutes.js";
import orderRoutes from "./routes/orderroutes.js";
import stripeRoutes from "./routes/striperoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/uploads", express.static("uploads")); 
app.use ("/stats",productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/stripe", stripeRoutes);

app.get("/", (req, res) => {
  res.send("Server is running..");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
