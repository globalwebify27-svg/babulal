import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Standardized slug generator function.
 * Rules:
 * - Convert to lowercase
 * - Remove apostrophes (e.g. Men's -> Mens, Women's -> Womens)
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
    .replace(/[^a-z0-9]+/g, '-') // Replace spaces & special chars with hyphen
    .replace(/^-+|-+$/g, '')     // Trim leading/trailing hyphens
    .replace(/-{2,}/g, '-');     // Collapse multiple hyphens
}
