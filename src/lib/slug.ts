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

/**
 * Generates a unique slug for a given MySQL table.
 * Table name can be 'categories', 'sub_categories', 'sub_sub_categories', or 'products'.
 * Appends '-2', '-3', etc. if collisions occur.
 */
export async function generateUniqueSlug(
  tableName: 'categories' | 'sub_categories' | 'sub_sub_categories' | 'products',
  name: string,
  currentId?: string | number,
  customSlug?: string
): Promise<string> {
  await initDb();
  
  const baseSlug = generateSlug(customSlug || name) || 'unnamed';
  let candidateSlug = baseSlug;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
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

  return candidateSlug;
}
