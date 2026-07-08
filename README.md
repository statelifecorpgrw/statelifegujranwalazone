# State Life Insurance Corporation — Gujranwala Branch website

A premium, animated, single-brand marketing site for the Gujranwala
Branch/Zonal Office of State Life Insurance Corporation of Pakistan.

## Run it
No build step. Open `index.html` in any modern browser (Chrome, Edge, Safari,
Firefox). Requires an internet connection for the CDN libraries (Google Fonts,
GSAP, ScrollTrigger, Lenis, Three.js).

## Stack
Plain HTML/CSS/JS. GSAP + ScrollTrigger (pinned horizontal "Why Choose"
section), Lenis (smooth scroll), Three.js (hero 3D shield + particles).
No React/Bootstrap/Tailwind, per spec.

## Files
- `index.html` — all markup, SEO meta, Open Graph tags, schema.org JSON-LD
- `style.css` — design tokens, layout, glassmorphism, animations, responsive rules
- `script.js` — all interactivity (see inline comments for each module)
- `assets/favicon.svg` — shield mark favicon
- `images/og-cover.jpg` — generated social-share graphic (shield mark + wordmark)
- `fonts/` — empty by design; fonts load from Google Fonts CDN (see fonts/README.txt)

## Confirmed facts used
- Address: Shaheenabad, Gujranwala
- Phone: 0312-1772262
- Parent org: State Life Insurance Corporation of Pakistan — nationalized/
  established 1972, AAA-rated, Pakistan's largest state-owned life & health
  insurer, HQ Karachi.

## Before you publish — placeholders to replace
Search the codebase for "PLACEHOLDER" (also in HTML comments) to find every
spot flagged below:
1. **Branch/Zonal Manager name + photo** — the "Message from Our Gujranwala
   Team" section is signed generically; add a real name/title/photo if desired.
2. **Confirmed office hours** — currently points visitors to call
   0312-1772262 instead of stating specific hours, since none were publicly
   confirmed at build time.
3. **Testimonials** — the three testimonial cards are clearly labeled sample/
   illustrative placeholders. Replace with real, consented customer quotes
   before launch (a visible disclaimer is shown until you do).
4. **Domain** — `PLACEHOLDER_DOMAIN` in the JSON-LD schema block and the
   `images/og-cover.jpg` / canonical URL should be swapped for the live domain.
5. **Local agent count / branch-opening year** — intentionally left generic
   (not publicly confirmed); add real numbers if the client provides them.

## Accessibility & performance notes
- Respects `prefers-reduced-motion` (disables parallax/tilt/Lenis/3D idle spin).
- Custom cursor and pointer-tilt effects are automatically disabled on touch
  devices; the pinned horizontal banner section becomes a native swipeable
  scroll-snap row below 900px width instead of scroll-jacking mobile users.
- FAQ uses native `<details>/<summary>` for built-in keyboard support.
- All decorative icons/canvases are `aria-hidden`; interactive elements have
  visible focus states.
