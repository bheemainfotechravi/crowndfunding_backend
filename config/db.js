import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create pool (better than single connection)
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Optional: test connection
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("MySQL Connected");
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error);
  }
})();

export default db;