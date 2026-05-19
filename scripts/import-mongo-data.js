const fs = require('fs');
const mysql = require('mysql2/promise');
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('⚠️ sharp is not available. Images will be imported without resizing optimization.');
}

// 1. Parse .env
function loadEnv() {
  const env = {};
  try {
    const dotenvContent = fs.readFileSync('.env', 'utf8');
    dotenvContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let value = match[2] ? match[2].trim() : '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        env[match[1]] = value;
      }
    });
  } catch (err) {
    console.error('Error reading .env file:', err.message);
  }
  return env;
}

// 2. Optimize base64 images
async function optimizeBase64Image(base64String, maxWidth = 1200, maxHeight = 1200) {
  if (!sharp || !base64String || !base64String.startsWith('data:image')) {
    return base64String;
  }
  try {
    const [header, base64Data] = base64String.split(',');
    const buffer = Buffer.from(base64Data, 'base64');
    if (buffer.length < 150 * 1024) {
      return base64String;
    }
    const optimizedBuffer = await sharp(buffer)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80, progressive: true })
      .toBuffer();
    return `data:image/jpeg;base64,${optimizedBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Image optimization failed:', error.message);
    return base64String;
  }
}

async function run() {
  const env = loadEnv();
  const dbConfig = {
    host: env.DATABASE_HOST || 'localhost',
    user: env.DATABASE_USER || 'root',
    password: env.DATABASE_PASSWORD || '',
    database: env.DATABASE_NAME || 'babulal_portal'
  };

  console.log(`Connecting to database "${dbConfig.database}" at "${dbConfig.host}"...`);
  const connection = await mysql.createConnection(dbConfig);

  try {
    // Check files exist
    if (!fs.existsSync('categories.json')) {
      throw new Error('categories.json not found in root!');
    }
    if (!fs.existsSync('products.json')) {
      throw new Error('products.json not found in root!');
    }

    // Load categories
    console.log('Reading categories.json...');
    const categoriesData = JSON.parse(fs.readFileSync('categories.json', 'utf8'));
    console.log(`Found ${categoriesData.length} categories to import.`);

    for (const cat of categoriesData) {
      console.log(`Processing category: ${cat.name} (${cat.slug})...`);
      
      // Optimize image if it is base64
      let optimizedImg = cat.image || null;
      if (optimizedImg && optimizedImg.startsWith('data:image')) {
        console.log(`  Optimizing image for ${cat.name}...`);
        optimizedImg = await optimizeBase64Image(optimizedImg);
      }

      // Check if exists by slug
      const [existing] = await connection.query('SELECT id FROM categories WHERE slug = ?', [cat.slug]);

      if (existing.length > 0) {
        console.log(`  Category already exists with slug "${cat.slug}". Updating fields...`);
        const catId = existing[0].id;
        await connection.query(
          `UPDATE categories SET 
            name = ?, 
            image = ?, 
            subCategoryCount = ?, 
            faqCount = ?, 
            showInHeader = ?, 
            topBusiness = ?, 
            isCurated = ?, 
            orderIndex = ?, 
            status = ?, 
            parentVertical = ?
           WHERE id = ?`,
          [
            cat.name,
            optimizedImg,
            cat.subCategoryCount || 0,
            cat.faqCount || 0,
            cat.showInHeader !== undefined ? (cat.showInHeader ? 1 : 0) : 1,
            cat.topBusiness !== undefined ? (cat.topBusiness ? 1 : 0) : 0,
            cat.isCurated !== undefined ? (cat.isCurated ? 1 : 0) : 0,
            cat.order !== undefined ? Number(cat.order) : (cat.orderIndex !== undefined ? Number(cat.orderIndex) : 0),
            cat.status || 'Active',
            cat.parentVertical || 'textiles',
            catId
          ]
        );
      } else {
        console.log(`  Inserting new category: ${cat.name}...`);
        await connection.query(
          `INSERT INTO categories (
            name, slug, image, subCategoryCount, faqCount, showInHeader, topBusiness, isCurated, orderIndex, status, parentVertical
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            cat.name,
            cat.slug,
            optimizedImg,
            cat.subCategoryCount || 0,
            cat.faqCount || 0,
            cat.showInHeader !== undefined ? (cat.showInHeader ? 1 : 0) : 1,
            cat.topBusiness !== undefined ? (cat.topBusiness ? 1 : 0) : 0,
            cat.isCurated !== undefined ? (cat.isCurated ? 1 : 0) : 0,
            cat.order !== undefined ? Number(cat.order) : (cat.orderIndex !== undefined ? Number(cat.orderIndex) : 0),
            cat.status || 'Active',
            cat.parentVertical || 'textiles'
          ]
        );
      }
    }

    // Load products
    console.log('Reading products.json...');
    const productsData = JSON.parse(fs.readFileSync('products.json', 'utf8'));
    console.log(`Found ${productsData.length} products to import.`);

    for (const prod of productsData) {
      console.log(`Processing product: ${prod.name} (${prod.slug})...`);

      // Optimize images
      let optimizedImages = [];
      if (prod.images && Array.isArray(prod.images)) {
        for (let i = 0; i < prod.images.length; i++) {
          let img = prod.images[i];
          if (img && img.startsWith('data:image')) {
            console.log(`  Optimizing image ${i+1}/${prod.images.length} for product ${prod.name}...`);
            img = await optimizeBase64Image(img);
          }
          optimizedImages.push(img);
        }
      }

      const imagesVal = JSON.stringify(optimizedImages);
      const attributesVal = prod.attributes ? JSON.stringify(prod.attributes) : JSON.stringify({});
      const h1Val = prod.seo?.h1 || prod.h1 || null;
      const metaTitleVal = prod.seo?.metaTitle || prod.metaTitle || null;
      const metaDescriptionVal = prod.seo?.metaDescription || prod.metaDescription || null;
      const altTextVal = prod.seo?.altText || prod.altText || null;

      // Check if exists by slug
      const [existing] = await connection.query('SELECT id FROM products WHERE slug = ?', [prod.slug]);

      if (existing.length > 0) {
        console.log(`  Product already exists with slug "${prod.slug}". Updating fields...`);
        const prodId = existing[0].id;
        await connection.query(
          `UPDATE products SET 
            name = ?, 
            businessVertical = ?, 
            category = ?, 
            subCategory = ?, 
            description = ?, 
            images = ?, 
            videoUrl = ?, 
            brochureUrl = ?, 
            attributes = ?, 
            h1 = ?, 
            metaTitle = ?, 
            metaDescription = ?, 
            altText = ?, 
            isFeatured = ?, 
            isActive = ?
           WHERE id = ?`,
          [
            prod.name,
            prod.businessVertical || 'textiles',
            prod.category,
            prod.subCategory || null,
            prod.description || null,
            imagesVal,
            prod.videoUrl || null,
            prod.brochureUrl || null,
            attributesVal,
            h1Val,
            metaTitleVal,
            metaDescriptionVal,
            altTextVal,
            prod.isFeatured !== undefined ? (prod.isFeatured ? 1 : 0) : 0,
            prod.isActive !== undefined ? (prod.isActive ? 1 : 0) : 1,
            prodId
          ]
        );
      } else {
        console.log(`  Inserting new product: ${prod.name}...`);
        await connection.query(
          `INSERT INTO products (
            name, slug, businessVertical, category, subCategory, description, images, videoUrl, brochureUrl, attributes,
            h1, metaTitle, metaDescription, altText, isFeatured, isActive
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            prod.name,
            prod.slug,
            prod.businessVertical || 'textiles',
            prod.category,
            prod.subCategory || null,
            prod.description || null,
            imagesVal,
            prod.videoUrl || null,
            prod.brochureUrl || null,
            attributesVal,
            h1Val,
            metaTitleVal,
            metaDescriptionVal,
            altTextVal,
            prod.isFeatured !== undefined ? (prod.isFeatured ? 1 : 0) : 0,
            prod.isActive !== undefined ? (prod.isActive ? 1 : 0) : 1
          ]
        );
      }
    }

    console.log('\n🎉 MongoDB to MySQL Import completed successfully!');

  } catch (error) {
    console.error('❌ Error during import:', error);
  } finally {
    await connection.end();
  }
}

run();
