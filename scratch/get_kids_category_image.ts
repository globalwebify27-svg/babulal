import pool from '../src/lib/db';

async function main() {
  const [rows]: any = await pool.query("SELECT image FROM categories WHERE id = 4");
  if (rows && rows.length > 0) {
    const img = rows[0].image;
    console.log("Image type/prefix:", img ? img.substring(0, 100) : "null");
    console.log("Image length:", img ? img.length : 0);
  } else {
    console.log("No category with ID 4 found.");
  }
  process.exit(0);
}

main().catch(console.error);
