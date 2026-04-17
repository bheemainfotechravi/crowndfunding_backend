import db from "../config/db.js";
import fs from "fs";
import path from "path";

// export const createCampaign = async (req, res) => {
//   try {
//     const {
//       id,
//       category_id,
//       title,
//       description,
//       funding_goal,
//       deadline,
//       location,
//     } = req.body;

//     const image = req.files?.image?.[0]?.filename || null;
//     const document = req.files?.document?.[0]?.filename || null;

//     // Validation
//     if (!id || !category_id || !title) {
//       return res.status(400).json({
//         success: false,
//         message: "Required fields missing",
//       });
//     }

//     const sql = `
//       INSERT INTO campaigns 
//       (user_id, category_id, title, description, funding_goal, deadline, location, image, document)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const [result] = await db.query(sql, [
//       user_id,
//       category_id,
//       title,
//       description,
//       funding_goal,
//       deadline,
//       location,
//       image,
//       document,
//     ]);

//     return res.status(201).json({
//       success: true,
//       message: "Campaign created (Pending Approval)",
//       campaign_id: result.insertId,
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };




export const createCampaign = async (req, res) => {
  try {
    const {
      user_id,
      category_id,
      title,
      description,
      funding_goal,
      deadline,
      location,
    } = req.body;

    // Handle files
    const images = req.files?.images
      ? req.files.images.map((file) => file.filename)
      : [];

    const documents = req.files?.documents
      ? req.files.documents.map((file) => file.filename)
      : [];

    // Validation
    if (!user_id || !category_id || !title || !funding_goal) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // Insert query
    const query = `
      INSERT INTO campaigns 
      (user_id, category_id, title, description, funding_goal, deadline, location, images, documents)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      user_id,
      category_id,
      title,
      description,
      funding_goal,
      deadline,
      location,
      JSON.stringify(images),
      JSON.stringify(documents),
    ];

    const [result] = await db.execute(query, values);

    res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      campaign_id: result.insertId,
    });

  } catch (error) {
    console.error("Create Campaign Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};




export const updateCampaignStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ["pending", "active", "completed", "rejected"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    await db.query(
      "UPDATE campaigns SET status = ? WHERE id = ?",
      [status, id]
    );

    res.json({
      success: true,
      message: "Campaign status updated",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};



export const getCampaigns = async (req, res) => {
  try {
    const { status } = req.query;

    let sql = `
      SELECT c.*, cat.category_name
      FROM campaigns c
      JOIN categories cat ON c.category_id = cat.id
    `;

    let values = [];

    if (status) {
      sql += " WHERE c.status = ?";
      values.push(status);
    }

    const [rows] = await db.query(sql, values);

    res.json({
      success: true,
      data: rows,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};









export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_id } = req.body;

    // ✅ Validation
    if (!id || !admin_id) {
      return res.status(400).json({
        success: false,
        message: "Campaign ID and Admin ID required",
      });
    }

    // ✅ Check campaign exists
    const [rows] = await db.query(
      "SELECT * FROM campaigns WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    const campaign = rows[0];

    // 🔐 Optional: Check admin role (if you have admin table)
    // For now we assume admin_id is valid

    // ================= DELETE FILES =================

    // Delete image
    if (campaign.image) {
      const imagePath = path.join("uploads/images", campaign.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete document
    if (campaign.document) {
      const docPath = path.join("uploads/documents", campaign.document);
      if (fs.existsSync(docPath)) {
        fs.unlinkSync(docPath);
      }
    }

    // ================= DELETE DB =================
    await db.query("DELETE FROM campaigns WHERE id = ?", [id]);

    return res.status(200).json({
      success: true,
      message: "Campaign deleted successfully",
    });

  } catch (error) {
    console.log("Delete Campaign Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};