import pool, { initDb } from './db';
import { generateSlug } from './utils';

export { generateSlug };

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

  // If this newly assigned taxonomy slug was previously in url_redirects, delete the redirect so it routes directly
  if (isTaxonomy) {
    try {
      await pool.query('DELETE FROM url_redirects WHERE LOWER(sourceSlug) = ?', [candidateSlug.toLowerCase()]);
    } catch (e) {
      // Ignore if table not yet initialized
    }
  }

  return candidateSlug;
}

/**
 * Records a 301 permanent redirect from sourceSlug to targetSlug.
 * Flattens redirect chains and prevents redirect loops.
 */
export async function recordSlugRedirect(sourceSlug: string, targetSlug: string): Promise<void> {
  if (!sourceSlug || !targetSlug) return;
  const source = sourceSlug.toLowerCase().trim();
  const target = targetSlug.toLowerCase().trim();
  if (source === target) return;

  await initDb();

  try {
    // 1. Remove reverse redirect to prevent 2-hop loops (e.g., if target -> source existed)
    await pool.query('DELETE FROM url_redirects WHERE LOWER(sourceSlug) = ?', [target]);

    // 2. Flatten any existing chains: entries pointing to source now point directly to target
    await pool.query('UPDATE url_redirects SET targetSlug = ? WHERE LOWER(targetSlug) = ?', [target, source]);

    // 3. Upsert: source -> target
    await pool.query(
      `INSERT INTO url_redirects (sourceSlug, targetSlug)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE targetSlug = VALUES(targetSlug), updatedAt = CURRENT_TIMESTAMP`,
      [source, target]
    );
  } catch (err) {
    console.error('Failed to record URL redirect:', err);
  }
}

/**
 * Retrieves the permanent redirect target for a former slug, if one exists.
 */
export async function getSlugRedirect(sourceSlug: string): Promise<string | null> {
  if (!sourceSlug) return null;
  await initDb();
  try {
    const [rows]: any = await pool.query(
      'SELECT targetSlug FROM url_redirects WHERE LOWER(sourceSlug) = ? LIMIT 1',
      [sourceSlug.toLowerCase().trim()]
    );
    if (rows && rows.length > 0) {
      return rows[0].targetSlug;
    }
  } catch (err) {
    console.error('Failed to get URL redirect:', err);
  }
  return null;
}
