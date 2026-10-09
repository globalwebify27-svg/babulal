"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const HONDA_MODELS = [
  { name: 'Honda Activa 6G', category: 'Scooter', price: '₹76,234*', img: '/honda_activa.png' },
  { name: 'Honda Shine 125', category: 'Motorcycle', price: '₹79,800*', img: '/honda_activa.png' },
  { name: 'Honda SP125', category: 'Sporty', price: '₹86,017*', img: '/honda_activa.png' },
  { name: 'Honda Unicorn', category: 'Legendary', price: '₹1,09,800*', img: '/honda_activa.png' },
  { name: 'Honda Hornet 2.0', category: 'Street', price: '₹1,39,000*', img: '/honda_activa.png' },
];

export default function HondaProductGrid() {
  return (
    <section className="relative py-24 bg-gray-50/30 border-y border-gray-100">
      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-12">
          <div className="max-w-3xl">
            <h2 className="text-[#0A5181] text-5xl lg:text-7xl font-black tracking-tighter mb-6">Latest <span className="text-[#DA222A]">Arrivals.</span></h2>
            <p className="text-gray-400 text-lg md:text-xl font-medium italic leading-relaxed">Discover the peak of Japanese engineering and fuel efficiency.</p>
          </div>
          <button className="px-10 py-4 border-2 border-[#DA222A]/20 text-[#DA222A] text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-[#DA222A] hover:text-white transition-all">
            EXPLORE ALL MODELS
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
           {HONDA_MODELS.map((model, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border border-gray-100"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-8">
                  <Image src={model.img} alt={model.name} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute top-6 left-6 px-4 py-2 bg-[#DA222A] text-white text-[9px] font-black uppercase tracking-widest">
                    {model.category}
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-gray-900 text-2xl font-black tracking-tight mb-2">{model.name}</h4>
                    <p className="text-[#DA222A] text-xl font-black tabular-nums">{model.price}</p>
                  </div>
                  <button className="w-12 h-12 rounded-full bg-[#0A5181] text-white flex items-center justify-center hover:bg-[#DA222A] transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}
