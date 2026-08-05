"use client";

import React from 'react';

export default function HondaLegacy() {
  const [content, setContent] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/admin/landing-content?vertical=HONDA');
        const data = await res.json();
        if (data._id) setContent(data);
      } catch (err) {
        console.error('Failed to fetch honda content:', err);
      }
    };
    fetchContent();
  }, []);

  return (
    <section className="relative py-28 md:py-32 bg-white overflow-hidden">
      <div className="absolute top-0 left-[15%] w-[1px] h-full bg-gradient-to-b from-transparent via-[#0A5181]/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-[15%] w-[1px] h-full bg-gradient-to-b from-transparent via-[#0A5181]/10 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="text-center mb-16 px-4">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="w-12 h-[1px] bg-[#0A5181]/20" />
            <span className="text-[#0A5181] text-[11px] font-black uppercase tracking-[.6em]">{content?.aboutSection?.title || "Two Decades of Partnership"}</span>
            <div className="w-12 h-[1px] bg-[#0A5181]/20" />
          </div>
          <h2 className="text-[#0A5181] text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] mb-10">
            {content?.heroTitle?.includes('Honda') ? content.heroTitle.split('Honda')[0] : "Ranchi's Trusted "} <br className="hidden sm:block" /><span className="text-[#DA222A]">{content?.heroTitle?.includes('Honda') ? 'Honda Powerhouse' : 'Honda Powerhouse.'}</span>
          </h2>
          <p className="text-gray-500 text-base md:text-xl lg:text-2xl font-medium max-w-4xl mx-auto italic leading-relaxed whitespace-pre-line">
            {content?.aboutSection?.content || "Premsons Honda, founded in 2012, is an authorised dealer of Honda Motorcycles and Scooters India (HMSI), with dealerships at Ranchi, Bokaro, Dhanbad & outlet at Chandwa in Jharkhand along with rural outlets across these districts."}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 bg-white shadow-2xl border border-gray-100 rounded-3xl overflow-hidden">
            {[
              { label: "ICICI Lombard Award", val: "2012-14", sub: "Significant Two-Wheeler Performance" },
              { label: "IFFCO Tokio Award", val: "2013-14", sub: "Outstanding Achievement Award" },
              { label: "HMSI Excellence", val: "2013-14", sub: "East Safe Riding Promotion Award" },
              { label: "Key Network", val: "4 Hubs", sub: "Ranchi, Bokaro, Dhanbad & Chandwa" }
            ].map((stat, i) => (
              <div key={i} className="px-10 py-16 border-r border-b lg:border-b-0 border-gray-100 last:border-r-0 flex flex-col items-center text-center group hover:bg-[#0A5181]/5 transition-colors">
                <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-4 group-hover:text-[#0A5181]">{stat.label}</span>
                <span className="text-[#DA222A] text-4xl lg:text-6xl font-black tracking-tighter mb-4">{stat.val}</span>
                <span className="text-[#0A5181] text-[10px] font-bold uppercase tracking-widest opacity-60">{stat.sub}</span>
              </div>
           ))}
        </div>
      </div>
    </section>
  );
}
