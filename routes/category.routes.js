import express from "express";
import { createCategory ,getCategories,updateCategory,deleteCategory} from "../controllers/category.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/create", upload.single("image"), createCategory);
router.get("/get", getCategories);
router.patch("/update/:id", upload.single("image"), updateCategory);
router.delete("/delete/:id", deleteCategory);

export default router;