import pool, { initDb } from './db';

/**
 * Standardized slug generator function.
 * Rules:
 * - Convert to lowercase
 * - Remove apostrophes (e.g. Men's -> Mens)
 * - Replace spaces, brackets, parentheses, punctuation, and special characters with hyphens
 * - Remove any non-alphanumeric characters (except hyphens)
 * - Collapse multiple consecutive hyphens into a single hyphen
 * - Trim leading and trailing hyphens
 */
export function generateSlug(name: string): string {
  if (!name) return '';
  return name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')        // Remove apostrophes: Men's -> mens
    .replace(/[^a-z0-9]+/g, '-') // Replace spaces & special chars (including brackets) with hyphen
    .replace(/^-+|-+$/g, '')     // Trim leading/trailing hyphens
    .replace(/-{2,}/g, '-');     // Collapse multiple hyphens
}

const RESERVED_SLUGS = new Set([
  'about',
  'contact',
  'admin',
  'auth',
  'welcome',
  'welcome-chas',
  'api',
  'sitemap.xml',
  'robots.txt',
  'blog',
  'textiles',
  'honda',
  'bajaj',
  'trucking',
  'muva-industries'
]);

/**
 * Generates a unique slug for a given MySQL table.
 * Table name can be 'categories', 'sub_categories', 'sub_sub_categories', 'products', or 'blogs'.
 * For taxonomy tables ('categories', 'sub_categories', 'sub_sub_categories'), checks
 * cross-table uniqueness and reserved slugs so that all public root URLs remain collision-free.
 * Appends '-2', '-3', etc. if collisions occur.
 */
export async function generateUniqueSlug(
  tableName: 'categories' | 'sub_categories' | 'sub_sub_categories' | 'products' | 'blogs',
  name: string,
  currentId?: string | number,
  customSlug?: string
): Promise<string> {
  await initDb();
  
  const baseSlug = generateSlug(customSlug || name) || 'unnamed';
  let candidateSlug = baseSlug;
  let counter = 1;
  let isUnique = false;

  const isTaxonomy = ['categories', 'sub_categories', 'sub_sub_categories'].includes(tableName);

  while (!isUnique) {
    if (isTaxonomy && RESERVED_SLUGS.has(candidateSlug.toLowerCase())) {
      counter++;
      candidateSlug = `${baseSlug}-${counter}`;
      continue;
    }

    if (isTaxonomy) {
      // Check cross-table uniqueness across categories, sub_categories, and sub_sub_categories
      const catCheck = tableName === 'categories' && currentId
        ? 'SELECT id FROM categories WHERE LOWER(slug) = ? AND id != ?'
        : 'SELECT id FROM categories WHERE LOWER(slug) = ?';
      const catParams = tableName === 'categories' && currentId ? [candidateSlug, currentId] : [candidateSlug];

      const subCheck = tableName === 'sub_categories' && currentId
        ? 'SELECT id FROM sub_categories WHERE LOWER(slug) = ? AND id != ?'
        : 'SELECT id FROM sub_categories WHERE LOWER(slug) = ?';
      const subParams = tableName === 'sub_categories' && currentId ? [candidateSlug, currentId] : [candidateSlug];

      const subSubCheck = tableName === 'sub_sub_categories' && currentId
        ? 'SELECT id FROM sub_sub_categories WHERE LOWER(slug) = ? AND id != ?'
        : 'SELECT id FROM sub_sub_categories WHERE LOWER(slug) = ?';
      const subSubParams = tableName === 'sub_sub_categories' && currentId ? [candidateSlug, currentId] : [candidateSlug];

      const [[catRows], [subRows], [subSubRows]]: any[] = await Promise.all([
        pool.query(catCheck, catParams),
        pool.query(subCheck, subParams),
        pool.query(subSubCheck, subSubParams)
      ]);

      if (catRows.length === 0 && subRows.length === 0 && subSubRows.length === 0) {
        isUnique = true;
      } else {
        counter++;
        candidateSlug = `${baseSlug}-${counter}`;
      }
    } else {
      let query = `SELECT id FROM ${tableName} WHERE slug = ?`;
      const params: any[] = [candidateSlug];

      if (currentId !== undefined && currentId !== null && currentId !== '') {
        query += ` AND id != ?`;
        params.push(currentId);
      }

      const [rows]: any = await pool.query(query, params);

      if (rows.length === 0) {
        isUnique = true;
      } else {
        counter++;
        candidateSlug = `${baseSlug}-${counter}`;
      }
    }
  }

  return candidateSlug;
}

