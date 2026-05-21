const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'babulal_portal'
  });

  try {
    console.log("Seeding sub-categories...");
    
    // Clear existing sub-categories (if any)
    await connection.query("DELETE FROM sub_categories");
    
    // Fetch categories to match IDs
    const [categories] = await connection.query("SELECT id, name, slug FROM categories");
    console.log("Categories found:", categories.map(c => ({ id: c.id, name: c.name })));
    
    const subCategories = [];
    
    const sareeCat = categories.find(c => c.slug === 'saree' || c.name.toLowerCase().includes('saree'));
    const lehengaCat = categories.find(c => c.slug === 'bridal-lehenga' || c.name.toLowerCase().includes('lehenga'));
    const suiteCat = categories.find(c => c.slug === 'suite' || c.name.toLowerCase().includes('suite') || c.name.toLowerCase().includes('suit'));
    const kidsCat = categories.find(c => c.slug === 'kids-collection' || c.name.toLowerCase().includes('kids'));
    const mensCat = categories.find(c => c.slug === 'mens-wear' || c.name.toLowerCase().includes('men'));
    
    if (sareeCat) {
      subCategories.push(
        { name: "Banarasi Silk", slug: "banarasi-silk", categoryId: sareeCat.id },
        { name: "Kanjivaram Silk", slug: "kanjivaram-silk", categoryId: sareeCat.id },
        { name: "Georgette Sarees", slug: "georgette-sarees", categoryId: sareeCat.id },
        { name: "Chiffon Sarees", slug: "chiffon-sarees", categoryId: sareeCat.id }
      );
    }
    
    if (lehengaCat) {
      subCategories.push(
        { name: "Velvet Lehengas", slug: "velvet-lehengas", categoryId: lehengaCat.id },
        { name: "Silk Lehengas", slug: "silk-lehengas", categoryId: lehengaCat.id },
        { name: "Net Lehengas", slug: "net-lehengas", categoryId: lehengaCat.id }
      );
    }
    
    if (suiteCat) {
      subCategories.push(
        { name: "Salwar Suits", slug: "salwar-suits", categoryId: suiteCat.id },
        { name: "Anarkali Suits", slug: "anarkali-suits", categoryId: suiteCat.id },
        { name: "Sharara Sets", slug: "sharara-sets", categoryId: suiteCat.id }
      );
    }
    
    if (kidsCat) {
      subCategories.push(
        { name: "Boys Festive Wear", slug: "boys-festive", categoryId: kidsCat.id },
        { name: "Girls Dresses", slug: "girls-dresses", categoryId: kidsCat.id }
      );
    }
    
    if (mensCat) {
      subCategories.push(
        { name: "Sherwanis", slug: "sherwanis", categoryId: mensCat.id },
        { name: "Kurta Pyjama", slug: "kurta-pyjama", categoryId: mensCat.id },
        { name: "Suits & Blazers", slug: "suits-blazers", categoryId: mensCat.id }
      );
    }

    for (const sub of subCategories) {
      await connection.query(
        "INSERT INTO sub_categories (name, slug, categoryId, status, orderIndex) VALUES (?, ?, ?, 'Active', 0)",
        [sub.name, sub.slug, sub.categoryId]
      );
      console.log(`Inserted subcategory: ${sub.name} under category ID ${sub.categoryId}`);
    }
    
    // Update subCategoryCounts on Categories
    for (const cat of categories) {
      const [countResult] = await connection.query(
        "SELECT COUNT(*) as count FROM sub_categories WHERE categoryId = ?",
        [cat.id]
      );
      const count = countResult[0].count;
      await connection.query(
        "UPDATE categories SET subCategoryCount = ? WHERE id = ?",
        [count, cat.id]
      );
      console.log(`Updated category ${cat.name} subCategoryCount to ${count}`);
    }

    console.log("Seeding completed successfully!");
  } catch (err) {
    console.error("Error seeding sub-categories:", err);
  } finally {
    await connection.end();
  }
}

main();
