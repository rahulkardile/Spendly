import { neon } from "@neondatabase/serverless";
import "dotenv/config.js";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL in environment variables");
}

export const sql = neon(databaseUrl);

export async function initDB(): Promise<void> {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
      )
    `;
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing DB:", error);
    process.exit(1);
  }
}
