import mysql from 'mysql2/promise';

// Prevent multiple pools in development
const pool = (global as any).mysqlPool || mysql.createPool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : 3306,
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'babulal_portal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000, // 10 seconds
  idleTimeout: 30000,           // Close connections that are idle for more than 30 seconds
  maxIdle: 10
});

// Intercept and wrap query methods to handle connection resets gracefully
const originalQuery = pool.query.bind(pool);
pool.query = async function (sql: any, values: any) {
  try {
    return await originalQuery(sql, values);
  } catch (error: any) {
    if (error.code === 'ECONNRESET' || error.code === 'PROTOCOL_CONNECTION_LOST') {
      console.warn(`⚠️ Database connection lost (${error.code}). Retrying query...`);
      return await originalQuery(sql, values);
    }
    throw error;
  }
} as any;

const originalExecute = pool.execute?.bind(pool);
if (originalExecute) {
  pool.execute = async function (sql: any, values: any) {
    try {
      return await originalExecute(sql, values);
    } catch (error: any) {
      if (error.code === 'ECONNRESET' || error.code === 'PROTOCOL_CONNECTION_LOST') {
        console.warn(`⚠️ Database connection lost (${error.code}). Retrying query...`);
        return await originalExecute(sql, values);
      }
      throw error;
    }
  } as any;
}

const originalGetConnection = pool.getConnection.bind(pool);
pool.getConnection = async function () {
  try {
    const conn = await originalGetConnection();
    // Verify connection is alive
    await conn.query('SELECT 1');
    return conn;
  } catch (error: any) {
    if (error.code === 'ECONNRESET' || error.code === 'PROTOCOL_CONNECTION_LOST') {
      console.warn(`⚠️ Connection lost during getConnection (${error.code}). Retrying...`);
      const conn = await originalGetConnection();
      await conn.query('SELECT 1');
      return conn;
    }
    throw error;
  }
} as any;

if (process.env.NODE_ENV !== 'production') {
  (global as any).mysqlPool = pool;
}

let isDbInitialized = false;
let initPromise: Promise<void> | null = null;

export async function initDb() {
  if (isDbInitialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const connection = await pool.getConnection();
    try {
      // 1. Create Users table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'STAFF',
          verticals TEXT,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // 2. Create Categories table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          image LONGTEXT,
          cardImage LONGTEXT,
          subCategoryCount INT DEFAULT 0,
          faqCount INT DEFAULT 0,
          showInHeader BOOLEAN DEFAULT TRUE,
          topBusiness BOOLEAN DEFAULT FALSE,
          isCurated BOOLEAN DEFAULT FALSE,
          orderIndex INT DEFAULT 0,
          status VARCHAR(50) DEFAULT 'Active',
          parentVertical VARCHAR(255) DEFAULT 'textiles',
          robotsIndex BOOLEAN DEFAULT FALSE,
          robotsFollow BOOLEAN DEFAULT TRUE,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Migration: Add cardImage, robotsIndex, robotsFollow to categories if missing
      try {
        await connection.query(`ALTER TABLE categories ADD COLUMN cardImage LONGTEXT AFTER image`);
      } catch (err) {}
      try {
        await connection.query(`ALTER TABLE categories ADD COLUMN robotsIndex BOOLEAN DEFAULT FALSE`);
      } catch (err) {}
      try {
        await connection.query(`ALTER TABLE categories ADD COLUMN robotsFollow BOOLEAN DEFAULT TRUE`);
      } catch (err) {}

      // 3. Create Sub-Categories table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS sub_categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL,
          categoryId INT NOT NULL,
          image LONGTEXT,
          cardImage LONGTEXT,
          status VARCHAR(50) DEFAULT 'Active',
          orderIndex INT DEFAULT 0,
          brochureUrl VARCHAR(500),
          robotsIndex BOOLEAN DEFAULT FALSE,
          robotsFollow BOOLEAN DEFAULT TRUE,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Migration: Add image, cardImage, robotsIndex, robotsFollow to sub_categories if missing
      try {
        await connection.query(`ALTER TABLE sub_categories ADD COLUMN image LONGTEXT AFTER categoryId`);
      } catch (err) {}
      try {
        await connection.query(`ALTER TABLE sub_categories ADD COLUMN cardImage LONGTEXT AFTER image`);
      } catch (err) {}
      try {
        await connection.query(`ALTER TABLE sub_categories ADD COLUMN robotsIndex BOOLEAN DEFAULT FALSE`);
      } catch (err) {}
      try {
        await connection.query(`ALTER TABLE sub_categories ADD COLUMN robotsFollow BOOLEAN DEFAULT TRUE`);
      } catch (err) {}

      // 3.5. Create Sub-Sub-Categories table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS sub_sub_categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL,
          subCategoryId INT NOT NULL,
          status VARCHAR(50) DEFAULT 'Active',
          orderIndex INT DEFAULT 0,
          robotsIndex BOOLEAN DEFAULT FALSE,
          robotsFollow BOOLEAN DEFAULT TRUE,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (subCategoryId) REFERENCES sub_categories(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Migration: Add robotsIndex and robotsFollow to sub_sub_categories if missing
      try {
        await connection.query(`ALTER TABLE sub_sub_categories ADD COLUMN robotsIndex BOOLEAN DEFAULT FALSE`);
      } catch (err) {}
      try {
        await connection.query(`ALTER TABLE sub_sub_categories ADD COLUMN robotsFollow BOOLEAN DEFAULT TRUE`);
      } catch (err) {}

      // 4. Create Products table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          businessVertical VARCHAR(255) NOT NULL,
          category VARCHAR(255) NOT NULL,
          subCategory VARCHAR(255),
          subSubCategory VARCHAR(255),
          shortDescription TEXT,
          description TEXT,
          images LONGTEXT,
          videoUrl VARCHAR(500),
          brochureUrl VARCHAR(500),
          attributes TEXT,
          h1 VARCHAR(255),
          metaTitle VARCHAR(255),
          metaDescription TEXT,
          altText VARCHAR(255),
          isFeatured BOOLEAN DEFAULT FALSE,
          isActive BOOLEAN DEFAULT TRUE,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Migration: Add shortDescription and subSubCategory to existing tables if missing
      try {
        await connection.query(`ALTER TABLE products ADD COLUMN shortDescription TEXT`);
      } catch (err) {
        // Column may already exist
      }
      try {
        await connection.query(`ALTER TABLE products ADD COLUMN subSubCategory VARCHAR(255)`);
      } catch (err) {
        // Column may already exist
      }

      // 5. Create Leads table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS leads (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          mobile VARCHAR(50) NOT NULL,
          city VARCHAR(255),
          state VARCHAR(255),
          interest VARCHAR(255),
          businessVertical VARCHAR(255) NOT NULL,
          source VARCHAR(50) DEFAULT 'FORM',
          status VARCHAR(50) DEFAULT 'NEW',
          notes TEXT,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // 6. Create Banners table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS banners (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          subtitle VARCHAR(255),
          image LONGTEXT NOT NULL,
          vertical VARCHAR(255) NOT NULL DEFAULT 'HOME',
          link VARCHAR(500),
          orderIndex INT DEFAULT 0,
          isActive BOOLEAN DEFAULT TRUE,
          position VARCHAR(50) DEFAULT 'HOME_HERO',
          alignment VARCHAR(50) DEFAULT 'center',
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // 7. Create Landing Content table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS landing_content (
          id INT AUTO_INCREMENT PRIMARY KEY,
          vertical VARCHAR(255) NOT NULL UNIQUE,
          heroTitle VARCHAR(255) NOT NULL,
          heroSubtitle VARCHAR(255),
          aboutTitle VARCHAR(255) DEFAULT 'Our Legacy',
          aboutContent TEXT,
          features TEXT,
          contactEmail VARCHAR(255),
          contactPhone VARCHAR(50),
          address TEXT,
          facebookPixelId VARCHAR(255),
          facebookPixelEnabled BOOLEAN DEFAULT FALSE,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // 8. Create Reels table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS reels (
          id INT AUTO_INCREMENT PRIMARY KEY,
          instagramId VARCHAR(255) NOT NULL,
          title VARCHAR(255),
          category VARCHAR(255),
          orderIndex INT DEFAULT 0,
          status VARCHAR(50) DEFAULT 'Active',
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Seed Reels if table is empty
      try {
        const [reelsCount]: any = await connection.query('SELECT COUNT(*) as count FROM reels');
        if (reelsCount[0].count === 0) {
          await connection.query(`
            INSERT INTO reels (instagramId, title, category, orderIndex) VALUES
            ('DVxuBIWEZOC', 'Royal Wedding Collection', 'Handloom Silk', 1),
            ('DTiK-Z6Ed8U', 'Handcrafted Luxury', 'Bespoke Suiting', 2),
            ('DTSqfNBkZVy', 'Textile Heritage Show', 'Legacy Collection', 3),
            ('DTC2iElEcQ0', 'New Arrival Exhibit', 'Modern Ethnic', 4),
            ('DRPEMCeEZ1A', 'Editorial Showcase', 'Corporate Wear', 5),
            ('DQ_iBc5EqHZ', 'Bridal Masterpiece', 'Wedding Special', 6)
          `);
        }
      } catch (err) {
        console.error('Failed to seed reels:', err);
      }

      try {
        await connection.query('ALTER TABLE landing_content ADD COLUMN marqueeTexts TEXT');
      } catch (e) {
        // Column might already exist
      }

      // 9. Create Welcome Page Settings table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS welcome_page_settings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          storeLocation VARCHAR(255) DEFAULT 'Ranchi',
          welcomeTitle VARCHAR(255) DEFAULT 'Welcome to Babulal Premkumar',
          welcomeMessage TEXT,
          introTitle VARCHAR(255) DEFAULT 'About Us',
          introContent TEXT,
          videoUrl VARCHAR(500) DEFAULT '',
          videoTitle VARCHAR(255) DEFAULT 'Shopping Guide',
          feedbackUrl VARCHAR(500) DEFAULT '',
          contactPhone VARCHAR(50) DEFAULT '',
          contactEmail VARCHAR(255) DEFAULT '',
          address TEXT,
          googleMapsUrl VARCHAR(500) DEFAULT '',
          whatsappNumber VARCHAR(50) DEFAULT '',
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      try {
        const [columns]: any = await connection.query(`SHOW COLUMNS FROM welcome_page_settings LIKE 'storeLocation'`);
        if (columns.length === 0) {
          await connection.query(`ALTER TABLE welcome_page_settings ADD COLUMN storeLocation VARCHAR(255) DEFAULT 'Ranchi' AFTER id`);
          console.log('Added storeLocation column to welcome_page_settings table');
          
          await connection.query(`
            INSERT INTO welcome_page_settings (
              storeLocation, welcomeTitle, welcomeMessage, introTitle, introContent, videoUrl, videoTitle, feedbackUrl, contactPhone, contactEmail, address, googleMapsUrl, whatsappNumber
            ) SELECT 
              'Chas', welcomeTitle, welcomeMessage, introTitle, 
              'With a legacy of over 100 years, Babulal Premsons Group is a household name in Chas, Bokaro, Jharkhand, trusted by generations for premium quality textiles, automobiles, and more.',
              '/BLPK Roadmap.mp4', videoTitle, 
              'https://search.google.com/local/writereview?placeid=ChIJ6_GSN7Eh9DkRs9gxWhVmgXQ',
              '+91 92967 98387', contactEmail,
              'Main Rd, opposite Kedia Bhawan, near Raymond Retail shop, Bihar Colony, Shivpuri Colony, Chas, Bokaro Steel City, Jharkhand 827013',
              'https://maps.app.goo.gl/CHvWqjQkXby1uCXbA',
              '+91 92967 98387'
            FROM welcome_page_settings WHERE storeLocation = 'Ranchi' LIMIT 1
          `);
        }
      } catch (err) {
        console.error('Error adding storeLocation to welcome_page_settings:', err);
      }

      // Seed Welcome Page Settings if empty
      try {
        const [settingsCount]: any = await connection.query('SELECT COUNT(*) as count FROM welcome_page_settings');
        if (settingsCount[0].count === 0) {
          await connection.query(`
            INSERT INTO welcome_page_settings (
              storeLocation, welcomeTitle, welcomeMessage, introTitle, introContent, videoUrl, videoTitle, feedbackUrl, contactPhone, contactEmail, address, googleMapsUrl, whatsappNumber
            ) VALUES 
            (
              'Ranchi', 'Welcome to Babulal Premkumar',
              'Thank you for visiting us. We are delighted to have you as our valued customer. Explore our latest collections, check our shopping guide video, and feel free to connect with us or share your feedback.',
              'Our Legacy',
              'With a legacy of over 100 years, Babulal Premsons Group is a household name in Ranchi, Jharkhand, trusted by generations for premium quality textiles, automobiles, and more.',
              'https://www.youtube.com/embed/dQw4w9WgXcQ',
              'Experience Babulal Premkumar: Your Shopping Guide',
              'https://g.page/r/your-google-review-link/review',
              '+91 651 220 7555',
              'Group@babulalpremsons.com',
              'Main Road, Ranchi, Jharkhand - 834001',
              'https://maps.google.com',
              '+91 651 220 7555'
            ),
            (
              'Chas', 'Welcome to Babulal Premkumar',
              'Thank you for visiting us. We are delighted to have you as our valued customer.',
              'Our Legacy',
              'With a legacy of over 100 years, Babulal Premsons Group is a household name in Chas, Bokaro, Jharkhand, trusted by generations for premium quality textiles, automobiles, and more.',
              '/BLPK Roadmap.mp4',
              'Experience Babulal Premkumar: Your Shopping Guide',
              'https://search.google.com/local/writereview?placeid=ChIJ6_GSN7Eh9DkRs9gxWhVmgXQ',
              '+91 92967 98387',
              'Group@babulalpremsons.com',
              'Main Rd, opposite Kedia Bhawan, near Raymond Retail shop, Bihar Colony, Shivpuri Colony, Chas, Bokaro Steel City, Jharkhand 827013',
              'https://maps.app.goo.gl/CHvWqjQkXby1uCXbA',
              '+91 92967 98387'
            )
          `);
        }
      } catch (err) {
        console.error('Failed to seed welcome page settings:', err);
      }


      // 10. Create Welcome Page Reviews table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS welcome_page_reviews (
          id INT AUTO_INCREMENT PRIMARY KEY,
          customerName VARCHAR(255) NOT NULL,
          mobileNumber VARCHAR(50) DEFAULT NULL,
          rating INT NOT NULL,
          comment TEXT,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      try {
        const [columns]: any = await connection.query(`SHOW COLUMNS FROM welcome_page_reviews LIKE 'mobileNumber'`);
        if (columns.length === 0) {
          await connection.query(`ALTER TABLE welcome_page_reviews ADD COLUMN mobileNumber VARCHAR(50) DEFAULT NULL AFTER customerName`);
          console.log('Added mobileNumber column to welcome_page_reviews table');
        }
      } catch (err) {
        console.error('Error adding mobileNumber column to welcome_page_reviews:', err);
      }

      // 11. Create Category SEO Content table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS category_seo_content (
          id INT AUTO_INCREMENT PRIMARY KEY,
          categoryId INT DEFAULT NULL,
          subCategoryId INT DEFAULT NULL,
          subSubCategoryId INT DEFAULT NULL,
          h1 VARCHAR(255),
          metaTitle VARCHAR(255),
          metaDescription TEXT,
          canonicalUrl VARCHAR(500),
          robotsIndex VARCHAR(50) DEFAULT 'noindex',
          robotsFollow VARCHAR(50) DEFAULT 'follow',
          htmlContent LONGTEXT,
          introContent TEXT,
          bannerImage LONGTEXT,
          bannerAlt VARCHAR(255),
          youtubeUrl VARCHAR(500),
          relatedCategoryIds TEXT,
          showInventoryCatalog BOOLEAN DEFAULT FALSE,
          status VARCHAR(50) DEFAULT 'Published',
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_cat (categoryId),
          INDEX idx_subcat (subCategoryId),
          INDEX idx_subsubcat (subSubCategoryId)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Migration checks for existing category_seo_content columns
      try {
        await connection.query(`ALTER TABLE category_seo_content ADD COLUMN subSubCategoryId INT DEFAULT NULL AFTER subCategoryId`);
      } catch (e) {}
      try {
        await connection.query(`ALTER TABLE category_seo_content ADD COLUMN htmlContent LONGTEXT AFTER robotsFollow`);
      } catch (e) {}
      try {
        await connection.query(`ALTER TABLE category_seo_content ADD COLUMN showInventoryCatalog BOOLEAN DEFAULT FALSE AFTER relatedCategoryIds`);
      } catch (e) {}

      // 12. Create Category SEO Sections table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS category_seo_sections (
          id INT AUTO_INCREMENT PRIMARY KEY,
          seoContentId INT NOT NULL,
          heading VARCHAR(255),
          headingLevel VARCHAR(10) DEFAULT 'H2',
          content TEXT,
          bulletPoints TEXT,
          image LONGTEXT,
          imageAlt VARCHAR(255),
          videoUrl VARCHAR(500),
          orderIndex INT DEFAULT 0,
          isActive BOOLEAN DEFAULT TRUE,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (seoContentId) REFERENCES category_seo_content(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // 13. Create Blogs table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS blogs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          subtitle VARCHAR(255) DEFAULT NULL,
          excerpt TEXT DEFAULT NULL,
          content LONGTEXT NOT NULL,
          featuredImage LONGTEXT DEFAULT NULL,
          imageAlt VARCHAR(255) DEFAULT NULL,
          author VARCHAR(255) DEFAULT 'Babulal Premsons Editorial',
          authorRole VARCHAR(255) DEFAULT 'Fashion & Textile Specialist',
          category VARCHAR(255) DEFAULT 'Fashion & Trends',
          tags TEXT DEFAULT NULL,
          status VARCHAR(50) DEFAULT 'Draft',
          isFeatured BOOLEAN DEFAULT FALSE,
          readTime VARCHAR(50) DEFAULT '5 min read',
          metaTitle VARCHAR(255) DEFAULT NULL,
          metaDescription TEXT DEFAULT NULL,
          canonicalUrl VARCHAR(500) DEFAULT NULL,
          publishedAt DATETIME DEFAULT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_blog_slug (slug),
          INDEX idx_blog_status (status),
          INDEX idx_blog_featured (isFeatured)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Seed initial high-quality blog posts if table is empty
      try {
        const [blogsCount]: any = await connection.query('SELECT COUNT(*) as count FROM blogs');
        if (blogsCount[0].count === 0) {
          await connection.query(`
            INSERT INTO blogs (
              title, slug, subtitle, excerpt, content, featuredImage, imageAlt, author, authorRole, category, tags, status, isFeatured, readTime, metaTitle, metaDescription, publishedAt
            ) VALUES 
            (
              'The Evolution of Banarasi Silk: A Century of Timeless Royalty',
              'the-evolution-of-banarasi-silk',
              'Exploring the weaving techniques, royal heritage, and enduring luxury of Varanasi handlooms.',
              'Discover the centuries-old legacy of Banarasi silk, from ancient royal courts to the modern bridal runway, and how Babulal Premsons preserves this heritage.',
              '<h2>The Royal Origins of Banarasi Silk</h2><p>Banarasi silk sarees represent the absolute pinnacle of Indian handloom artistry. With roots tracing back centuries to the sacred ghats of Varanasi, these sarees have adorned royal brides, Mughal queens, and connoisseurs of luxury across eras.</p><h3>The Artistry of Zari Weaving</h3><p>What sets an authentic Banarasi drape apart is its signature brocade weaving—traditionally accomplished with pure gold and silver threads known as Zari. Intricate floral motifs (butis), royal paisleys (kalka), and architectural jaal patterns are woven over weeks of painstaking artisan handwork.</p><h3>Styling for Modern Celebrations</h3><p>In contemporary Indian fashion, the classic Banarasi drape continues to evolve. Designers and modern brides pair traditional Katan and Kadiyal weaves with minimalist blouses, statement temple jewelry, and contemporary silhouettes.</p><p>At Babulal Premsons, our century-old heritage connects you directly with the master weavers of Varanasi, bringing timeless authenticity and Eastern India\\'s most revered collections straight to your wardrobe.</p>',
              '/silk_saree_royal.png',
              'Royal Banarasi Silk Saree Weaving Craftsmanship',
              'Ahmad Sana',
              'Heritage Textiles Curator',
              'Heritage & Craft',
              '["Banarasi Silk", "Handloom", "Bridal Saree", "Textile Heritage"]',
              'Published',
              TRUE,
              '6 min read',
              'The Evolution of Banarasi Silk | Babulal Premsons Journal',
              'Explore the royal history, intricate Zari craft, and contemporary styling of authentic Banarasi silk sarees at Babulal Premsons.',
              NOW()
            ),
            (
              'Bridal Lehenga Trends 2026: Royal Zari, Pastel Hues & Regal Velvets',
              'bridal-lehenga-trends-2026',
              'A comprehensive trend forecast for the modern Indian bride seeking timeless grandeur.',
              'From dreamy blush pastels to opulent heritage velvets, delve into the defining bridal lehenga silhouettes and embroidery trends for this wedding season.',
              '<h2>The New Era of Indian Bridal Couture</h2><p>The bridal fashion landscape in 2026 is an exquisite confluence of royal heritage and contemporary comfort. Brides today seek ensembles that honor generational traditions while offering fluid grace and distinctive personality.</p><h3>1. The Renaissance of Deep Crimson and Royal Velvet</h3><p>While experimental palettes have had their moment, deep royal crimsons, sindoori reds, and midnight maroon velvets remain supreme. Embellished with antique dabka, tilla, and zardozi embroidery, these masterworks exude regal authority.</p><h3>2. The Rise of Ethereal Pastels and Floral Zari</h3><p>For daylight pheras and destination ceremonies, brides are gravitating towards blush pinks, powdered mint, and ivory gold palettes layered with tonal sequins and delicate resham work.</p><h3>3. Unbundled Procurement: The Babulal Premsons Advantage</h3><p>At Babulal Premsons Ranchi, we empower our bridal shoppers with complete transparency and direct wholesale pricing throughout the year—allowing you to handpick exactly what completes your bridal dream.</p>',
              '/bridal_luxury.png',
              'Luxury Bridal Lehenga Collection 2026',
              'Pooja Agarwal',
              'Senior Bridal Stylist',
              'Bridal Couture',
              '["Bridal Lehenga", "Wedding Trends 2026", "Royal Zari", "Ethnic Couture"]',
              'Published',
              FALSE,
              '5 min read',
              'Bridal Lehenga Trends 2026 | Babulal Premsons Group',
              'Discover top bridal lehenga trends for 2026 including royal velvets, pastels, and intricate Zari craftsmanship.',
              NOW()
            ),
            (
              'Fabric Care Guide: How to Preserve Handloom Sarees for Generations',
              'fabric-care-guide-preserve-handloom-sarees',
              'Practical conservation techniques to maintain the lustre, strength, and beauty of heirloom silks.',
              'Handloom sarees are not just garments; they are heirlooms. Learn essential preservation and storage tips to keep your precious silks vibrant for decades.',
              '<h2>Heirlooms that Stand the Test of Time</h2><p>A pure silk or handloom saree is crafted to outlive generations. When maintained with proper care, a treasured piece passed down from a grandmother retains its vibrant luster, delicate zari, and supple feel.</p><h3>Storage Essentials: Say No to Plastic</h3><p>Never store pure silks in plastic bags, as lack of air circulation can cause moisture retention and discoloration of gold zari. Instead, wrap sarees individually in unbleached muslin cloth or soft pure cotton bags.</p><h3>Refolding Rituals</h3><p>Every six months, take your heirloom sarees out, air them in mild indirect shade, and refold them along different creases to prevent fiber breakage along folded edges.</p><h3>Professional Dry Cleaning</h3><p>Always trust delicate zari and raw silks to reputable dry cleaners. Never attempt home machine washing or harsh chemical spot cleaning on hand-woven weaves.</p>',
              '/textile_factory.png',
              'Heirloom Handloom Silk Preservation and Storage Guide',
              'Babulal Premsons Editorial',
              'Textile Care Specialists',
              'Care & Styling',
              '["Fabric Care", "Silk Saree Care", "Heirloom Textiles", "Handloom Maintenance"]',
              'Published',
              FALSE,
              '4 min read',
              'How to Care for Pure Silk & Handloom Sarees | Care Guide',
              'Step-by-step master guide to preserving handloom silk sarees, preventing zari tarnishing, and maintaining heirloom fabrics.',
              NOW()
            );
          `);
        }
      } catch (err) {
        console.error('Failed to seed blogs:', err);
      }

      // Default existing records to noindex for pre-launch
      try {
        await connection.query(`UPDATE categories SET robotsIndex = FALSE WHERE robotsIndex = TRUE`);
        await connection.query(`UPDATE sub_categories SET robotsIndex = FALSE WHERE robotsIndex = TRUE`);
        await connection.query(`UPDATE sub_sub_categories SET robotsIndex = FALSE WHERE robotsIndex = TRUE`);
        await connection.query(`UPDATE category_seo_content SET robotsIndex = 'noindex' WHERE robotsIndex = 'index' OR robotsIndex IS NULL`);
      } catch (e) {}

      isDbInitialized = true;
      console.log('✅ MySQL Database and Tables initialized successfully.');
    } catch (error) {
      console.error('❌ Error initializing MySQL Database:', error);
      initPromise = null;
      throw error;
    } finally {
      connection.release();
    }
  })();

  return initPromise;
}

export default pool;
