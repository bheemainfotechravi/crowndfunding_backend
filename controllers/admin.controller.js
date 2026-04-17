import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  try {


    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const sql = "SELECT * FROM admin WHERE email = ?";

    // ✅ promise style
    const [result] = await db.query(sql, [email]);

    if (result.length === 0) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const admin = result[0];

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};