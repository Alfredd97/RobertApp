# ROBERT'S INK — Tattoo Artist Landing Page

A bold, gritty tattoo artist portfolio built with **Next.js 14**, **Tailwind CSS**, and the **Anthropic Claude API**. Raw, authentic design for a custom tattoo shop with an integrated AI customer service assistant.

## 🔥 Features

- **Modern Artist Portfolio** — Full-screen hero, masonry gallery, service offerings
- **AI Chat Widget** — Powered by Claude Sonnet 4.6 with streaming responses and prompt caching
- **Booking Integration** — Calendly embed for appointment scheduling
- **Responsive Design** — Mobile-first, works on all devices
- **Dark Theme** — Edgy, gritty aesthetic with red accent colors
- **Smooth Animations** — Intersection Observer for scroll-triggered fades and slides
- **Scroll Effects** — Red scrollbar, back-to-top button, smooth navigation

## 🎨 Design

**Color Palette:**
- Background: `#0A0A0A` (near black)
- Primary Accent: `#FF3C00` (burnt orange-red)
- Secondary: `#C0A060` (aged brass gold)
- Text: `#F0F0F0` (off-white)

**Typography:**
- Headings: **Bebas Neue** (tall, bold, industrial)
- Subheadings: **Oswald** (strong, mechanical)
- Body: **Barlow** (clean with attitude)

## 📋 Sections

1. **Navbar** — Fixed navigation with flame icon, smooth scroll links
2. **Hero** — Full-viewport display with motorcycle silhouette and red glow effects
3. **About** — Artist bio with badges (Motorcycles, Rock, Cars, Custom Tattoos)
4. **Portfolio** — Masonry grid of tattoo designs with red overlay on hover
5. **Services** — Four tattoo packages: Custom Design, Cover-Up, Fine Line, Flash
6. **Booking** — Calendly embed with red corner accents
7. **Contact** — Studio info and social media links
8. **Chat Widget** — Floating AI assistant powered by Claude
9. **Back to Top** — Red chevron button (bottom-left)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Anthropic API key ([get one here](https://console.anthropic.com))

### Installation

1. **Clone the repo:**
   ```bash
   git clone https://github.com/Alfredd97/RobertApp.git
   cd RobertApp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

4. **Start the dev server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🔧 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **AI:** Anthropic Claude SDK
- **Icons:** Lucide React
- **Fonts:** Google Fonts (Bebas Neue, Oswald, Barlow)
- **Booking:** Calendly embed

## 🤖 AI Chat Setup

The chat widget uses Claude Sonnet 4.6 with:
- **Streaming responses** for real-time message delivery
- **Prompt caching** on the system message for cost optimization
- **Custom system prompt** tailored for tattoo shop customer service

API endpoint: `/api/chat` (POST)

**System prompt covers:**
- Service descriptions and pricing
- Booking information via Calendly
- Tattoo design consultation
- Studio hours and contact info

## 🎯 Customization

**To customize for your shop:**

1. **Artist name/bio** — Edit `components/About.tsx`
2. **Services & pricing** — Update `components/Services.tsx`
3. **Portfolio images** — Replace seed-based placeholders in `components/Portfolio.tsx` with real tattoo photos
4. **Calendly URL** — Change in `components/Booking.tsx`
5. **Contact info** — Update `components/Contact.tsx`
6. **AI assistant prompt** — Modify `SYSTEM_PROMPT` in `app/api/chat/route.ts`
7. **Social media links** — Edit `components/Footer.tsx`

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add `ANTHROPIC_API_KEY` to environment variables
4. Deploy

### Other Platforms

Works on any Node.js 18+ hosting (AWS, Netlify, Railway, etc.). Ensure environment variables are set.

## 📄 File Structure

```
RobertApp/
├── app/
│   ├── layout.tsx           # Root layout with fonts
│   ├── page.tsx             # Main page (assembles components)
│   ├── globals.css          # Global styles & scrollbar
│   └── api/chat/route.ts    # Claude API endpoint
├── components/
│   ├── Navbar.tsx           # Navigation bar
│   ├── Hero.tsx             # Hero section
│   ├── About.tsx            # About artist
│   ├── Portfolio.tsx        # Tattoo gallery
│   ├── Services.tsx         # Service offerings
│   ├── Booking.tsx          # Calendly embed
│   ├── Contact.tsx          # Contact info
│   ├── Footer.tsx           # Footer
│   ├── ChatWidget.tsx       # AI chat bubble
│   └── BackToTop.tsx        # Back to top button
├── tailwind.config.ts       # Tailwind config
├── tsconfig.json            # TypeScript config
├── next.config.mjs          # Next.js config
└── package.json             # Dependencies
```

## 🔐 Security

- API keys stored in `.env.local` (not committed)
- `.gitignore` configured to exclude sensitive files
- No hardcoded credentials in source code

## 📝 License

This project is open source. Feel free to use it as a template for your own artist portfolio.

## 🤝 Support

For issues or questions:
- Check the [CLAUDE.md](./CLAUDE.md) for development guidance
- Review the component files for implementation details
- Visit [Anthropic docs](https://docs.anthropic.com) for API questions

---

**Built for the bold.** 🔥
