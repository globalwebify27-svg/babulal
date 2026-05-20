const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'babulal_portal'
  });

  try {
    const [products] = await connection.query("SELECT id, name, category, subCategory, businessVertical FROM products WHERE LOWER(businessVertical) = 'textiles'");
    console.log("Total textile products:", products.length);
    
    const categoriesMap = {};
    products.forEach(p => {
      categoriesMap[p.category] = (categoriesMap[p.category] || 0) + 1;
    });

    console.log("Categories found in products table:");
    console.log(categoriesMap);

    const [categories] = await connection.query("SELECT id, name, slug FROM categories WHERE LOWER(parentVertical) = 'textiles'");
    console.log("\nCategories in categories table:");
    console.log(categories);

    if (products.length > 0) {
      console.log("\nSample products:");
      console.log(products.slice(0, 10));
    }
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}

main();
