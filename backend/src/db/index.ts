import dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool
  .on("connect", () => {
    console.log("Server connected successfully with postgres");
  })
  .on("error", (err) => {
    console.log("Error with server connection ", err);
  });

export { pool };

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql, schema });

export { db };
