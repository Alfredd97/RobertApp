"use client";

import { useEffect, useRef, useState } from "react";
import { Zap, Flame, Skull, Pen } from "lucide-react";

const services = [
  {
    icon: Skull,
    title: "Custom Design",
    price: "$300-500",
    description:
      "Bring your vision to life. We'll work with you to design a one-of-a-kind tattoo that tells your story. Consultation, sketches, and revisions until it's perfect.",
    features: [
      "Design consultation",
      "Multiple sketches",
      "Revisions included",
      "Rush options available",
    ],
    highlight: false,
  },
  {
    icon: Zap,
    title: "Cover-Up",
    price: "$400-800",
    description:
      "Got a tattoo you regret? We specialize in cover-ups that transform old ink into something sick. New design, fresh start.",
    features: [
      "Old ink assessment",
      "Custom cover design",
      "Expert execution",
      "Touch-ups included",
    ],
    highlight: true,
  },
  {
    icon: Pen,
    title: "Fine Line Work",
    price: "$250-400",
    description:
      "Detailed, delicate line work for those who want something subtle but striking. Black and grey precision.",
    features: [
      "Detailed consultation",
      "Fine detail work",
      "High precision",
      "Long-lasting design",
    ],
    highlight: false,
  },
  {
    icon: Flame,
    title: "Flash Tattoo",
    price: "$100-200",
    description:
      "Quick, bold designs from our flash collection. No appointment needed (walk-ins welcome). Limited availability.",
    features: [
      "Ready to go designs",
      "Quick turnaround",
      "Walk-in friendly",
      "Cash or card",
    ],
    highlight: false,
  },
];

export default function Services() {
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
            What We Do
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-[#F0F0F0] tracking-widest">
            SERVICES
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[#FF3C00] to-transparent mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className={`relative p-6 transition-all duration-700 bg-[#141414] border-2 border-[#1e1e1e] border-l-4 border-l-[#FF3C00] ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                } ${
                  service.highlight
                    ? "ring-2 ring-[#FF3C00] lg:col-span-1"
                    : ""
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {service.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#FF3C00] text-black text-xs px-3 py-1 tracking-widest uppercase font-heading font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <Icon
                  className={`mb-6 ${
                    service.highlight ? "text-[#FF3C00]" : "text-[#C0A060]"
                  }`}
                  size={32}
                />

                <h3 className="font-heading text-xl text-[#F0F0F0] mb-2 tracking-wider font-bold">
                  {service.title}
                </h3>
                <p
                  className={`text-xl font-bold mb-4 ${
                    service.highlight ? "text-[#FF3C00]" : "text-[#C0A060]"
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
                      <span className={`w-1.5 h-1.5 ${service.highlight ? "bg-[#FF3C00]" : "bg-[#C0A060]"} flex-shrink-0`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={scrollToBooking}
                  className={`block w-full text-center text-xs tracking-widest uppercase py-3 transition-all duration-300 font-heading font-bold ${
                    service.highlight
                      ? "bg-[#FF3C00] text-[#0A0A0A] border-2 border-[#FF3C00] hover:shadow-[0_0_12px_#FF3C00]"
                      : "border-2 border-[#C0A060] text-[#C0A060] hover:bg-[#C0A060] hover:text-[#0A0A0A]"
                  }`}
                >
                  Book This
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
