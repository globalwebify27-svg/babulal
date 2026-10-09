import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Increase body size limit for large video uploads
export const maxDuration = 60;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    // Verify Cloudinary config is loaded
    const config = cloudinary.config();
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      console.error('Cloudinary config missing:', {
        cloud_name: !!config.cloud_name,
        api_key: !!config.api_key,
        api_secret: !!config.api_secret,
      });
      return NextResponse.json(
        { error: 'Cloudinary not configured on server. Check environment variables.' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('video') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log(`Uploading video: ${file.name}, size: ${file.size} bytes`);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary as a video resource
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'babulal-videos',
          public_id: `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_').replace(/\.[^/.]+$/, '')}`,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    console.log('Upload successful:', result.secure_url);
    return NextResponse.json({ url: result.secure_url });
  } catch (error: any) {
    console.error('Upload route error:', error);
    return NextResponse.json(
      { error: 'Failed to upload video', details: error.message || String(error) },
      { status: 500 }
    );
  }
}
