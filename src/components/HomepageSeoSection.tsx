import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { HomepageSeoData } from '@/lib/homepage-seo-types';
import { cn } from '@/lib/utils';

interface HomepageSeoSectionProps {
  seoData: HomepageSeoData;
}

function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  if (url.includes('embed/')) return url;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
}

export default function HomepageSeoSection({ seoData }: HomepageSeoSectionProps) {
  if (!seoData) return null;

  const activeSections = (seoData.sections || []).filter(sec => sec.isActive);

  return (
    <section 
      aria-label="About Babulal Premkumar Textiles"
      className="relative py-16 md:py-24 bg-white border-t border-gray-100 overflow-hidden"
    >
      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24">
        
        {/* ══ MAIN H1 HERO BLOCK ══ */}
        <div className="max-w-4xl mx-auto text-center mb-14 md:mb-20">
          {seoData.h1Subtext && (
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#0A5181] text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-4">
              <span>{seoData.h1Subtext}</span>
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-[#0A5181] uppercase tracking-tight leading-[1.1] mb-6">
            {seoData.h1}
          </h1>

          <div className="w-20 h-1.5 bg-[#DA222A] mx-auto rounded-full mb-6" />

          {seoData.introParagraph && (
            <p className="text-gray-600 text-sm md:text-lg font-medium leading-relaxed max-w-3xl mx-auto">
              {seoData.introParagraph}
            </p>
          )}
        </div>

        {/* ══ CONTENT SECTIONS ══ */}
        {activeSections.length > 0 && (
          <div className="space-y-16 md:space-y-24 max-w-6xl mx-auto">
            {activeSections.map((sec, idx) => {
              const isEven = idx % 2 === 0;
              const hasMedia = Boolean(sec.image || sec.videoUrl);
              const embedUrl = sec.videoUrl ? getYouTubeEmbedUrl(sec.videoUrl) : '';

              return (
                <article 
                  key={sec.id || idx}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center bg-[#fafbfc] border border-gray-100 rounded-3xl p-6 sm:p-8 md:p-12 shadow-sm"
                >
                  {/* Text Column */}
                  <div className={hasMedia ? "lg:col-span-7 space-y-5" : "lg:col-span-12 space-y-5"}>
                    {/* Heading rendered according to level */}
                    {sec.headingLevel === 'H2' && (
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0A5181] uppercase tracking-tight leading-snug">
                        {sec.heading}
                      </h2>
                    )}
                    {sec.headingLevel === 'H3' && (
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#0A5181] uppercase tracking-tight leading-snug">
                        {sec.heading}
                      </h3>
                    )}
                    {sec.headingLevel === 'H4' && (
                      <h4 className="text-base sm:text-lg md:text-xl font-black text-[#0A5181] uppercase tracking-tight leading-snug">
                        {sec.heading}
                      </h4>
                    )}

                    {sec.content && (
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-normal whitespace-pre-line">
                        {sec.content}
                      </p>
                    )}

                    {/* Bullet Points */}
                    {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                      <ul className="space-y-2.5 pt-2">
                        {sec.bulletPoints.map((point, bpIdx) => (
                          <li key={bpIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-[#DA222A] shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Internal Links */}
                    {sec.internalLinks && sec.internalLinks.length > 0 && (
                      <div className="flex flex-wrap items-center gap-3 pt-3">
                        {sec.internalLinks.map((link, lIdx) => (
                          <Link
                            key={lIdx}
                            href={link.url}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-[#DA222A] hover:bg-[#DA222A] text-[#0A5181] hover:text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm group"
                          >
                            <span>{link.label}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Media Column (Image or Video) */}
                  {hasMedia && (
                    <div className={cn("lg:col-span-5", isEven ? "lg:order-last" : "lg:order-first")}>
                      {embedUrl ? (
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg bg-black border border-gray-200">
                          <iframe
                            src={embedUrl}
                            title={sec.heading || "Homepage SEO Video Showcase"}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                          />
                        </div>
                      ) : sec.image ? (
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-100">
                          <Image
                            src={sec.image}
                            alt={sec.imageAlt || sec.heading || "Babulal Premkumar Textiles"}
                            fill
                            sizes="(max-width: 1024px) 100vw, 40vw"
                            className="object-cover"
                            loading="lazy"
                          />
                        </div>
                      ) : null}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
