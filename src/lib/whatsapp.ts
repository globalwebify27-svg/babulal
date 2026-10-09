import { DEFAULT_WHATSAPP_NUMBER, SITE_URL } from './constants';

/**
 * Normalizes any user-entered WhatsApp number into a clean digits-only string for wa.me URLs.
 * Examples:
 * "+91 98765-43210" -> "919876543210"
 * "9876543210" (10 digits Indian) -> "919876543210"
 * "919876543210" -> "919876543210"
 */
export function normalizeWhatsAppNumber(rawNumber?: string): string {
  const input = (rawNumber && rawNumber.trim()) ? rawNumber : DEFAULT_WHATSAPP_NUMBER;
  if (!input) return '';
  
  // Strip non-digit characters
  let digits = input.replace(/\D/g, '');
  
  // If 10 digits (e.g. Indian mobile number without country code), prepend '91'
  if (digits.length === 10) {
    digits = '91' + digits;
  }
  
  // Basic validation: phone numbers with country code are typically 10 to 15 digits
  if (digits.length < 10 || digits.length > 15) {
    return '';
  }
  
  return digits;
}

/**
 * Builds the dynamic pre-filled WhatsApp message for a category quote request.
 */
export function buildCategoryInquiryMessage(parentCategory: string, categoryName: string, categoryUrl: string): string {
  const parent = parentCategory || 'Textiles';
  const collection = categoryName || 'Collection';
  const url = categoryUrl || SITE_URL;

  return `Hello Babulal Premsons,\n\n` +
    `I am interested in the following collection:\n\n` +
    `Category: ${parent}\n` +
    `Collection: ${collection}\n\n` +
    `Please share the available collection, pricing and catalogue.\n\n` +
    `Website:\n${url}\n\n` +
    `Thank you.`;
}

/**
 * Generates the complete wa.me URL given a raw phone number, parent category, collection name, and full URL.
 */
export function buildWhatsAppQuoteUrl(
  rawNumber: string | undefined, 
  parentCategory: string, 
  categoryName: string, 
  categoryUrl: string
): string | null {
  const normalizedNumber = normalizeWhatsAppNumber(rawNumber);
  if (!normalizedNumber) return null;
  
  const message = buildCategoryInquiryMessage(parentCategory, categoryName, categoryUrl);
  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`;
}
