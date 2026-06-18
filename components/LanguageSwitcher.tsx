"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe size={16} className="text-[#9CA3AF]" />
      <button
        onClick={() => setLanguage("en")}
        className={`text-sm tracking-widest uppercase transition-colors duration-300 font-heading font-semibold ${
          language === "en"
            ? "text-[#FF3C00]"
            : "text-[#F0F0F0] hover:text-[#FF3C00]"
        }`}
      >
        EN
      </button>
      <span className="text-[#9CA3AF]">/</span>
      <button
        onClick={() => setLanguage("es")}
        className={`text-sm tracking-widest uppercase transition-colors duration-300 font-heading font-semibold ${
          language === "es"
            ? "text-[#FF3C00]"
            : "text-[#F0F0F0] hover:text-[#FF3C00]"
        }`}
      >
        ES
      </button>
    </div>
  );
}
