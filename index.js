import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jsonServer from "json-server";
import stripeRoutes from "./routes/stripe.js"; // هذا المسار يجب أن يكون موجودًا
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonRouter = jsonServer.router("db.json");
const jsonMiddlewares = jsonServer.defaults();

// إعدادات عامة
app.use(cors());
app.use(express.json()); // لمعالجة JSON
app.use(jsonMiddlewares);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✳️ ربط Route الخاص بـ Stripe
app.use("/api/stripe", stripeRoutes);

// ✳️ ربط الـ JSON Server كباقي الـ APIs
app.use("/api", jsonRouter); // عشان ميصيرش تضارب مع /api/stripe

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
