import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const testDatabaseConnection = async () => {
  await pool.query("SELECT 1");
  console.log("Connected to Postgres");
};

export const database = pool;
