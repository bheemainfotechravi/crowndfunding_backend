import db from "../config/db.js";
import fs from "fs";
import path from "path";

export const createCategory = async (req, res) => {
  try {
    const { admin_id, category_name } = req.body;
    const image = req.file ? req.file.filename : null;

    // Validation
    if (!admin_id || !category_name) {
      return res.status(400).json({
        success: false,
        message: "Admin ID and Category Name are required",
      });
    }

    const sql =
      "INSERT INTO categories (admin_id, category_name, image) VALUES (?, ?, ?)";

    // ✅ Promise-based query
    const [result] = await db.query(sql, [
      admin_id,
      category_name,
      image,
    ]);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: {
        id: result.insertId,
        admin_id,
        category_name,
        image,
      },
    });
  } catch (error) {
    console.log("Create Category Error:", error);
    return res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
};






// ✅ GET Categories (Admin & User)
export const getCategories = async (req, res) => {
  try {
    const { admin_id } = req.query;

    let sql = "";
    let values = [];

    // 🔹 If admin_id is passed → Admin API
    if (admin_id) {
      sql = "SELECT * FROM categories WHERE admin_id = ?";
      values = [admin_id];
    } 
    // 🔹 If no admin_id → User API (get all)
    else {
      sql = "SELECT * FROM categories";
    }

    const [rows] = await db.query(sql, values);

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: rows,
    });

  } catch (error) {
    console.log("Get Categories Error:", error);
    return res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
};




export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params; // category id
    const { admin_id, category_name } = req.body;
    const image = req.file ? req.file.filename : null;

    // ✅ Validation
    if (!id || !admin_id) {
      return res.status(400).json({
        success: false,
        message: "Category ID and Admin ID are required",
      });
    }

    // ✅ Check if category belongs to this admin
    const [existing] = await db.query(
      "SELECT * FROM categories WHERE id = ? AND admin_id = ?",
      [id, admin_id]
    );

    if (existing.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only update your own category",
      });
    }

    // ✅ Build dynamic update query
    let sql = "UPDATE categories SET ";
    let values = [];

    if (category_name) {
      sql += "category_name = ?, ";
      values.push(category_name);
    }

    if (image) {
      sql += "image = ?, ";
      values.push(image);
    }

    // remove last comma
    sql = sql.slice(0, -2);

    sql += " WHERE id = ? AND admin_id = ?";
    values.push(id, admin_id);

    const [result] = await db.query(sql, values);

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
    });

  } catch (error) {
    console.log("Update Category Error:", error);
    return res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
};





export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params; // category id
    const { admin_id } = req.body;

    // ✅ Validation
    if (!id || !admin_id) {
      return res.status(400).json({
        success: false,
        message: "Category ID and Admin ID are required",
      });
    }

    // ✅ Check ownership (important)
    const [existing] = await db.query(
      "SELECT * FROM categories WHERE id = ? AND admin_id = ?",
      [id, admin_id]
    );

    if (existing.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only delete your own category",
      });
    }

    // ✅ Delete image from uploads folder (optional but recommended)
    const category = existing[0];
    if (category.image) {
      const imagePath = path.join("uploads", category.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // ✅ Delete from DB
    await db.query(
      "DELETE FROM categories WHERE id = ? AND admin_id = ?",
      [id, admin_id]
    );

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });

  } catch (error) {
    console.log("Delete Category Error:", error);
    return res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
};