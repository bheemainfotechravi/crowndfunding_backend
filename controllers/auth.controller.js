import bcrypt from "bcryptjs";
import db from "../config/db.js";
import jwt from "jsonwebtoken";

// REGISTER USER CONTROLLER
export const register = async (req, res) => {
    try {
        const { full_name, email, password } = req.body;

        // 1. Check if user already exists
        const [existingUser] = await db.execute(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already exists",
            });
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Insert user
        const [result] = await db.execute(
            "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)",
            [full_name, email, hashedPassword]
        );

        // 4. Send response
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            userId: result.insertId,
        });

    } catch (error) {
        console.error("Register Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};




// LOGIN CONTROLLER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check user exists
    const [users] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



export const logout = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};