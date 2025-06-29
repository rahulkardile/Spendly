import { neon } from "@neondatabase/serverless"

import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not defined");
}
export const sql = neon(databaseUrl);
// NOTE: If you have a query like 'CREATE TABLE IF NOT EXIST ...', change it to 'CREATE TABLE IF NOT EXISTS ...'