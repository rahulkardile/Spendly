import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { sql } from './config/db.config'
import authRoutes from './routes/auth.routes';

const app = express();
dotenv.config();

const PORT = process.env.PORT;
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, from server!");
});

app.use("/auth", authRoutes);

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(25, 2) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`
    console.info("Connected to Database.");
  } catch (error) {
    console.log("DB init error: ", error);
    process.exit(1);
  }
}

initDB().then(() =>
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  })
);
