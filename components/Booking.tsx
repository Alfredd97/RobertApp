"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";

export default function Booking() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

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
          <CalendarDays className="text-[#FF3C00] mx-auto mb-6" size={44} />
          <h2 className="font-display text-5xl md:text-6xl text-[#F0F0F0] mb-6 tracking-widest">
            GET INKED
          </h2>
          <p className="text-[#C0A060] max-w-2xl mx-auto text-lg leading-relaxed font-heading font-bold tracking-wider">
            NO FLUFF. PICK A TIME. LET&apos;S BUILD SOMETHING.
          </p>
        </div>

        <div
          className={`transition-all duration-700 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative bg-[#141414] border-2 border-[#1e1e1e] border-l-4 border-l-[#FF3C00] overflow-hidden">
            {/* Red corner accents */}
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#FF3C00]" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#FF3C00]" />

            <iframe
              src="https://calendly.com/alfreddaguilar97/30min"
              width="100%"
              height="650"
              frameBorder={0}
              title="Book a tattoo with Robert"
              className="block relative z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
