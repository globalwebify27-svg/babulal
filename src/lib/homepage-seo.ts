import pool, { initDb } from './db';
import { 
  HomepageSeoData, 
  HomepageSeoSection, 
  InternalLink, 
  DEFAULT_HOMEPAGE_SEO, 
  DEFAULT_VISUAL_SECTIONS,
  VisualSectionsData,
  parseJsonSafe 
} from './homepage-seo-types';

export * from './homepage-seo-types';

/**
 * Fetch Homepage SEO configuration with safety fallbacks
 */
export async function getHomepageSeoData(): Promise<HomepageSeoData> {
  try {
    await initDb();

    const [rows] = await pool.query(
      "SELECT * FROM homepage_seo WHERE pageIdentifier = 'home' LIMIT 1"
    ) as unknown as [Record<string, unknown>[]];

    if (!rows || rows.length === 0) {
      return DEFAULT_HOMEPAGE_SEO;
    }

    const row = rows[0];

    // Fetch active sections
    const [sectionRows] = await pool.query(
      "SELECT * FROM homepage_seo_sections WHERE homepageSeoId = ? AND isActive = TRUE ORDER BY orderIndex ASC, id ASC",
      [row.id]
    ) as unknown as [Record<string, unknown>[]];

    const sections: HomepageSeoSection[] = (sectionRows || []).map((sec: Record<string, unknown>) => ({
      id: sec.id as string | number,
      heading: String(sec.heading || ''),
      headingLevel: (sec.headingLevel === 'H3' || sec.headingLevel === 'H4') ? sec.headingLevel : 'H2',
      content: String(sec.content || ''),
      bulletPoints: parseJsonSafe<string[]>(sec.bulletPoints, []),
      internalLinks: parseJsonSafe<InternalLink[]>(sec.internalLinks, []),
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

    return {
      id: typeof row.id === 'number' ? row.id : undefined,
      pageIdentifier: 'home',
      metaTitle: String(row.metaTitle || '') || DEFAULT_HOMEPAGE_SEO.metaTitle,
      metaDescription: String(row.metaDescription || '') || DEFAULT_HOMEPAGE_SEO.metaDescription,
      metaKeywords: String(row.metaKeywords || '') || DEFAULT_HOMEPAGE_SEO.metaKeywords,
      canonicalUrl: String(row.canonicalUrl || '') || DEFAULT_HOMEPAGE_SEO.canonicalUrl,
      robotsIndex: row.robotsIndex === 'noindex' ? 'noindex' : 'index',
      robotsFollow: row.robotsFollow === 'nofollow' ? 'nofollow' : 'follow',
      ogTitle: String(row.ogTitle || row.metaTitle || '') || DEFAULT_HOMEPAGE_SEO.ogTitle,
      ogDescription: String(row.ogDescription || row.metaDescription || '') || DEFAULT_HOMEPAGE_SEO.ogDescription,
      ogImage: String(row.ogImage || '') || DEFAULT_HOMEPAGE_SEO.ogImage,
      ogType: String(row.ogType || '') || DEFAULT_HOMEPAGE_SEO.ogType,
      twitterCard: String(row.twitterCard || '') || DEFAULT_HOMEPAGE_SEO.twitterCard,
      twitterTitle: String(row.twitterTitle || row.metaTitle || '') || DEFAULT_HOMEPAGE_SEO.twitterTitle,
      twitterDescription: String(row.twitterDescription || row.metaDescription || '') || DEFAULT_HOMEPAGE_SEO.twitterDescription,
      twitterImage: String(row.twitterImage || row.ogImage || '') || DEFAULT_HOMEPAGE_SEO.twitterImage,
      h1: String(row.h1 || '') || DEFAULT_HOMEPAGE_SEO.h1,
      h1Subtext: String(row.h1Subtext || '') || DEFAULT_HOMEPAGE_SEO.h1Subtext,
      introParagraph: String(row.introParagraph || '') || DEFAULT_HOMEPAGE_SEO.introParagraph,
      status: String(row.status || 'Published'),
      sections: sections.length > 0 ? sections : DEFAULT_HOMEPAGE_SEO.sections,
      visualSections
    };
  } catch (error) {
    console.error('Error fetching homepage SEO data:', error);
    return DEFAULT_HOMEPAGE_SEO;
  }
}
