import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import pool, { initDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { 
  DEFAULT_HOMEPAGE_SEO, 
  DEFAULT_VISUAL_SECTIONS,
  parseJsonSafe, 
  HomepageSeoSection, 
  VisualSectionsData 
} from '@/lib/homepage-seo';

interface RawSectionInput {
  heading?: unknown;
  headingLevel?: unknown;
  content?: unknown;
  bulletPoints?: unknown;
  internalLinks?: unknown;
  image?: unknown;
  imageAlt?: unknown;
  videoUrl?: unknown;
  orderIndex?: unknown;
  isActive?: unknown;
}

interface RawLinkInput {
  label?: unknown;
  url?: unknown;
}

async function checkAuth(req: Request): Promise<boolean> {
  const token = await getToken({ 
    req: req as unknown as Parameters<typeof getToken>[0]['req'], 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  return !!token;
}

function isValidUrl(val: string): boolean {
  if (!val) return true;
  const trimmed = val.trim();
  if (trimmed.startsWith('/')) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function sanitizeString(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str.trim();
}

export async function GET(req: Request) {
  try {
    const isAuthed = await checkAuth(req);
    if (!isAuthed) {
      return NextResponse.json(
        { error: 'Unauthorized: Administrative access required' },
        { status: 401 }
      );
    }

    await initDb();

    const [rows] = await pool.query(
      "SELECT * FROM homepage_seo WHERE pageIdentifier = 'home' LIMIT 1"
    ) as unknown as [Record<string, unknown>[]];

    if (!rows || rows.length === 0) {
      return NextResponse.json({
        settings: DEFAULT_HOMEPAGE_SEO,
        isInitial: true
      });
    }

    const row = rows[0];

    // Fetch all sections (both active and inactive) for the editor
    const [sectionRows] = await pool.query(
      "SELECT * FROM homepage_seo_sections WHERE homepageSeoId = ? ORDER BY orderIndex ASC, id ASC",
      [row.id]
    ) as unknown as [Record<string, unknown>[]];

    const sections: HomepageSeoSection[] = (sectionRows || []).map((sec: Record<string, unknown>) => ({
      id: sec.id as string | number,
      heading: String(sec.heading || ''),
      headingLevel: (sec.headingLevel === 'H3' || sec.headingLevel === 'H4') ? sec.headingLevel : 'H2',
      content: String(sec.content || ''),
      bulletPoints: parseJsonSafe<string[]>(sec.bulletPoints, []),
      internalLinks: parseJsonSafe<{ label: string; url: string }[]>(sec.internalLinks, []),
      image: String(sec.image || ''),
      imageAlt: String(sec.imageAlt || ''),
      videoUrl: String(sec.videoUrl || ''),
      orderIndex: Number(sec.orderIndex || 0),
      isActive: Boolean(sec.isActive)
    }));

    // Parse and merge visual sections with defaults
    const rawVisual = parseJsonSafe<Partial<VisualSectionsData> | null>(row.visualSections, null);
    const visualSections: VisualSectionsData = {
      valuePillars: Array.isArray(rawVisual?.valuePillars) && rawVisual.valuePillars.length > 0
        ? rawVisual.valuePillars.map((p, idx) => ({
            title: String(p?.title || DEFAULT_VISUAL_SECTIONS.valuePillars[idx]?.title || ''),
            sub: String(p?.sub || DEFAULT_VISUAL_SECTIONS.valuePillars[idx]?.sub || '')
          }))
        : DEFAULT_VISUAL_SECTIONS.valuePillars,
      legacy: rawVisual?.legacy
        ? {
            eyebrow: String(rawVisual.legacy.eyebrow ?? DEFAULT_VISUAL_SECTIONS.legacy.eyebrow),
            titlePrefix: String(rawVisual.legacy.titlePrefix ?? DEFAULT_VISUAL_SECTIONS.legacy.titlePrefix),
            titleHighlight: String(rawVisual.legacy.titleHighlight ?? DEFAULT_VISUAL_SECTIONS.legacy.titleHighlight),
            awards: Array.isArray(rawVisual.legacy.awards) && rawVisual.legacy.awards.length > 0
              ? rawVisual.legacy.awards.map((a, idx) => ({
                  year: String(a?.year ?? DEFAULT_VISUAL_SECTIONS.legacy.awards[idx]?.year ?? ''),
                  title: String(a?.title ?? DEFAULT_VISUAL_SECTIONS.legacy.awards[idx]?.title ?? ''),
                  region: String(a?.region ?? DEFAULT_VISUAL_SECTIONS.legacy.awards[idx]?.region ?? '')
                }))
              : DEFAULT_VISUAL_SECTIONS.legacy.awards,
            primaryNarrative: String(rawVisual.legacy.primaryNarrative ?? DEFAULT_VISUAL_SECTIONS.legacy.primaryNarrative),
            secondaryNarrative: String(rawVisual.legacy.secondaryNarrative ?? DEFAULT_VISUAL_SECTIONS.legacy.secondaryNarrative),
          }
        : DEFAULT_VISUAL_SECTIONS.legacy,
      metrics: Array.isArray(rawVisual?.metrics) && rawVisual.metrics.length > 0
        ? rawVisual.metrics.map((m, idx) => ({
            pre: String(m?.pre ?? DEFAULT_VISUAL_SECTIONS.metrics[idx]?.pre ?? ''),
            stat: String(m?.stat ?? DEFAULT_VISUAL_SECTIONS.metrics[idx]?.stat ?? ''),
            post: String(m?.post ?? DEFAULT_VISUAL_SECTIONS.metrics[idx]?.post ?? '')
          }))
        : DEFAULT_VISUAL_SECTIONS.metrics,
      curated: rawVisual?.curated
        ? {
            eyebrow: String(rawVisual.curated.eyebrow ?? DEFAULT_VISUAL_SECTIONS.curated.eyebrow),
            titlePrefix: String(rawVisual.curated.titlePrefix ?? DEFAULT_VISUAL_SECTIONS.curated.titlePrefix),
            titleHighlight: String(rawVisual.curated.titleHighlight ?? DEFAULT_VISUAL_SECTIONS.curated.titleHighlight),
            subtitle: String(rawVisual.curated.subtitle ?? DEFAULT_VISUAL_SECTIONS.curated.subtitle)
          }
        : DEFAULT_VISUAL_SECTIONS.curated
    };

    return NextResponse.json({
      settings: {
        id: row.id as number,
        pageIdentifier: 'home',
        metaTitle: String(row.metaTitle || ''),
        metaDescription: String(row.metaDescription || ''),
        metaKeywords: String(row.metaKeywords || ''),
        canonicalUrl: String(row.canonicalUrl || ''),
        robotsIndex: row.robotsIndex === 'noindex' ? 'noindex' : 'index',
        robotsFollow: row.robotsFollow === 'nofollow' ? 'nofollow' : 'follow',
        ogTitle: String(row.ogTitle || ''),
        ogDescription: String(row.ogDescription || ''),
        ogImage: String(row.ogImage || ''),
        ogType: String(row.ogType || 'website'),
        twitterCard: String(row.twitterCard || 'summary_large_image'),
        twitterTitle: String(row.twitterTitle || ''),
        twitterDescription: String(row.twitterDescription || ''),
        twitterImage: String(row.twitterImage || ''),
        h1: String(row.h1 || ''),
        h1Subtext: String(row.h1Subtext || ''),
        introParagraph: String(row.introParagraph || ''),
        status: String(row.status || 'Published'),
        sections: sections.length > 0 ? sections : DEFAULT_HOMEPAGE_SEO.sections,
        visualSections
      },
      isInitial: false
    });
  } catch (error: unknown) {
    console.error('Error fetching homepage SEO:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve homepage SEO settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const isAuthed = await checkAuth(req);
    if (!isAuthed) {
      return NextResponse.json(
        { error: 'Unauthorized: Administrative access required' },
        { status: 401 }
      );
    }

    const body = await req.json() as Record<string, unknown>;
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // 1. Validation
    const metaTitle = sanitizeString(body.metaTitle);
    const metaDescription = sanitizeString(body.metaDescription);
    const metaKeywords = sanitizeString(body.metaKeywords);
    const canonicalUrl = sanitizeString(body.canonicalUrl);
    const robotsIndex = body.robotsIndex === 'noindex' ? 'noindex' : 'index';
    const robotsFollow = body.robotsFollow === 'nofollow' ? 'nofollow' : 'follow';
    const ogTitle = sanitizeString(body.ogTitle);
    const ogDescription = sanitizeString(body.ogDescription);
    const ogImage = sanitizeString(body.ogImage);
    const ogType = sanitizeString(body.ogType) || 'website';
    const twitterCard = sanitizeString(body.twitterCard) || 'summary_large_image';
    const twitterTitle = sanitizeString(body.twitterTitle);
    const twitterDescription = sanitizeString(body.twitterDescription);
    const twitterImage = sanitizeString(body.twitterImage);

    const h1 = sanitizeString(body.h1);
    const h1Subtext = sanitizeString(body.h1Subtext);
    const introParagraph = sanitizeString(body.introParagraph);
    const status = body.status === 'Draft' ? 'Draft' : 'Published';

    if (canonicalUrl && !isValidUrl(canonicalUrl)) {
      return NextResponse.json(
        { error: 'Canonical URL must be a valid URL (e.g., https://babulalpremsons.com or /)' },
        { status: 400 }
      );
    }

    if (metaTitle.length > 255) {
      return NextResponse.json(
        { error: 'Meta title cannot exceed 255 characters' },
        { status: 400 }
      );
    }

    if (h1.length > 255) {
      return NextResponse.json(
        { error: 'Main H1 heading cannot exceed 255 characters' },
        { status: 400 }
      );
    }

    // 2. Process and sanitize visual sections
    const rawVisual = body.visualSections as Partial<VisualSectionsData> | undefined;
    const sanitizedVisualSections: VisualSectionsData = {
      valuePillars: Array.isArray(rawVisual?.valuePillars)
        ? rawVisual.valuePillars.slice(0, 4).map((p, idx) => ({
            title: sanitizeString(p?.title) || DEFAULT_VISUAL_SECTIONS.valuePillars[idx]?.title || '',
            sub: sanitizeString(p?.sub) || DEFAULT_VISUAL_SECTIONS.valuePillars[idx]?.sub || ''
          }))
        : DEFAULT_VISUAL_SECTIONS.valuePillars,
      legacy: {
        eyebrow: sanitizeString(rawVisual?.legacy?.eyebrow) || DEFAULT_VISUAL_SECTIONS.legacy.eyebrow,
        titlePrefix: sanitizeString(rawVisual?.legacy?.titlePrefix) || DEFAULT_VISUAL_SECTIONS.legacy.titlePrefix,
        titleHighlight: sanitizeString(rawVisual?.legacy?.titleHighlight) || DEFAULT_VISUAL_SECTIONS.legacy.titleHighlight,
        awards: Array.isArray(rawVisual?.legacy?.awards)
          ? rawVisual.legacy.awards.slice(0, 3).map((a, idx) => ({
              year: sanitizeString(a?.year) || DEFAULT_VISUAL_SECTIONS.legacy.awards[idx]?.year || '',
              title: sanitizeString(a?.title) || DEFAULT_VISUAL_SECTIONS.legacy.awards[idx]?.title || '',
              region: sanitizeString(a?.region) || DEFAULT_VISUAL_SECTIONS.legacy.awards[idx]?.region || ''
            }))
          : DEFAULT_VISUAL_SECTIONS.legacy.awards,
        primaryNarrative: sanitizeString(rawVisual?.legacy?.primaryNarrative) || DEFAULT_VISUAL_SECTIONS.legacy.primaryNarrative,
        secondaryNarrative: sanitizeString(rawVisual?.legacy?.secondaryNarrative) || DEFAULT_VISUAL_SECTIONS.legacy.secondaryNarrative,
      },
      metrics: Array.isArray(rawVisual?.metrics)
        ? rawVisual.metrics.slice(0, 4).map((m, idx) => ({
            pre: sanitizeString(m?.pre) || DEFAULT_VISUAL_SECTIONS.metrics[idx]?.pre || '',
            stat: sanitizeString(m?.stat) || DEFAULT_VISUAL_SECTIONS.metrics[idx]?.stat || '',
            post: sanitizeString(m?.post) || DEFAULT_VISUAL_SECTIONS.metrics[idx]?.post || ''
          }))
        : DEFAULT_VISUAL_SECTIONS.metrics,
      curated: {
        eyebrow: sanitizeString(rawVisual?.curated?.eyebrow) || DEFAULT_VISUAL_SECTIONS.curated.eyebrow,
        titlePrefix: sanitizeString(rawVisual?.curated?.titlePrefix) || DEFAULT_VISUAL_SECTIONS.curated.titlePrefix,
        titleHighlight: sanitizeString(rawVisual?.curated?.titleHighlight) || DEFAULT_VISUAL_SECTIONS.curated.titleHighlight,
        subtitle: sanitizeString(rawVisual?.curated?.subtitle) || DEFAULT_VISUAL_SECTIONS.curated.subtitle,
      }
    };
    const visualSectionsJson = JSON.stringify(sanitizedVisualSections);

    // 3. Process and validate repeatable SEO sections
    const rawSections = Array.isArray(body.sections) ? (body.sections as RawSectionInput[]) : [];
    const sanitizedSections = rawSections.map((sec: RawSectionInput, idx: number) => {
      const headingLevel = (sec.headingLevel === 'H3' || sec.headingLevel === 'H4') ? sec.headingLevel : 'H2';
      const bulletPoints = Array.isArray(sec.bulletPoints) 
        ? (sec.bulletPoints as unknown[]).map((bp: unknown) => String(bp || '').trim()).filter(Boolean)
        : [];
      const rawLinks = Array.isArray(sec.internalLinks) ? (sec.internalLinks as RawLinkInput[]) : [];
      const internalLinks = rawLinks.map((link: RawLinkInput) => ({
        label: String(link.label || '').trim(),
        url: String(link.url || '').trim()
      })).filter(l => l.label && l.url);

      return {
        heading: sanitizeString(sec.heading),
        headingLevel,
        content: sanitizeString(sec.content),
        bulletPoints: JSON.stringify(bulletPoints),
        internalLinks: JSON.stringify(internalLinks),
        image: sanitizeString(sec.image),
        imageAlt: sanitizeString(sec.imageAlt),
        videoUrl: sanitizeString(sec.videoUrl),
        orderIndex: typeof sec.orderIndex === 'number' ? sec.orderIndex : idx,
        isActive: sec.isActive !== undefined ? Boolean(sec.isActive) : true
      };
    });

    await initDb();
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // Upsert singleton homepage_seo
      await conn.query(
        `INSERT INTO homepage_seo (
          pageIdentifier, metaTitle, metaDescription, metaKeywords, canonicalUrl,
          robotsIndex, robotsFollow, ogTitle, ogDescription, ogImage, ogType,
          twitterCard, twitterTitle, twitterDescription, twitterImage,
          h1, h1Subtext, introParagraph, visualSections, status
        ) VALUES (
          'home', ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?, ?
        )
        ON DUPLICATE KEY UPDATE
          metaTitle = VALUES(metaTitle),
          metaDescription = VALUES(metaDescription),
          metaKeywords = VALUES(metaKeywords),
          canonicalUrl = VALUES(canonicalUrl),
          robotsIndex = VALUES(robotsIndex),
          robotsFollow = VALUES(robotsFollow),
          ogTitle = VALUES(ogTitle),
          ogDescription = VALUES(ogDescription),
          ogImage = VALUES(ogImage),
          ogType = VALUES(ogType),
          twitterCard = VALUES(twitterCard),
          twitterTitle = VALUES(twitterTitle),
          twitterDescription = VALUES(twitterDescription),
          twitterImage = VALUES(twitterImage),
          h1 = VALUES(h1),
          h1Subtext = VALUES(h1Subtext),
          introParagraph = VALUES(introParagraph),
          visualSections = VALUES(visualSections),
          status = VALUES(status),
          updatedAt = CURRENT_TIMESTAMP`,
        [
          metaTitle, metaDescription, metaKeywords, canonicalUrl,
          robotsIndex, robotsFollow, ogTitle, ogDescription, ogImage, ogType,
          twitterCard, twitterTitle, twitterDescription, twitterImage,
          h1, h1Subtext, introParagraph, visualSectionsJson, status
        ]
      );

      // Get ID of the record
      const [idRows] = await conn.query(
        "SELECT id FROM homepage_seo WHERE pageIdentifier = 'home' LIMIT 1"
      ) as unknown as [{ id: number }[]];
      const seoId = idRows[0]?.id;

      if (!seoId) {
        throw new Error('Could not resolve homepage_seo ID');
      }

      // Synchronize sections
      await conn.query('DELETE FROM homepage_seo_sections WHERE homepageSeoId = ?', [seoId]);

      if (sanitizedSections.length > 0) {
        for (const sec of sanitizedSections) {
          await conn.query(
            `INSERT INTO homepage_seo_sections (
              homepageSeoId, heading, headingLevel, content, bulletPoints,
              internalLinks, image, imageAlt, videoUrl, orderIndex, isActive
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              seoId, sec.heading, sec.headingLevel, sec.content, sec.bulletPoints,
              sec.internalLinks, sec.image, sec.imageAlt, sec.videoUrl, sec.orderIndex, sec.isActive
            ]
          );
        }
      }

      await conn.commit();
    } catch (dbErr) {
      await conn.rollback();
      throw dbErr;
    } finally {
      conn.release();
    }

    // Revalidate paths for instant Next.js update
    try {
      revalidatePath('/');
      revalidatePath('/', 'layout');
      revalidatePath('/textiles');
    } catch (e) {
      console.warn('revalidatePath error on homepage-seo:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Homepage SEO settings saved successfully'
    });
  } catch (error: unknown) {
    console.error('Error saving homepage SEO:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to save homepage SEO settings', details: message },
      { status: 500 }
    );
  }
}
