import mysql from 'mysql2/promise';

// Prevent multiple pools in development
const pool = (global as any).mysqlPool || mysql.createPool({
  host: process.env.DATABASE_HOST || 'localhost',
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
          subCategoryCount INT DEFAULT 0,
          faqCount INT DEFAULT 0,
          showInHeader BOOLEAN DEFAULT TRUE,
          topBusiness BOOLEAN DEFAULT FALSE,
          isCurated BOOLEAN DEFAULT FALSE,
          orderIndex INT DEFAULT 0,
          status VARCHAR(50) DEFAULT 'Active',
          parentVertical VARCHAR(255) DEFAULT 'textiles',
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // 3. Create Sub-Categories table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS sub_categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL,
          categoryId INT NOT NULL,
          status VARCHAR(50) DEFAULT 'Active',
          orderIndex INT DEFAULT 0,
          brochureUrl VARCHAR(500),
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // 3.5. Create Sub-Sub-Categories table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS sub_sub_categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL,
          subCategoryId INT NOT NULL,
          status VARCHAR(50) DEFAULT 'Active',
          orderIndex INT DEFAULT 0,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (subCategoryId) REFERENCES sub_categories(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

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

      try {
        await connection.query('ALTER TABLE landing_content ADD COLUMN marqueeTexts TEXT');
      } catch (e) {
        // Column might already exist
      }

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
