const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });

  const [rows] = await pool.query('SELECT storeLocation, videoUrl FROM landing_content');
  console.log(rows);
  process.exit(0);
}
main();
