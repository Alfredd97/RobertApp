"use client";

import { useState, useEffect } from "react";
import { Menu, X, Flame } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import LanguageSwitcher from "./LanguageSwitcher";

const navLinks = [
  { key: "about", href: "#about" },
  { key: "portfolio", href: "#portfolio" },
  { key: "services", href: "#services" },
  { key: "book", href: "#booking" },
  { key: "contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (id === "body") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-[#0A0A0A] border-b-2 border-[#FF3C00]`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="#"
          onClick={(e) => scrollTo(e, "body")}
          className="font-display text-2xl tracking-widest text-[#F0F0F0] hover:text-[#FF3C00] transition-colors flex items-center gap-2"
        >
          <Flame size={24} className="text-[#FF3C00]" />
          ROBERT&apos;S INK
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(({ key, href }) => (
            <li key={key}>
              <a
                href={href}
                onClick={(e) => scrollTo(e, href)}
                className="text-sm tracking-widest uppercase text-[#F0F0F0] hover:text-[#FF3C00] transition-colors duration-300 font-heading font-semibold"
              >
                {t.nav[key as keyof typeof t.nav]}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#booking"
              onClick={(e) => scrollTo(e, "#booking")}
              className="text-sm tracking-widest uppercase px-5 py-2 border-2 border-[#FF3C00] text-[#F0F0F0] hover:text-black hover:bg-[#FF3C00] transition-all duration-300 font-heading font-semibold hover:shadow-[0_0_12px_#FF3C00]"
            >
              {t.nav.bookNow}
            </a>
          </li>
          <li className="border-l border-[#9CA3AF]/30 pl-8">
            <LanguageSwitcher />
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#F0F0F0] hover:text-[#FF3C00] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-t border-[#1e1e1e]">
          <ul className="flex flex-col py-6 px-6 gap-4">
            {navLinks.map(({ key, href }) => (
              <li key={key}>
                <a
                  href={href}
                  onClick={(e) => scrollTo(e, href)}
                  className="text-sm tracking-widest uppercase text-[#F0F0F0] hover:text-[#FF3C00] transition-colors block py-2 font-heading font-semibold"
                >
                  {t.nav[key as keyof typeof t.nav]}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="#booking"
                onClick={(e) => scrollTo(e, "#booking")}
                className="text-sm tracking-widest uppercase px-5 py-3 border-2 border-[#FF3C00] text-[#F0F0F0] hover:text-black hover:bg-[#FF3C00] transition-all duration-300 block text-center font-heading font-semibold hover:shadow-[0_0_12px_#FF3C00]"
              >
                {t.nav.bookNow}
              </a>
            </li>
            <li className="border-t border-[#9CA3AF]/30 pt-4 mt-4">
              <LanguageSwitcher />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
