import { neon } from "@neondatabase/serverless";
import "dotenv/config.js";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL in environment variables");
}

export const sql = neon(databaseUrl);

export async function initDB(): Promise<void> {
  try {
    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
      )
    `;
    console.log("Database initialized successfully");

    // Check if there is already data
    const countResult = await sql`SELECT COUNT(*)::int AS count FROM transactions`;
    if (countResult[0].count === 0) {
      // Insert dummy data only if table is empty
      await sql`
        INSERT INTO transactions (user_id, title, amount, category)
        VALUES 
        ('user1', 'Grocery Shopping', 150.50, 'Food'),
        ('user2', 'Monthly Rent', 800.00, 'Housing'),
        ('user3', 'Gym Membership', 50.00, 'Health'),
        ('user1', 'Electricity Bill', 120.75, 'Utilities'),
        ('user2', 'Internet Subscription', 45.99, 'Utilities')
      `;
      console.log("Dummy data inserted successfully!");
    } else {
      console.log("Dummy data already exists, skipping insertion");
    }
  } catch (error) {
    console.error("Error initializing DB:", error);
    process.exit(1);
  }
}
