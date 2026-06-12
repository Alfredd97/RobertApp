import { Instagram, Facebook } from "lucide-react";

const quickLinks = [
  { label: "About", href: "#about" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Services", href: "#services" },
  { label: "Book", href: "#booking" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { icon: Instagram, href: "https://www.instagram.com/robertkareltattoo/", label: "Instagram" },
  { icon: Facebook, href: "https://www.facebook.com/people/robertkareltattoo/", label: "Facebook" },
];

export default function Footer() {
  return (
    <footer className="bg-[#060606] border-t-2 border-t-[#FF3C00] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="text-center md:text-left">
            <p className="font-display text-3xl tracking-widest text-[#F0F0F0] mb-4">
              ROBERT&apos;S<br />INK
            </p>
            <p className="text-[#9CA3AF] text-sm leading-relaxed">
              Tattoo artist. Custom work. Raw, bold, authentic ink for bold people.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <p className="text-[#FF3C00] text-xs tracking-[0.3em] uppercase mb-6 font-heading font-bold">
              Navigation
            </p>
            <ul className="space-y-3">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-[#9CA3AF] text-sm hover:text-[#FF3C00] transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="text-center md:text-right">
            <p className="text-[#FF3C00] text-xs tracking-[0.3em] uppercase mb-6 font-heading font-bold">
              Follow
            </p>
            <div className="flex gap-4 justify-center md:justify-end">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-3 border-2 border-[#1e1e1e] text-[#9CA3AF] hover:border-[#FF3C00] hover:text-[#FF3C00] transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1e1e1e] flex flex-col sm:flex-row justify-center items-center gap-4">
          <p className="text-[#9CA3AF] text-xs text-center">
            &copy; {new Date().getFullYear()} ROBERT&apos;S INK. All rights reserved.
          </p>
          <span className="text-[#FF3C00] text-xs">•</span>
          <p className="text-[#C0A060] text-xs tracking-widest uppercase font-heading font-bold">
            BUILT FOR THE BOLD.
          </p>
        </div>
      </div>
    </footer>
  );
}
