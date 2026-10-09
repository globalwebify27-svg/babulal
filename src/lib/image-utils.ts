
import sharp from 'sharp';

/**
 * Optimizes a base64 image string by resizing and compressing it.
 * @param base64String The full base64 string (including data:image/...)
 * @param maxWidth Optional max width (default: 1200)
 * @param maxHeight Optional max height (default: 1200)
 * @returns Optimized base64 string
 */
export async function optimizeBase64Image(base64String: string, maxWidth = 1200, maxHeight = 1200): Promise<string> {
  if (!base64String || !base64String.startsWith('data:image')) {
    return base64String;
  }

  try {
    const [header, base64Data] = base64String.split(',');
    const buffer = Buffer.from(base64Data, 'base64');

    // Only optimize if the buffer is larger than 150KB to save CPU
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
    console.error('Image optimization failed:', error);
    return base64String; // Return original if optimization fails
  }
}
