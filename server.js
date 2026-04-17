import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminRouter from "./routes/admin.route.js";
import router from "./routes/auth.routes.js";
import path from "path";
import categoryRoutes from "./routes/category.routes.js";
import campaignRouter from "./routes/campaign.route.js";

dotenv.config();

const app = express();

// ✅ CORS (update for production later)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static folder
app.use("/uploads", express.static(path.resolve("uploads")));

// ✅ Root route (IMPORTANT FIX)
app.get("/", (req, res) => {
  res.send("Crowd Backend API is running 🚀");
});

// ✅ Routes
app.use("/api/admin", adminRouter);
app.use("/api/admin/category", categoryRoutes);
app.use("/api/user", router);
app.use("/api/user/campaign", campaignRouter);

// ✅ Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});