const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'babulal_portal'
  });

  try {
    const address = 'Near, Gandhi Chowk, Upper Bazar, Ranchi, Jharkhand 834001';
    const googleMapsUrl = 'https://maps.app.goo.gl/Fu9u9U9UQVj8zYZVA';

    const [result] = await connection.query(
      `UPDATE welcome_page_settings 
       SET address = ?, googleMapsUrl = ?
       WHERE id = 1 OR id > 0 LIMIT 1`,
      [address, googleMapsUrl]
    );
    console.log("Database updated successfully:", result.affectedRows, "rows affected.");
  } catch (err) {
    console.error("Error updating database:", err);
  } finally {
    await connection.end();
  }
}

main();
