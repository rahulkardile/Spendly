import { Request, Response } from "express";
import { sql } from "../config/db.config.js";

// GET /api/transactions/:userId
export async function getTransactionsByUserId(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.params;

    const transactions = await sql`
      SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    `;

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error getting the transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// POST /api/transactions
export async function createTransaction(req: Request, res: Response): Promise<void> {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !user_id || !category || amount === undefined) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const transaction = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
    `;

    res.status(201).json(transaction[0]);
  } catch (error) {
    console.error("Error creating the transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// DELETE /api/transactions/:id
export async function deleteTransaction(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      res.status(400).json({ message: "Invalid transaction ID" });
      return;
    }

    const result = await sql`
      DELETE FROM transactions WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting the transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// GET /api/transactions/summary/:userId
export async function getSummaryByUserId(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}
    `;

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income FROM transactions
      WHERE user_id = ${userId} AND amount > 0
    `;

    const expensesResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS expenses FROM transactions
      WHERE user_id = ${userId} AND amount < 0
    `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.error("Error getting the summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
