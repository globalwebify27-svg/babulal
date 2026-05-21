"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, PlayCircle, Film } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  videoUrl?: string;
}

export default function ProductGallery({ images, productName, videoUrl }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Combine images and video into items list
  // Place video as the last item if it exists
  const items = videoUrl ? [...images.map(img => ({ type: 'image', url: img })), { type: 'video', url: videoUrl }] : images.map(img => ({ type: 'image', url: img }));

  const next = () => setActiveIndex((prev) => (prev + 1) % items.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + items.length) % items.length);

  if (items.length === 0) {
    return (
      <div className="aspect-[3/4] bg-surface-dim rounded-[2rem] flex items-center justify-center border-2 border-dashed border-primary/5">
        <span className="text-[10px] font-black uppercase tracking-widest opacity-20">Catalog Media Pending</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Main Display */}
      <div className="flex-1 relative aspect-square rounded-[2.5rem] overflow-hidden bg-white border border-gray-100 shadow-sm group cursor-crosshair">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="relative w-full h-full"
          >
            {items[activeIndex]?.type === 'video' ? (
               <div className="w-full h-full bg-black">
                 {(() => {
                    const url = items[activeIndex].url || '';
                    if (url.includes('instagram.com')) {
                      const cleanUrl = url.split('?')[0];
                      const embedUrl = cleanUrl.endsWith('/') ? `${cleanUrl}embed` : `${cleanUrl}/embed`;
                      return <iframe src={embedUrl} className="w-full h-full" frameBorder="0" scrolling="no" allowTransparency />;
                    } else {
                      const videoId = url.includes('v=') ? url.split('v=')[1]?.split('&')[0] : url.split('/').pop();
                      return <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=0`} className="w-full h-full" allowFullScreen allow="autoplay; encrypted-media" />;
                    }
                 })()}
               </div>
            ) : (
              <Image
                src={items[activeIndex]?.url || ''}
                alt={`${productName} - View ${activeIndex + 1}`}
                fill
                priority
                className="object-contain p-4 md:p-8"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Overlays */}
        {items.length > 1 && (
          <>
            <div className="absolute inset-y-0 left-0 w-24 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button onClick={prev} className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all">
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 w-24 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button onClick={next} className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </>
        )}

        {/* Removed Badge as per user request */}

        {/* Zoom Trigger */}
        <button className="absolute bottom-8 right-8 p-4 bg-white shadow-xl rounded-2xl text-primary hover:bg-primary hover:text-white transition-all transform hover:rotate-6">
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnails */}
      {items.length > 1 && (
        <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar py-2 md:w-20 lg:w-24 shrink-0">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative w-16 md:w-full aspect-square rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white shadow-sm",
                activeIndex === idx ? "border-accent scale-105 shadow-md" : "border-transparent opacity-40 hover:opacity-100"
              )}
            >
              {item.type === 'video' ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-primary/10">
                   <Film className="w-6 h-6 text-accent" />
                   <span className="text-[7px] font-black uppercase text-accent/60 tracking-widest">Video</span>
                </div>
              ) : (
                <Image
                  src={item.url || ''}
                  alt="Thumbnail"
                  fill
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
