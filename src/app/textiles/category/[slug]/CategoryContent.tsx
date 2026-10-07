"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MessageCircle, 
  PhoneCall, 
  Download,
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  Clock,
  FileText,
  PlayCircle,
  Layers
} from 'lucide-react';
import TextileHeader from '@/components/TextileHeader';
import Footer from '@/components/Footer';
import StoreLocatorModal from '@/components/StoreLocatorModal';
import { Haptics } from '@/lib/haptics';
import { useSearchParams } from 'next/navigation';
import MobileBottomMenu from '@/components/MobileBottomMenu';
import CoverBreadcrumbs from '@/components/CoverBreadcrumbs';
import { isInventoryCatalogEnabled } from '@/lib/constants';
import { cn } from '@/lib/utils';
import RichContentRenderer from '@/components/RichContentRenderer';
import CategoryQuoteButton from '@/components/CategoryQuoteButton';
import { SITE_URL } from '@/lib/constants';

interface CategoryContentProps {
  initialCategory: any;
  subCategoriesPromise: Promise<any[]>;
  subSubCategoriesPromise: Promise<any[]>;
  productsPromise: Promise<any[]>;
  navCategoriesPromise: Promise<any[]>;
  seoDataPromise?: Promise<{ seoContent: any; seoSections: any[]; relatedCategories: any[] }>;
  slug: string;
  initialSubSlug?: string;
}

function getYouTubeEmbedUrl(url: string) {
  if (!url) return '';
  if (url.includes('embed/')) return url;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
}

export default function CategoryContent({ 
  initialCategory, 
  subCategoriesPromise, 
  subSubCategoriesPromise,
  productsPromise, 
  navCategoriesPromise,
  seoDataPromise,
  slug,
  initialSubSlug
}: CategoryContentProps) {
  const [isStoreModalOpen, setIsStoreModalOpen] = React.useState(false);
  const allCategories = React.use(navCategoriesPromise) as any[];

  return (
    <div className="bg-white min-h-screen text-[#0A5181] pb-20 md:pb-0">
      <TextileHeader categories={allCategories.filter((c: any) => c.showInHeader)} />
      
      <StoreLocatorModal 
        isOpen={isStoreModalOpen} 
        onClose={() => setIsStoreModalOpen(false)} 
        vertical="textile"
      />

      <main className="pt-[100px]">
        <React.Suspense fallback={<ProductSectionSkeleton initialCategory={initialCategory} />}>
           <AsyncProductSection 
             subCategoriesPromise={subCategoriesPromise}
             subSubCategoriesPromise={subSubCategoriesPromise}
             productsPromise={productsPromise}
             seoDataPromise={seoDataPromise}
             initialCategory={initialCategory}
             slug={slug}
             initialSubSlug={initialSubSlug}
             setIsStoreModalOpen={setIsStoreModalOpen}
             allCategories={allCategories}
           />
        </React.Suspense>
      </main>

      <Footer />
      <MobileBottomMenu categories={allCategories} />
    </div>
  );
}

function AsyncProductSection({ subCategoriesPromise, subSubCategoriesPromise, productsPromise, seoDataPromise, initialCategory, slug, initialSubSlug, setIsStoreModalOpen, allCategories }: any) {
  // Wait for the data to stream in
  const dbSubCategories = subCategoriesPromise ? (React.use(subCategoriesPromise) as any[]) : [];
  const dbSubSubCategories = subSubCategoriesPromise ? (React.use(subSubCategoriesPromise) as any[]) : [];
  const dbProducts = productsPromise ? (React.use(productsPromise) as any[]) : [];
  const { seoContent, seoSections = [], relatedCategories = [] } = seoDataPromise ? (React.use(seoDataPromise) as any) : { seoContent: null, seoSections: [], relatedCategories: [] };

  const searchParams = useSearchParams();
  const subParam = searchParams ? searchParams.get('sub') : null;
  const [selectedSubs, setSelectedSubs] = React.useState<string[]>([]);
  const [selectedSubSubs, setSelectedSubSubs] = React.useState<string[]>([]);

  // Dynamic Sub-category Extraction (Fallback if subcategories collection is empty)
  const productsInCategory = React.useMemo(() => {
    return dbProducts.filter((p: any) => {
      const normalize = (s: string) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, '').trim();
      const pCat = normalize(p.category);
      if (!pCat) return false;

      const cName = normalize(initialCategory?.name);
      const cSlug = normalize(initialCategory?.slug);

      const stem = (str: string) => str.replace(/s$/, '');
      const pStem = stem(pCat);
      const cNameStem = stem(cName);
      const cSlugStem = stem(cSlug);

      return pCat === cName || pCat === cSlug || 
             pStem === cNameStem || pStem === cSlugStem ||
             (cNameStem.length > 3 && pStem.includes(cNameStem)) || 
             (cSlugStem.length > 3 && pStem.includes(cSlugStem)) ||
             (pStem.length > 3 && cNameStem.includes(pStem)) ||
             (pStem.length > 3 && cSlugStem.includes(pStem));
    });
  }, [dbProducts, initialCategory]);

  const derivedSubTypes = React.useMemo(() => {
    return Array.from(new Set(
      productsInCategory.map((p: any) => p.subCategory).filter(Boolean)
    )).map(name => ({ name, _id: name, slug: String(name).toLowerCase().replace(/\s+/g, '-') }));
  }, [productsInCategory]);

  const displaySubCategories = React.useMemo(() => {
    const activeDbSubs = dbSubCategories.filter((sub: any) => sub.status !== 'Inactive');
    return activeDbSubs.length > 0 ? activeDbSubs : derivedSubTypes;
  }, [dbSubCategories, derivedSubTypes]);

  const activeSubObject = React.useMemo(() => {
    if (selectedSubs.length === 1) {
      const subName = selectedSubs[0];
      const norm = (s: string) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();
      return displaySubCategories.find((s: any) => norm(s.name) === norm(subName)) || null;
    }
    return null;
  }, [selectedSubs, displaySubCategories]);

  // Dynamic Top Category Heading (Matching Reference Image 1)
  const dynamicTopHeading = React.useMemo(() => {
    if (selectedSubs.length === 1) {
      const subName = selectedSubs[0].toUpperCase();
      return `TOP ${subName} IN RANCHI`;
    } else if (selectedSubs.length > 1) {
      return `TOP ${selectedSubs.map(s => s.toUpperCase()).join(' & ')} IN RANCHI`;
    }
    const catName = (initialCategory?.name || slug).toUpperCase();
    return `TOP ${catName} IN RANCHI`;
  }, [selectedSubs, initialCategory, slug]);

  // Dynamic Hero Header Title & Description calculation based on active subcategory selection and published SEO Content
  const currentHeroTitle = React.useMemo(() => {
    if (seoContent?.h1) {
      return seoContent.h1;
    }
    if (selectedSubs.length === 1) {
      const subName = selectedSubs[0];
      const upper = subName.toUpperCase();
      if (upper.includes('COLLECTION')) {
        return upper;
      }
      return `${upper} COLLECTION`;
    } else if (selectedSubs.length > 1) {
      return `${selectedSubs.map(s => s.toUpperCase()).join(' & ')} COLLECTION`;
    }
    return `${initialCategory?.name?.toUpperCase() || 'CATEGORY'} COLLECTION`;
  }, [seoContent, selectedSubs, initialCategory]);

  const currentHeroDescription = React.useMemo(() => {
    if (seoContent?.introContent) {
      return seoContent.introContent;
    }
    if (activeSubObject?.description) {
      return activeSubObject.description;
    }
    if (selectedSubs.length === 1) {
      return `Discover our exclusive ${selectedSubs[0]} collection. Crafted with century-old weaving traditions and modern elegance for every occasion.`;
    }
    return initialCategory?.description || "Discover a century of weaving excellence. From traditional handloom masterpieces to contemporary silk drapes, our collection defines the pinnacle of Indian ethnic elegance.";
  }, [seoContent, activeSubObject, selectedSubs, initialCategory]);

  const heroCoverImage = seoContent?.bannerImage || initialCategory?.image || "/bridal_luxury.png";

  React.useEffect(() => {
    const activeParam = subParam || initialSubSlug;
    if (activeParam) {
      const norm = (s: string) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();
      const slugs = activeParam.split(',').map((s: string) => norm(s));
      const matchedNames: string[] = [];
      
      slugs.forEach((targetParam: string) => {
        const matchedSub = displaySubCategories.find(
          (s: any) => norm(s.slug) === targetParam || norm(s.name) === targetParam
        );
        if (matchedSub) {
          matchedNames.push(matchedSub.name);
        }
      });

      if (matchedNames.length > 0) {
        setSelectedSubs(prev => {
          if (matchedNames.sort().join(',') !== [...prev].sort().join(',')) {
            return matchedNames;
          }
          return prev;
        });
      } else {
        setSelectedSubs(prev => prev.length !== 0 ? [] : prev);
      }
    } else {
      setSelectedSubs(prev => prev.length !== 0 ? [] : prev);
    }
  }, [subParam, initialSubSlug, displaySubCategories]);

  const handleSubToggle = (subName: string, subId: string) => {
    Haptics.light();

    const exists = selectedSubs.includes(subName);
    let nextSubs: string[];

    if (exists) {
      nextSubs = selectedSubs.filter(s => s !== subName);
      const subSubsForThisSub = dbSubSubCategories.filter((ss: any) => ss.subCategoryId === subId);
      const subSubNames = subSubsForThisSub.map((ss: any) => ss.name);
      setSelectedSubSubs(prevSubSubs => prevSubSubs.filter(name => !subSubNames.includes(name)));
    } else {
      nextSubs = [...selectedSubs, subName];
    }

    setSelectedSubs(nextSubs);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (nextSubs.length > 0) {
        const slugs = nextSubs.map(n => {
          const norm = (s: string) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();
          const subObj = displaySubCategories.find((s: any) => norm(s.name) === norm(n));
          return subObj?.slug || n.toLowerCase().replace(/\s+/g, '-');
        });
        url.searchParams.set('sub', slugs.join(','));
      } else {
        url.searchParams.delete('sub');
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleSubSubToggle = (subSubName: string) => {
    Haptics.light();
    setSelectedSubSubs(prev => 
      prev.includes(subSubName)
        ? prev.filter(ss => ss !== subSubName)
        : [...prev, subSubName]
    );
  };

  const handleReset = () => {
    Haptics.medium();
    setSelectedSubs([]);
    setSelectedSubSubs([]);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('sub');
      window.history.replaceState({}, '', url.toString());
    }
  };
  
  const finalProducts = productsInCategory.filter((p: any) => {
    const normalize = (s: string) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    if (selectedSubs.length === 0) return true;
    
    const pSub = normalize(p.subCategory);
    const matchesSub = selectedSubs.some(s => normalize(s) === pSub);
    if (!matchesSub) return false;
    
    const selectedParentSub = displaySubCategories.find(s => normalize(s.name) === pSub);
    if (selectedParentSub) {
      const subSubsForThisSub = dbSubSubCategories.filter((ss: any) => ss.subCategoryId === selectedParentSub._id);
      const activeSubSubsForThisSub = subSubsForThisSub.filter((ss: any) => selectedSubSubs.includes(ss.name));
      
      if (activeSubSubsForThisSub.length > 0) {
        const pSubSub = normalize(p.subSubCategory);
        return activeSubSubsForThisSub.some(ss => normalize(ss.name) === pSubSub);
      }
    }
    
    return true;
  });

  const breadcrumbItems = React.useMemo(() => {
    const items: { label: string; url?: string }[] = [
      { label: 'Home', url: '/' },
      { label: 'Textiles', url: '/textiles' },
      { label: initialCategory?.name || slug, url: `/textiles/category/${slug}` }
    ];

    if (selectedSubs.length === 1) {
      items.push({ label: selectedSubs[0] });
      if (selectedSubSubs.length === 1) {
        items.push({ label: selectedSubSubs[0] });
      } else if (selectedSubSubs.length > 1) {
        items.push({ label: selectedSubSubs.join(', ') });
      }
    } else if (selectedSubs.length > 1) {
      items.push({ label: selectedSubs.join(', ') });
    }

    return items;
  }, [initialCategory, slug, selectedSubs, selectedSubSubs]);

  const showInventoryCatalog = isInventoryCatalogEnabled(slug);

  const computedRelatedCategories = React.useMemo(() => {
    if (relatedCategories && relatedCategories.length > 0) {
      return relatedCategories.map((cat: any) => ({
        _id: cat._id || cat.id?.toString() || cat.slug,
        name: cat.name,
        slug: cat.slug ? (cat.slug.startsWith('/') ? cat.slug : `/${cat.slug}`) : `/textiles/category/${cat.slug}`,
        image: cat.cardImage || cat.image || cat.seoBannerImage || initialCategory?.cardImage || initialCategory?.image || "/bridal_luxury.png"
      }));
    }

    const currentNorm = (s: string) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    const activeSubsNorm = selectedSubs.map(currentNorm);
    const parentSlug = initialCategory?.slug || slug;

    if (displaySubCategories && displaySubCategories.length > 0) {
      return displaySubCategories
        .filter((sub: any) => {
          const sNorm = currentNorm(sub.name);
          const slNorm = currentNorm(sub.slug);
          const activeCatNorm = currentNorm(slug);
          return !activeSubsNorm.includes(sNorm) && slNorm !== activeCatNorm;
        })
        .map((sub: any) => ({
          _id: sub._id || sub.id?.toString() || sub.slug,
          name: sub.name,
          slug: `/${parentSlug}/${sub.slug || sub.name.toLowerCase().replace(/\s+/g, '-')}`,
          image: sub.cardImage || sub.image || sub.seoBannerImage || initialCategory?.cardImage || initialCategory?.image || "/bridal_luxury.png"
        }));
    }

    if (allCategories && allCategories.length > 0) {
      return allCategories
        .filter((c: any) => currentNorm(c.slug) !== currentNorm(slug))
        .slice(0, 6)
        .map((c: any) => ({
          _id: c._id || c.id?.toString() || c.slug,
          name: c.name,
          slug: `/textiles/category/${c.slug}`,
          image: c.cardImage || c.image || c.seoBannerImage || "/bridal_luxury.png"
        }));
    }

    return [];
  }, [relatedCategories, displaySubCategories, allCategories, selectedSubs, initialCategory, slug]);

  const dynamicSubCategoryItems = React.useMemo(() => {
    if (!displaySubCategories || displaySubCategories.length === 0) return [];
    const parentSlug = initialCategory?.slug || slug;
    const normalize = (s: string) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    const activeSubStems = selectedSubs.map(normalize);

    return displaySubCategories
      .filter((sub: any) => {
        if (activeSubStems.length === 0) return true;
        const subNameNorm = normalize(sub.name);
        const subSlugNorm = normalize(sub.slug);
        return !activeSubStems.includes(subNameNorm) && !activeSubStems.includes(subSlugNorm);
      })
      .map((sub: any) => {
        const subSlug = sub.slug || sub.name.toLowerCase().replace(/\s+/g, '-');
        return {
          _id: sub._id || sub.id?.toString() || subSlug,
          name: sub.name,
          slug: `/${parentSlug}/${subSlug}`,
          image: sub.cardImage || sub.image || sub.seoBannerImage || initialCategory?.cardImage || initialCategory?.image || "/bridal_luxury.png"
        };
      });
  }, [displaySubCategories, selectedSubs, initialCategory, slug]);

  const youtubeEmbedLink = seoContent?.youtubeUrl ? getYouTubeEmbedUrl(seoContent.youtubeUrl) : '';

  return (
    <>
      {/* ═══ REFINED CATEGORY HEADER (SS-Matched & Dynamic SEO Banner) ═══ */}
      <section className="relative w-full h-[320px] lg:h-[420px] overflow-hidden bg-[#0A5181]">
         <Image 
           src={heroCoverImage} 
           alt={seoContent?.bannerAlt || initialCategory?.name || "Category Header"} 
           fill 
           className="object-cover opacity-70"
           priority
         />
         <div className="absolute inset-0 bg-black/30" />
         
         <div className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col justify-center">
            <CoverBreadcrumbs items={breadcrumbItems} className="mb-4" />
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white italic uppercase tracking-tighter leading-[1] mb-6">
               {currentHeroTitle}
            </h1>
            
            <p className="max-w-3xl text-sm lg:text-base text-white/90 font-medium italic leading-relaxed">
               {currentHeroDescription}
            </p>
         </div>
      </section>

      {/* ══ INVENTORY CATALOG SECTION (CONDITIONALLY RENDERED) ══ */}
      {showInventoryCatalog && (
        <>
          {/* ══ FEATURED PIECES SECTION DIVIDER ══ */}
      <section className="bg-white py-12 lg:py-16">
         <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-10">
               <div>
                  <div className="w-16 h-1 bg-[#DA222A] mb-4" />
                  <div className="text-[10px] font-black uppercase text-[#DA222A] tracking-[0.2em] mb-2">Inventory Catalog</div>
                  <h2 className="text-3xl lg:text-4xl font-black text-[#0A5181] uppercase tracking-tighter italic">
                     {selectedSubs.length > 0 ? `${selectedSubs.join(', ')} Pieces` : 'Featured Pieces'}
                  </h2>
               </div>
               <div className="text-right">
                  <div className="text-[10px] font-black uppercase text-accent tracking-widest">In-Store Procurement Only</div>
                  <div className="text-[9px] font-bold uppercase text-gray-300 tracking-[0.3em] mt-1">Visit Ranchi H.Q. • Retail Hub • Lowest Price 365 Days</div>
               </div>
            </div>
         </div>
      </section>

      {/* ══ CATALOG GRID WITH SIDEBAR ══ */}
      <section className="bg-white pb-24">
         <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row gap-12">
               <aside className="lg:w-64 shrink-0">
          <div className="sticky top-40 space-y-12">
             <div>
                <h3 className="text-xs font-black uppercase text-[#0A5181] border-b-2 border-gray-100 pb-2 mb-6 tracking-tight">Product Sub-Type</h3>
                <ul className="space-y-4">
                   <li>
                      <button 
                        onClick={handleReset}
                        className={`text-[11px] font-black flex items-center gap-2 uppercase tracking-tight transition-colors ${selectedSubs.length === 0 ? 'text-[#DA222A]' : 'text-gray-400 hover:text-[#0A5181]'}`}
                      >
                         <CheckCircle className={`w-4 h-4 ${selectedSubs.length === 0 ? 'opacity-100' : 'opacity-20'}`} /> ALL {initialCategory?.name}
                      </button>
                   </li>
                   {displaySubCategories.map((sub: any) => {
                      const isActive = selectedSubs.some(s => s.toLowerCase().trim() === sub.name.toLowerCase().trim());
                      const subSubsForThisSub = dbSubSubCategories.filter((ss: any) => ss.subCategoryId === sub._id && ss.status !== 'Inactive');
                      
                      return (
                        <li key={sub._id} className="space-y-2">
                           <label className="flex items-center gap-3 cursor-pointer group">
                              <div className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center transition-all ${isActive ? 'bg-[#DA222A] border-[#DA222A]' : 'border-gray-200 group-hover:border-[#DA222A]'}`}>
                                 {isActive && (
                                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3 text-white">
                                      <polyline points="20 6 9 17 4 12" />
                                   </svg>
                                 )}
                              </div>
                              <input 
                                type="checkbox" 
                                className="hidden"
                                checked={isActive}
                                onChange={() => handleSubToggle(sub.name, sub._id)}
                              />
                              <span className={`text-[11px] font-bold uppercase transition-colors tracking-tight ${isActive ? 'text-[#DA222A]' : 'text-gray-400 group-hover:text-[#0A5181]'}`}>
                                 {sub.name}
                              </span>
                           </label>
                           
                           {/* Nested Sub-Sub-Categories */}
                           {isActive && subSubsForThisSub.length > 0 && (
                             <ul className="pl-6 pt-1 space-y-2 border-l border-gray-100 ml-2 animate-in fade-in slide-in-from-top-1">
                               {subSubsForThisSub.map((subSub: any) => {
                                 const isSubSubActive = selectedSubSubs.includes(subSub.name);
                                 return (
                                   <li key={subSub._id}>
                                     <label className="flex items-center gap-2 cursor-pointer group/subsub">
                                       <div className={`w-3.5 h-3.5 border rounded-sm flex items-center justify-center transition-all ${isSubSubActive ? 'bg-[#0A5181] border-[#0A5181]' : 'border-gray-200 group-hover/subsub:border-[#0A5181]'}`}>
                                         {isSubSubActive && (
                                           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-2.5 h-2.5 text-white">
                                             <polyline points="20 6 9 17 4 12" />
                                           </svg>
                                         )}
                                       </div>
                                       <input 
                                         type="checkbox" 
                                         className="hidden"
                                         checked={isSubSubActive}
                                         onChange={() => handleSubSubToggle(subSub.name)}
                                       />
                                       <span className={`text-[10px] font-semibold uppercase tracking-tight transition-colors ${isSubSubActive ? 'text-[#0A5181]' : 'text-gray-400 group-hover/subsub:text-[#0A5181]'}`}>
                                         {subSub.name}
                                       </span>
                                     </label>
                                   </li>
                                 );
                               })}
                             </ul>
                           )}
                        </li>
                      );
                   })}
                </ul>
             </div>

             <div className="p-6 bg-[#fbfbfb] border border-gray-100 rounded">
                <h4 className="text-[10px] font-black uppercase text-[#0A5181] tracking-widest mb-3">Priority Assistance</h4>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed mb-6 uppercase">Direct procurement desk for retail partners.</p>
                <button 
                  onClick={() => {
                    Haptics.medium();
                    setIsStoreModalOpen(true);
                  }}
                  className="w-full bg-[#0A5181] text-white py-4 rounded text-[10px] font-black uppercase tracking-widest hover:bg-[#DA222A] transition-colors"
                >
                   Enquire Now
                </button>
             </div>
          </div>
       </aside>

       <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
             {finalProducts.length > 0 ? (
               finalProducts.map((item: any) => (
                  <div key={item._id} className="group relative flex flex-col bg-white border border-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                     {/* Image Showcase */}
                     <div className="relative aspect-[3/4] overflow-hidden bg-primary/5">
                        {item.images?.[0] ? (
                           <Image
                             src={item.images[0]}
                             alt={item.name}
                             fill
                             sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                             className="object-cover group-hover:scale-105 transition-transform duration-1000"
                           />
                        ) : (
                           <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-[10px] font-black uppercase tracking-widest text-primary/20">
                             No Media
                           </div>
                        )}

                        {item.isFeatured && (
                           <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-accent text-white text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl shadow-lg">
                             Exclusive Design
                           </div>
                        )}
                     </div>

                     {/* Details Section */}
                     <div className="p-3 sm:p-5 md:p-6 flex flex-col flex-1 justify-between min-h-[140px] sm:min-h-[180px]">
                        <div>
                           <div className="flex justify-between items-start gap-2 mb-1 sm:mb-2">
                             <span className="text-[#DA222A] text-[8px] font-black uppercase tracking-widest">
                               {item.category}
                             </span>
                             <div className="flex gap-1.5 items-center">
                               {item.subCategory && (
                                 <span className="text-[#0A5181]/40 text-[8px] font-bold uppercase tracking-widest hidden sm:inline">
                                   {item.subCategory}
                                 </span>
                               )}
                               {item.subSubCategory && (
                                 <>
                                   <span className="text-[#0A5181]/20 text-[8px] font-bold hidden sm:inline">•</span>
                                   <span className="text-[#0A5181]/60 text-[8px] font-bold uppercase tracking-widest hidden sm:inline">
                                     {item.subSubCategory}
                                   </span>
                                 </>
                               )}
                             </div>
                           </div>
                           <h3 className="text-[#0A5181] text-xs sm:text-base font-black uppercase tracking-tight italic line-clamp-2 mb-2 sm:mb-4 group-hover:text-accent transition-colors">
                             {item.name}
                           </h3>

                           {/* Technical Specifications Table */}
                           {item.attributes && Object.keys(item.attributes).length > 0 && (
                             <table className="w-full text-[8px] sm:text-[10px] border-t border-primary/5 pt-1.5 sm:pt-2">
                               <tbody>
                                 {Object.entries(item.attributes).slice(0, 3).map(([key, val]) => (
                                   <tr key={key} className="border-b border-gray-50 last:border-none">
                                     <td className="py-1 sm:py-1.5 font-bold uppercase text-[#0A5181]/40 tracking-wider">{key}</td>
                                     <td className="py-1 sm:py-1.5 text-right font-black text-[#0A5181] uppercase truncate max-w-[80px] sm:max-w-[120px]">{String(val)}</td>
                                   </tr>
                                 ))}
                               </tbody>
                             </table>
                           )}
                        </div>

                        {/* Actions Grid */}
                        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-primary/5">
                           <Link
                             href={`/textiles/product/${item.slug}`}
                             onClick={() => Haptics.medium()}
                             className="w-full py-2.5 sm:py-3.5 bg-[#DA222A] text-white text-[9px] sm:text-[11px] font-black uppercase tracking-[0.1em] sm:tracking-[0.16em] flex items-center justify-center gap-2 hover:bg-[#0A5181] transition-all rounded-xl shadow-lg shadow-[#DA222A]/10 active:scale-[0.98] whitespace-nowrap"
                           >
                             <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> View Details
                           </Link>
                        </div>
                     </div>
                  </div>
               ))
             ) : (
               <div className="col-span-full w-full py-24 mb-12 flex flex-col items-center justify-center bg-[#fbfbfb] border border-gray-100">
                  <Clock className="w-8 h-8 text-gray-300 mb-6" />
                  <h3 className="text-xl font-black text-[#0A5181] uppercase tracking-tighter italic mb-3">Collection Incoming</h3>
                  <p className="text-xs uppercase tracking-widest font-bold text-gray-400 text-center max-w-md">Our procurement team is currently curating premium institutional pieces for this vertical. Check back shortly.</p>
               </div>
             )}
           </div>
        </div>
     </div>
  </div>
 </section>
        </>
      )}

      {/* ══ DYNAMIC TOP CATEGORY HEADING & SEO CONTENT (TOP DASH IN RANCHI) ══ */}
      <section className={`bg-white ${showInventoryCatalog ? 'pb-24' : 'pt-10 md:pt-14 pb-16 lg:pb-24'}`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          {/* DYNAMIC YOUTUBE EMBED SECTION ══ */}
          {youtubeEmbedLink && (
            <div className={cn("p-8 bg-[#fbfbfb] border border-gray-100 rounded-3xl space-y-6", showInventoryCatalog ? "mt-16" : "mb-12")}>
              <div className="flex items-center gap-3">
                <PlayCircle className="w-6 h-6 text-[#DA222A]" />
                <h3 className="text-xl font-black text-[#0A5181] uppercase tracking-tighter italic">
                  Experience {initialCategory?.name || 'Category'} Collection Video
                </h3>
              </div>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-black">
                <iframe
                  src={youtubeEmbedLink}
                  title="Category Showcase Video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* ══ DYNAMIC TOP CATEGORY HEADING & SEO CONTENT (REFERENCE IMAGE MATCH) ══ */}
          <div className={cn("text-center", showInventoryCatalog ? "mt-16 lg:mt-20 pt-10 lg:pt-12 border-t border-gray-100" : "mt-0 pt-0 border-t-0")}>
             <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#0A5181] uppercase tracking-wider inline-block relative mb-10 lg:mb-12">
               {dynamicTopHeading}
               <div className="w-16 h-1 bg-[#DA222A] mx-auto mt-2.5 rounded-full" />
             </h2>

             <div className="max-w-6xl mx-auto space-y-8 text-left">
                {seoContent?.htmlContent ? (
                  <RichContentRenderer html={seoContent.htmlContent} />
                ) : seoSections.length > 0 ? (
                  seoSections.map((sec: any) => (
                    <div key={sec.id} className="space-y-4">
                      {sec.headingLevel === 'H2' && (
                        <h2 className="text-2xl lg:text-3xl font-black text-[#0A5181] uppercase tracking-tighter italic">
                          {sec.heading}
                        </h2>
                      )}
                      {sec.headingLevel === 'H3' && (
                        <h3 className="text-xl lg:text-2xl font-black text-[#0A5181] uppercase tracking-tighter italic">
                          {sec.heading}
                        </h3>
                      )}
                      {sec.headingLevel === 'H4' && (
                        <h4 className="text-lg font-black text-[#0A5181] uppercase tracking-tighter italic">
                          {sec.heading}
                        </h4>
                      )}

                      {sec.content && (
                        <div className="text-sm lg:text-base text-gray-600 font-medium leading-[1.8] space-y-4">
                          {sec.content.split('\n\n').map((para: string, pIdx: number) => (
                            <p key={pIdx}>{para}</p>
                          ))}
                        </div>
                      )}

                      {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                        <ul className="space-y-2 pl-2">
                          {sec.bulletPoints.map((bp: string, bpIdx: number) => (
                            <li key={bpIdx} className="flex items-start gap-3 text-sm font-semibold text-gray-700">
                              <span className="text-[#DA222A] font-black">►</span>
                              <span>{bp}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {sec.image && (
                        <div className="my-6 relative w-full h-64 lg:h-80 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                          <Image
                            src={sec.image}
                            alt={sec.imageAlt || sec.heading || "Section Image"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {sec.videoUrl && (
                        <div className="my-6 relative w-full aspect-video rounded-2xl overflow-hidden shadow-md bg-black">
                          <iframe
                            src={getYouTubeEmbedUrl(sec.videoUrl)}
                            title={sec.heading || "Section Video"}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="space-y-6">
                    <h2 className="text-2xl lg:text-3xl font-black text-[#0A5181] uppercase tracking-tighter italic">
                      Premier Retail Destination for {initialCategory?.name} in Ranchi
                    </h2>
                    <div className="text-sm lg:text-base text-gray-500 font-medium leading-[1.8] space-y-6 italic">
                       <p>
                          Babulal Premkumar stands as a pillar of excellence in the Indian textile landscape. For over four decades, our group has anchored the textile supply chain across Jharkhand, connecting century-old weaving traditions with modern retail infrastructures. 
                       </p>
                    </div>
                  </div>
                )}

                {/* ══ DYNAMIC RELATED SUBCATEGORIES GRID (CARD VIEW) ══ */}
                {dynamicSubCategoryItems.length > 0 && (
                  <div className="mt-16 pt-12 border-t border-gray-100">
                    <div className="flex items-center gap-3 mb-8">
                      <Layers className="w-5 h-5 text-[#DA222A]" />
                      <h3 className="text-xl lg:text-2xl font-black text-[#0A5181] uppercase tracking-tighter italic">
                        Related {initialCategory?.name || 'Category'} Collections
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {dynamicSubCategoryItems.map((item: any) => (
                        <Link 
                          key={item._id} 
                          href={item.slug}
                          className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
                        >
                          {/* Top Cover Image */}
                          <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          {/* Bottom Content Area */}
                          <div className="p-4 flex flex-col justify-between flex-1 bg-white gap-3">
                            <div>
                              <h4 className="text-xs sm:text-sm font-black uppercase text-[#0A5181] tracking-tight group-hover:text-[#DA222A] transition-colors">
                                {item.name}
                              </h4>
                              <span className="text-[9px] sm:text-[10px] font-bold uppercase text-gray-400 tracking-wider mt-1 block">
                                {initialCategory?.name || 'Textiles'} Collection
                              </span>
                            </div>
                            <div className="pt-2 border-t border-gray-100/80 flex items-center justify-between">
                              <CategoryQuoteButton
                                categoryName={item.name}
                                parentCategory={initialCategory?.name || 'Textiles'}
                                categoryUrl={`${SITE_URL}${item.slug.startsWith('/') ? item.slug : `/${item.slug}`}`}
                                className="w-full"
                              />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ProductSectionSkeleton({ initialCategory }: { initialCategory?: any }) {
  return (
    <>
      <section className="relative w-full h-[300px] lg:h-[400px] overflow-hidden bg-[#0A5181] animate-pulse">
        <div className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col justify-center">
          <div className="h-4 w-32 bg-white/20 rounded mb-4" />
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white/40 italic uppercase tracking-tighter leading-[1] mb-6">
            {initialCategory?.name ? `${initialCategory.name} COLLECTION` : 'LOADING COLLECTION...'}
          </h1>
          <div className="h-4 w-2/3 bg-white/20 rounded" />
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-10">
            <div>
              <div className="w-16 h-1 bg-[#DA222A] mb-4" />
              <div className="text-[10px] font-black uppercase text-[#DA222A] tracking-[0.2em] mb-2">Inventory Catalog</div>
              <h2 className="text-3xl lg:text-4xl font-black text-[#0A5181] uppercase tracking-tighter italic">Featured Pieces</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-12 w-full animate-pulse">
             <aside className="lg:w-64 shrink-0 hidden lg:block space-y-4 pt-12">
                <div className="h-4 w-full bg-gray-100 rounded mb-8" />
                {[1,2,3,4,5].map(i => <div key={i} className="h-3 w-3/4 bg-gray-100 rounded" />)}
             </aside>
             <div className="flex-1 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="group border border-gray-50 flex flex-col">
                    <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden" />
                    <div className="p-5 flex flex-col gap-3">
                       <div className="h-3 w-full bg-gray-100 rounded" />
                       <div className="h-3 w-2/3 bg-gray-100 rounded" />
                       <div className="h-8 w-full bg-gray-50 mt-4 rounded" />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>
    </>
  );
}
