const fs = require('fs');

try {
  const data = JSON.parse(fs.readFileSync('products.json', 'utf8'));
  console.log("Total products in products.json:", data.length);
  const categories = {};
  data.forEach(p => {
    categories[p.category] = (categories[p.category] || 0) + 1;
  });
  console.log("Categories in products.json:");
  console.log(categories);
} catch (e) {
  console.error("Error reading/parsing products.json:", e);
}
