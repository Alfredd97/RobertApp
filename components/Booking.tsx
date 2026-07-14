"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Instagram } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function Booking() {
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
    <section id="booking" ref={sectionRef} className="py-28 px-6 bg-[#080808]">
      <div className="max-w-5xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <MessageCircle className="text-[#FF3C00] mx-auto mb-6" size={44} />
          <h2 className="font-display text-5xl md:text-6xl text-[#F0F0F0] mb-6 tracking-widest">
            {t.booking.title}
          </h2>
          <p className="text-[#C0A060] max-w-2xl mx-auto text-lg leading-relaxed font-heading font-bold tracking-wider">
            {t.booking.copy}
          </p>
        </div>

        <div
          className={`transition-all duration-700 delay-200 flex flex-col sm:flex-row justify-center gap-8 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <a
            href="https://wa.me/17185550147"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-4 px-8 py-6 bg-[#141414] border-2 border-[#1e1e1e] border-l-4 border-l-[#FF3C00] hover:bg-[#1a1a1a] hover:border-l-[#FFB700] transition-all duration-300 group"
          >
            <MessageCircle size={32} className="text-[#FF3C00] group-hover:text-[#FFB700]" />
            <span className="font-heading font-bold text-[#F0F0F0] text-lg tracking-wider">
              {t.booking.whatsapp}
            </span>
          </a>

          <a
            href="https://instagram.com/robertkareltattoo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-4 px-8 py-6 bg-[#141414] border-2 border-[#1e1e1e] border-l-4 border-l-[#FF3C00] hover:bg-[#1a1a1a] hover:border-l-[#FFB700] transition-all duration-300 group"
          >
            <Instagram size={32} className="text-[#FF3C00] group-hover:text-[#FFB700]" />
            <span className="font-heading font-bold text-[#F0F0F0] text-lg tracking-wider">
              {t.booking.instagram}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
