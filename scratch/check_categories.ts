import pool from '../src/lib/db';

async function main() {
  const [rows]: any = await pool.query("SELECT id, name, slug, image FROM categories");
  console.log("Categories in database:", JSON.stringify(rows, null, 2));
  process.exit(0);
}

main().catch(console.error);
