"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const portfolioItems = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1590080876471-cd94f21ee925?w=600&h=600&fit=crop",
    title: "Skull Flash",
    category: "Flash Design",
    height: "tall",
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=600&fit=crop",
    title: "Dragon Cover-Up",
    category: "Custom Work",
    height: "short",
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop",
    title: "Tribal Sleeve",
    category: "Custom Work",
    height: "tall",
  },
  {
    id: 4,
    imageUrl: "https://images.unsplash.com/photo-1506328628980-19d70fc9c6b1?w=600&h=600&fit=crop",
    title: "Portrait Piece",
    category: "Custom Work",
    height: "short",
  },
  {
    id: 5,
    imageUrl: "https://images.unsplash.com/photo-1517066491170-6e15d6ec6a2e?w=600&h=600&fit=crop",
    title: "Motorcycle Ink",
    category: "Flash Design",
    height: "short",
  },
  {
    id: 6,
    imageUrl: "https://images.unsplash.com/photo-1523521828519-f5e88f4a2e75?w=600&h=600&fit=crop",
    title: "Black & Grey Work",
    category: "Custom Work",
    height: "tall",
  },
  {
    id: 7,
    imageUrl: "https://images.unsplash.com/photo-1552520514-5fefe8c9ef14?w=600&h=600&fit=crop",
    title: "Lightning Bolt",
    category: "Flash Design",
    height: "short",
  },
  {
    id: 8,
    imageUrl: "https://images.unsplash.com/photo-1607003c4880-a9f5a4a0f1f1?w=600&h=600&fit=crop",
    title: "Fine Line Work",
    category: "Custom Work",
    height: "short",
  },
  {
    id: 9,
    imageUrl: "https://images.unsplash.com/photo-1588287537317-aeb37cf00f4d?w=600&h=600&fit=crop",
    title: "Full Back Piece",
    category: "Custom Work",
    height: "tall",
  },
];

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="py-28 px-6 bg-[#080808]"
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[#FF3C00] text-xs tracking-[0.4em] uppercase mb-4 font-heading font-bold">
            {t.portfolio.checkIt}
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-[#F0F0F0] tracking-widest">
            {t.portfolio.title}
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[#FF3C00] to-transparent mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {portfolioItems.map((item, index) => (
            <div
              key={item.id}
              className={`group relative overflow-hidden transition-all duration-700 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              } ${item.height === "tall" ? "lg:row-span-2" : ""}`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className={`relative bg-[#141414] border border-[#1e1e1e] border-l-4 border-l-[#FF3C00] ${item.height === "tall" ? "aspect-[3/4]" : "aspect-square"}`}>
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-all duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-[#FF3C00]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4">
                  <div className="text-center">
                    <p className="text-[#0A0A0A] text-xs tracking-[0.3em] uppercase font-heading font-bold">
                      {item.category}
                    </p>
                    <p className="text-[#0A0A0A] font-display text-2xl tracking-widest">
                      {item.title}
                    </p>
                  </div>
                  <button className="px-6 py-2 bg-[#0A0A0A] text-[#FF3C00] text-xs tracking-widest uppercase font-heading font-bold border-2 border-[#0A0A0A] hover:border-[#FF3C00] transition-colors">
                    {t.portfolio.view}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
