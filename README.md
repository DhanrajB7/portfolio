# Personal Portfolio Website

**Live:** [dhanraj-portfolio-azure.vercel.app](https://dhanraj-portfolio-azure.vercel.app)

A hand-crafted, single-page portfolio website built from scratch with vanilla HTML, CSS, and JavaScript — no frameworks, no templates, no build step. Designed to load instantly and leave a lasting impression.

---

## Why Vanilla HTML/CSS/JS?

I intentionally chose **zero frameworks** for this project. Here's why:

- **Performance** — No React, no Next.js, no bundle. The entire site is ~60KB. It loads in under 1 second on any connection.
- **Deployability** — Works on any static host (Vercel, Netlify, GitHub Pages, S3, any CDN). No `npm install`, no build process.
- **Demonstrates fundamentals** — Anyone can scaffold a portfolio with a React template. Writing performant animations, responsive layouts, and interactive effects from scratch shows a deeper understanding of the web platform.
- **Zero maintenance** — No dependencies to update, no security vulnerabilities from `node_modules`. This site will work the same way in 5 years.

---

## Features & Technical Details

### Animations (GSAP + Custom JS)

| Effect | Implementation |
|--------|---------------|
| **Text scramble/decode** | Custom `TextScramble` class — characters cycle through random symbols (`!<>-_\\/[]{}—=+*^?#`) before resolving to the correct letter. Uses `requestAnimationFrame` for smooth 60fps rendering. Each character has a randomized start/end frame for organic feel. |
| **Scroll-triggered reveals** | GSAP `ScrollTrigger` plugin — elements animate (`y: 50 → 0`, `opacity: 0 → 1`) when they enter the viewport at 88% scroll position. Section lines grow with `scaleX` from 0 to 1. |
| **Skill tag cascade** | `IntersectionObserver` API with staggered `setTimeout` — each tag gets a `visible` class with 50ms delay between tags. CSS handles the transition with a spring-like cubic-bezier curve. |
| **Timeline line draw** | CSS `transform: scaleY(0 → 1)` on a pseudo-element, triggered by a class toggle when the timeline enters the viewport. Uses `transform-origin: top center` for a top-down drawing effect. |
| **Parallax gradient blobs** | GSAP `scrub` ScrollTrigger — background gradient blobs translate at different speeds as you scroll, creating depth. |
| **Preloader** | JavaScript counter from 0 → 100 with a synced progress bar. After completion, the preloader fades out and hero animations begin in sequence. |

### Interactive Effects

| Effect | Implementation |
|--------|---------------|
| **Custom cursor** | Two `div` elements (dot + outline) positioned with `transform: translate()`. The dot follows the mouse exactly via `mousemove`. The outline follows with `0.15` lerp factor in a `requestAnimationFrame` loop for the trailing effect. Outline scales up on interactive elements. Hidden on touch devices. |
| **Magnetic buttons** | `mousemove` listener calculates offset from button center, applies `transform: translate(x * 0.25, y * 0.25)`. Resets with a smooth transition on `mouseleave`. |
| **3D tilt cards** | Project cards track mouse position relative to center, apply `perspective(1000px) rotateX() rotateY()`. A `radial-gradient` pseudo-element follows the cursor for a spotlight/shine effect using CSS custom properties (`--mouse-x`, `--mouse-y`). |
| **Chromatic aberration** | Hero name hover applies offset `text-shadow` with accent colors, creating an RGB-split glitch effect. |
| **Easter egg** | Typing "hire" on the keyboard triggers a confetti explosion — 60 animated pieces with randomized trajectories using the Web Animations API. |

### Design System

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0a0a0a` | Page background |
| Surface | `rgba(255,255,255,0.03)` | Card backgrounds |
| Border | `rgba(255,255,255,0.08)` | Subtle dividers |
| Accent 1 | `#64ffda` (teal) | Primary highlights, links, interactive states |
| Accent 2 | `#a78bfa` (lavender) | Gradient endpoints, secondary highlights |
| Heading font | Space Grotesk | Geometric, modern — used for names and titles |
| Body font | Inter | Clean, readable — used for paragraphs |
| Mono font | JetBrains Mono | Code-like — used for tags, labels, dates |

### Responsive Design

- **Desktop (>1024px)** — Full layout with custom cursor, 3D tilt, magnetic effects, 3-column skill grid
- **Tablet (768–1024px)** — 2-column skill grid, simplified hover states
- **Mobile (<768px)** — Single column, custom cursor hidden, full-screen hamburger menu, touch-optimized tap targets
- **Reduced motion** — `@media (prefers-reduced-motion: reduce)` disables all animations for accessibility

---

## Architecture

```
Portfolio/
├── index.html          # Single HTML file — all sections
├── css/
│   └── style.css       # ~900 lines of hand-written CSS
├── js/
│   └── main.js         # ~400 lines — animations, interactions, effects
├── assets/             # Images (when added)
└── Bhalala_D_Resume.pdf
```

### CSS Organization (~900 lines)

```
Custom Properties → Reset & Base → Typography → Layout → Glass Cards → Buttons
→ Preloader → Noise Overlay → Scroll Progress → Custom Cursor → Navigation
→ Hero → Marquee → Section Headers → About → Experience/Timeline → Skills
→ Projects → Contact → Footer → Keyframes → Responsive → Reduced Motion
```

### JavaScript Organization (~400 lines)

```
TextScramble class → Noise texture generator → Preloader → Hero animations
→ Custom cursor → Navigation (scroll + mobile) → Scroll progress bar
→ Smooth scroll → Marquee duplication → GSAP ScrollTrigger animations
→ Counter animation → Magnetic buttons → Project card tilt/shine
→ Active nav link tracking → Easter egg (confetti)
```

---

## Performance

| Metric | Value |
|--------|-------|
| Total size | ~60KB (HTML + CSS + JS) |
| External dependencies | 2 CDN scripts (GSAP core + ScrollTrigger, ~45KB gzipped) |
| Google Fonts | 3 fonts (Space Grotesk, Inter, JetBrains Mono) |
| Build step | None — deploy the files directly |
| Time to Interactive | < 1s on broadband |

---

## Sections

| Section | Content |
|---------|---------|
| **Hero** | Full-viewport with animated gradient blobs, scramble-decoded name, and scroll indicator |
| **Marquee** | Dual-direction infinite scroll strips showing all technologies |
| **About** | Bio, education, and animated stat counters (4+ years, 4+ roles, 10+ technologies) |
| **Experience** | Vertical timeline with 4 professional roles — animated connecting line and hover-glow dots |
| **Tech Stack** | 6 categorized skill groups with descriptions — Programming Languages, Frontend, Backend, Cloud, Data, Practices |
| **Projects** | Split into Personal Projects (with GitHub + demo links) and Professional Work (with company badges) |
| **Contact** | Email and phone with hover-slide cards, magnetic CTA buttons, resume download |

---

## Challenges & Solutions

| Challenge | What Happened | How I Solved It |
|-----------|--------------|-----------------|
| **Double opacity bug** | GSAP `ScrollTrigger` set skill cards to `opacity: 0`, and a separate stagger animation also set child tags to `opacity: 0` — tags never became visible | Replaced the GSAP stagger with `IntersectionObserver` + CSS transitions on the tags, keeping only the parent card's GSAP animation |
| **Smooth 60fps cursor** | Directly setting cursor position on `mousemove` caused jittery movement for the outline circle | Used `requestAnimationFrame` loop with linear interpolation (`lerp 0.15`) — the outline smoothly follows the dot with a trailing effect |
| **Marquee seamless loop** | A single set of marquee items creates a visible gap when the animation loops | Duplicated the inner HTML via JavaScript so the content is twice as long — the CSS animation translates by `-50%`, creating an infinite seamless loop |
| **Mobile performance** | Running custom cursor tracking, 3D tilt calculations, and magnetic effects on mobile caused jank | Feature-detect touch devices with `ontouchstart in window` and skip all pointer-tracking effects. Added `will-change: transform` on animated blobs. |
| **Text stroke cross-browser** | The outlined "BHALALA" text uses `-webkit-text-stroke` which isn't standard CSS | Used both `-webkit-text-fill-color: transparent` and `-webkit-text-stroke` — works in all modern browsers (Chrome, Safari, Firefox, Edge). Reduced stroke width on mobile for readability. |

---

## Running Locally

```bash
git clone https://github.com/DhanrajB7/portfolio.git
cd portfolio
# Just open it — no build step needed
open index.html
```

Or serve it locally:

```bash
npx serve .
```

---

## What I Would Add Next

- **Dark/light theme toggle** with system preference detection and `localStorage` persistence
- **Blog section** powered by Markdown files rendered at build time
- **Project detail pages** with case studies, screenshots, and technical deep-dives
- **Contact form** with serverless function backend (Vercel Edge Functions)
- **Analytics** with privacy-respecting Plausible or Umami

---

## Built With

HTML5 &bull; CSS3 &bull; Vanilla JavaScript &bull; GSAP & ScrollTrigger &bull; Google Fonts &bull; Vercel

Built by [Dhanraj Bhalala](https://github.com/DhanrajB7)
