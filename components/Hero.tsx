"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0A0A0A]">
      {/* Motorcycle/tattoo silhouette background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 600%22%3E%3Ctext x=%22200%22 y=%22300%22 font-size=%22400%22 font-weight=%22bold%22 opacity=%220.3%22 fill=%22%23FF3C00%22%3E%E2%9C%A6%3C/text%3E%3C/svg%3E')",
          backgroundSize: "500px 500px",
          backgroundPosition: "center",
        }}
      />

      {/* Red radial glow */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, #FF3C0030 0%, transparent 55%), radial-gradient(circle at 80% 20%, #FF3C0020 0%, transparent 45%)",
        }}
      />

      {/* Dark overlay gradient */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(255,60,0,0.1) 50%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.02] noise-texture" />

      <div
        className={`relative z-10 text-center px-6 transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p className="text-[#FF3C00] text-xs tracking-[0.4em] uppercase mb-6 font-heading font-semibold">
          {t.hero.artistRole}
        </p>

        <h1 className="font-display text-[clamp(3.5rem,15vw,10rem)] leading-none tracking-widest text-[#F0F0F0] mb-6">
          ROBERT&apos;S
          <br />
          <span className="text-[#FF3C00] drop-shadow-[0_0_20px_rgba(255,60,0,0.5)]">INK</span>
        </h1>

        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#FF3C00]" />
          <div className="w-2 h-2 rotate-45 bg-[#FF3C00]" />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#FF3C00]" />
        </div>

        <p className="text-[#C0A060] text-lg md:text-xl font-heading tracking-widest mb-12 max-w-2xl mx-auto uppercase font-semibold">
          {t.hero.tagline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => scrollTo("#booking")}
            className="px-8 py-4 bg-[#FF3C00] text-[#0A0A0A] text-sm tracking-widest uppercase font-heading font-bold border-2 border-[#FF3C00] hover:bg-transparent hover:text-[#FF3C00] transition-all duration-300 hover:shadow-[0_0_20px_#FF3C00]"
          >
            {t.hero.cta1}
          </button>
          <button
            onClick={() => scrollTo("#portfolio")}
            className="px-8 py-4 border-2 border-[#F0F0F0] text-[#F0F0F0] text-sm tracking-widest uppercase font-heading font-bold hover:border-[#FF3C00] hover:text-[#FF3C00] transition-all duration-300 hover:shadow-[0_0_20px_#FF3C00]"
          >
            {t.hero.cta2}
          </button>
        </div>
      </div>

      <button
        onClick={() => scrollTo("#about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-[#FF3C00] hover:text-[#C0A060] transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown size={32} strokeWidth={3} />
      </button>
    </section>
  );
}
