"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: "15+", label: "Years Tattooing" },
  { value: "3K+", label: "Tattoos Completed" },
  { value: "100%", label: "Clients Love It" },
];

const badges = [
  { emoji: "🏍️", label: "Motorcycles" },
  { emoji: "🎸", label: "Rock Music" },
  { emoji: "🚗", label: "Cars" },
  { emoji: "🖊️", label: "Custom Work" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-28 px-6 bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[#FF3C00] text-xs tracking-[0.4em] uppercase mb-4 font-heading font-bold">
            Know the Artist
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-[#F0F0F0] tracking-widest">
            ABOUT ROBERT
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[#FF3C00] to-transparent mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Photo placeholder */}
          <div
            className={`transition-all duration-700 delay-200 ${
              visible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            <div className="relative">
              <div className="aspect-[3/4] bg-gradient-to-br from-[#1A1A1A] via-[#141414] to-[#0A0A0A] border-2 border-[#1e1e1e] border-l-4 border-l-[#FF3C00] flex items-center justify-center">
                <div className="text-center opacity-30">
                  <div className="w-24 h-24 rounded-full border-2 border-[#FF3C00] mx-auto mb-4 flex items-center justify-center">
                    <span className="font-display text-3xl text-[#FF3C00]">
                      R
                    </span>
                  </div>
                  <p className="text-[#9CA3AF] text-xs tracking-widest uppercase">
                    Artist Photo
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border-r-2 border-b-2 border-[#FF3C00]/30" />
              <div className="absolute -top-4 -left-4 w-32 h-32 border-l-2 border-t-2 border-[#FF3C00]/30" />
            </div>
          </div>

          {/* Bio */}
          <div
            className={`transition-all duration-700 delay-300 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="border-l-4 border-l-[#FF3C00] pl-6 mb-6">
              <p className="text-[#C0A060] text-xs tracking-[0.4em] uppercase font-heading font-bold mb-2">
                From the Shop
              </p>
              <p className="text-[#F0F0F0] text-xl font-display leading-relaxed italic">
                &ldquo;Real ink for real people. No compromises, no bullshit.&rdquo;
              </p>
            </div>

            <p className="text-[#F0F0F0] leading-relaxed mb-4">
              Robert&apos;s been slingin&apos; ink for over 15 years. Started in dive bars, moved through proper shops, and now runs his own crew. He tattooes the way he lives — raw, bold, and with no apologies. Custom designs, cover-ups, flash work — if you&apos;ve got the guts to sit in the chair, he&apos;s got the needle.
            </p>
            <p className="text-[#F0F0F0] leading-relaxed mb-8">
              When he&apos;s not behind the needle, you&apos;ll find him in the garage working on bikes, cranking rock records in the studio, or sketching designs that&apos;ll make your skin crawl. His work isn&apos;t just tattoos — it&apos;s stories told in ink. Timeless, bold, authentic.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-8 py-6 border-y border-[#1e1e1e]">
              {badges.map(({ emoji, label }) => (
                <div
                  key={label}
                  className="px-4 py-2 bg-[#141414] border border-[#1e1e1e] rounded-sm text-[#F0F0F0] text-sm tracking-wider uppercase font-heading font-semibold hover:border-[#FF3C00] transition-colors"
                >
                  <span className="mr-2">{emoji}</span>
                  {label}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6">
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="font-display text-3xl text-[#FF3C00] mb-1">
                    {value}
                  </p>
                  <p className="text-[#9CA3AF] text-xs tracking-wider uppercase font-heading font-semibold">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
