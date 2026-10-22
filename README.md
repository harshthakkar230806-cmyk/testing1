# Apricode Agency — 3D Web Experience

A modern, production-ready website template with immersive 3D parallax effects powered by Three.js, GSAP animations, and smooth scroll interactions.

## Features

- **3D Parallax Background** — Floating particle grid rendered with Three.js, depth-responsive to mouse movement
- **Scroll Animations** — GSAP-powered animations with ScrollTrigger for smooth, sequenced reveals
- **Custom Cursor** — Smooth-animated cursor that grows on interactive elements
- **Responsive Design** — Mobile-friendly navigation with off-canvas menu
- **Theme Toggle** — Dark/light mode toggle (persisted for returning visitors)
- **Preloader** — Animated loader that masks content until fully loaded
- **Noise Overlay** — Subtle film-grain texture for visual depth
- **Vercel Ready** — Includes `vercel.json` for optimized deployment
- **Performance** — GPU-accelerated Three.js with device-pixel ratio awareness

## File Structure

```
3d-website/
├── index.html
├── style.css
├── main.js
├── vercel.json
└── README.md
```

## Getting Started

1. **Extract the zip** to your project directory.
2. **Preview locally** — open `index.html` in your browser, or serve with:
   ```bash
   npx serve .
   # or
   python3 -m http.server 8000
   ```
3. **Customize** the content in `index.html` (hero text, projects, services, contact info).
4. **Deploy to Vercel:**
   - Drag & drop the folder into the Vercel dashboard, or:
   ```bash
   vercel login
   vercel --cwd /path/to/3d-website
   ```

## Customization Guide

### Updating Content
- **Hero Section**: Edit the text inside the `<section class="hero">` block
- **Projects**: Modify the `projects` array in `main.js` — tags, title, description
- **Services**: Edit the `<div class="service-card">` elements in `index.html`
- **Contact**: Update email, location, and company name in both `index.html` and the footer

### Styling
- **Colors**: Primary brand color is `#8b5cf6` (purple/violet). Search and replace in `style.css`
- **Fonts**: Uses system font stack for fast loading. Add custom fonts via `<link>` in `index.html`
- **Dark Mode**: Default theme is dark. Light theme activates via toggle (icon: 🌙 / ☀️)

### 3D Particles
- Adjust `particleCount`, particle `size`, and layer `groupCount` in the `initThree()` function
- Modify `color.setHSL(...)` values to change the color scheme of the particle field

## Browser Support

- Modern browsers (Chrome, Firefox, Edge, Safari)
- WebGL required (Three.js gracefully downgrades on unsupported devices)
- CSS supports `@supports` as a fallback where needed

## Performance Notes

- Three.js canvas uses `powerPreference: "high-performance"` for discrete GPUs
- GSAP animations paused when not in viewport (via ScrollTrigger)
- RequestAnimationFrame loop is lightweight and optimized

## License

Feel free to use this as a starting point for your own projects.
