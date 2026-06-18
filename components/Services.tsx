"use client";

import { useEffect, useRef, useState } from "react";
import { Zap, Flame, Skull, Pen } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const serviceIcons = [Skull, Zap, Pen, Flame];
const serviceKeys = ["custom", "coverUp", "fineLine", "flash"] as const;
const serviceHighlights = [false, true, false, false];

export default function Services() {
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

  const scrollToBooking = () => {
    document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="services" ref={sectionRef} className="py-28 px-6 bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[#FF3C00] text-xs tracking-[0.4em] uppercase mb-4 font-heading font-bold">
            {t.services.whatWeDo}
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-[#F0F0F0] tracking-widest">
            {t.services.title}
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[#FF3C00] to-transparent mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceKeys.map((key, index) => {
            const Icon = serviceIcons[index];
            const service = t.services[key];
            const highlight = serviceHighlights[index];
            return (
              <div
                key={key}
                className={`relative p-6 transition-all duration-700 bg-[#141414] border-2 border-[#1e1e1e] border-l-4 border-l-[#FF3C00] ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                } ${
                  highlight
                    ? "ring-2 ring-[#FF3C00] lg:col-span-1"
                    : ""
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#FF3C00] text-black text-xs px-3 py-1 tracking-widest uppercase font-heading font-bold">
                      {t.services.mostPopular}
                    </span>
                  </div>
                )}

                <Icon
                  className={`mb-6 ${
                    highlight ? "text-[#FF3C00]" : "text-[#C0A060]"
                  }`}
                  size={32}
                />

                <h3 className="font-heading text-xl text-[#F0F0F0] mb-2 tracking-wider font-bold">
                  {service.title}
                </h3>
                <p
                  className={`text-xl font-bold mb-4 ${
                    highlight ? "text-[#FF3C00]" : "text-[#C0A060]"
                  }`}
                >
                  {service.price}
                </p>

                <p className="text-[#F0F0F0] text-sm leading-relaxed mb-4">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-xs text-[#F0F0F0] flex items-center gap-2"
                    >
                      <span className={`w-1.5 h-1.5 ${highlight ? "bg-[#FF3C00]" : "bg-[#C0A060]"} flex-shrink-0`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={scrollToBooking}
                  className={`block w-full text-center text-xs tracking-widest uppercase py-3 transition-all duration-300 font-heading font-bold ${
                    highlight
                      ? "bg-[#FF3C00] text-[#0A0A0A] border-2 border-[#FF3C00] hover:shadow-[0_0_12px_#FF3C00]"
                      : "border-2 border-[#C0A060] text-[#C0A060] hover:bg-[#C0A060] hover:text-[#0A0A0A]"
                  }`}
                >
                  {t.services.bookThis}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
