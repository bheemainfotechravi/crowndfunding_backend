import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log("👉 Headers:", req.headers);

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token Decoded:", decoded);

    req.admin = decoded;
    next();
  } catch (error) {
    console.log("❌ Token Error:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};