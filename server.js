import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminRouter from "./routes/admin.route.js";
import router from "./routes/auth.routes.js";
import path from "path";
import categoryRoutes from "./routes/category.routes.js";
import campaignRouter from "./routes/campaign.route.js"
dotenv.config();

const app = express();

// ✅ Correct CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());


app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/api/admin", adminRouter);
app.use("/api/admin/category", categoryRoutes);
app.use("/api/user", router);
app.use("/api/user/campaign",campaignRouter)


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});