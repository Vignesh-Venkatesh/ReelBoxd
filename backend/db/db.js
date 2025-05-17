import { config } from "dotenv";
config(); // to load the .env file

import { Pool } from "pg";

// Create the pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
