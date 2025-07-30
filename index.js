import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jsonServer from "json-server";
import stripeRoutes from "./routes/stripe.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonRouter = jsonServer.router("db.json");
const jsonMiddlewares = jsonServer.defaults();

app.use(cors());
app.use(express.json());
app.use(jsonMiddlewares);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/products", (req, res, next) => {
  const search = req.query.q?.toLowerCase();
  if (search) {
    const db = jsonRouter.db; // lowdb instance
    const products = db
      .get("products")
      .filter((p) => {
        return Object.values(p).some(
          (value) =>
            typeof value === "string" && value.toLowerCase().includes(search)
        );
      })
      .value();
    return res.json(products);
  }
  next();
});

app.use("/api/stripe", stripeRoutes);

app.use("/api", jsonRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
