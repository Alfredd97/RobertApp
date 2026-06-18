"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, MapPin, Phone, Instagram, Facebook } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const contactInfoKeys = [
  { icon: Mail, key: "email", value: "hello@robertsink.tattoo", href: "mailto:hello@robertsink.tattoo" },
  { icon: Phone, key: "phone", value: "+1 (718) 555-0147", href: "tel:+17185550147" },
  { icon: MapPin, key: "location", value: "Williamsburg, Brooklyn, NY", href: null },
];

const socialLinks = [
  {
    icon: Instagram,
    label: "Instagram",
    href: "https://www.instagram.com/robertkareltattoo/",
    handle: "@robertsink",
  },
  {
    icon: Facebook,
    label: "Facebook",
    href: "https://www.facebook.com/people/robertkareltattoo/",
    handle: "Robert's Ink",
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();

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
    <section id="contact" ref={sectionRef} className="py-28 px-6 bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[#FF3C00] text-xs tracking-[0.4em] uppercase mb-4 font-heading font-bold">
            {t.contact.reachOut}
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-[#F0F0F0] tracking-widest">
            {t.contact.title}
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[#FF3C00] to-transparent mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact info */}
          <div
            className={`transition-all duration-700 delay-100 ${
              visible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            <h3 className="font-heading text-2xl text-[#F0F0F0] mb-8 tracking-wider font-bold">
              {t.contact.shop}
            </h3>
            <ul className="space-y-6">
              {contactInfoKeys.map(({ icon: Icon, key, value, href }) => (
                <li key={key} className="flex items-start gap-4">
                  <div className="mt-1 p-2 border-2 border-[#FF3C00]/40 text-[#FF3C00]">
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-[#9CA3AF] text-xs tracking-wider uppercase mb-1 font-heading font-bold">
                      {t.contact[key as keyof typeof t.contact]}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-[#F0F0F0] hover:text-[#FF3C00] transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-[#F0F0F0]">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Social links */}
          <div
            className={`transition-all duration-700 delay-200 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <h3 className="font-heading text-2xl text-[#F0F0F0] mb-8 tracking-wider font-bold">
              {t.contact.followInk}
            </h3>
            <ul className="space-y-4">
              {socialLinks.map(({ icon: Icon, label, href, handle }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-[#111111] border-2 border-[#1e1e1e] border-l-4 border-l-[#FF3C00] hover:border-l-[#FF3C00] group transition-all duration-300"
                  >
                    <Icon
                      size={18}
                      className="text-[#9CA3AF] group-hover:text-[#FF3C00] transition-colors"
                    />
                    <div>
                      <p className="text-[#9CA3AF] text-xs tracking-wider uppercase mb-0.5 font-heading font-bold">
                        {label}
                      </p>
                      <p className="text-[#F0F0F0] text-sm">{handle}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 p-6 bg-[#111111] border-2 border-[#1e1e1e] border-l-4 border-l-[#FF3C00]">
              <p className="text-[#F0F0F0] text-sm leading-relaxed">
                {t.contact.response}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
