# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static portfolio website with a futuristic/cyberpunk theme. It's a pure HTML/CSS/JavaScript project with no build tools or dependencies.

## Tool Usage Guidelines

**Context7 Integration:**
Always use Context7 MCP tools (`mcp__plugin_context7_context7__resolve-library-id` and `mcp__plugin_context7_context7__query-docs`) automatically when:
- Generating code that uses external libraries or frameworks
- Providing setup/configuration/installation steps
- Accessing library or API documentation
- The user asks questions about how to use a specific library

Do this proactively without waiting for explicit requests. Use `resolve-library-id` first to get the correct library identifier, then use `query-docs` to retrieve up-to-date documentation.

## Architecture

**Technology Stack:**
- Pure vanilla JavaScript (no frameworks)
- Three.js r128 (via CDN) for 3D background effects
- CSS3 with CSS custom properties for theming
- No build process or package manager

**File Structure:**
- `index.html` - Single-page application with all sections (Hero, Services, Projects, Contact)
- `style.css` - Complete styling with CSS animations and responsive design
- `script.js` - All interactive functionality (navigation, typing effect, filters, forms, custom cursor, robot eyes)
- `cosmos-3d.js` - Three.js 3D background scene (crystal core, orbital rings, particles, geometries)
- `starfield-2d.js` - Canvas 2D starfield with shooting stars
- `auralis-horizontal.svg` / `auralis-horizontal-dark.svg` - Logo files used in navbar and footer
- `cursor-arrow.svg` - Custom cursor arrow graphic
- `DA-Auralis/auralis-assets/` - Complete brand assets directory with logos, icons, and color palette
- `auralis-bg-only.html` - Standalone demo of the 3D cosmic background (reference file)
- `auralis-robot-v6.html` - Standalone demo of the 3D robot (reference file, not used in production)

**Key Design Patterns:**

1. **CSS Architecture** (style.css):
   - Variables defined in `:root` for consistent theming (colors, fonts, shadows)
   - Organized by sections with clear comment headers
   - Mobile-first responsive design with media queries at 1024px, 768px, 480px
   - Animation keyframes defined inline near their usage

2. **JavaScript Architecture**:
   - **script.js**: Event-driven with no frameworks
     - Uses IntersectionObserver for scroll animations
     - Modular sections separated by comments
     - Key modules: Navigation, Typing Effect, Project Filter, Video Controls, Scroll Animations, Contact Form, Custom Cursor, Robot Eyes Tracking
     - Robot eyes follow cursor: calculates angle between robot center and mouse position, moves pupils accordingly
   - **cosmos-3d.js**: Three.js scene (loads after Three.js CDN)
     - WebGL renderer with alpha transparency
     - Crystal core: Icosahedron with wireframe and glow sphere
     - 3 orbital rings (torus geometry) with rotation animations
     - 45 orbiting particles on ring paths
     - 12 floating geometries (octahedra, tetrahedra, icosahedra)
     - 3 particle dust layers (1300 total particles) with scroll parallax
     - Mouse parallax and scroll-based camera movement
     - Dynamic point lights with pulse animations
   - **starfield-2d.js**: Canvas 2D background layer
     - ~200 twinkling stars with radial gradients
     - Random shooting stars (every 3.5-9.5 seconds)
     - Uses Auralis color palette

3. **HTML Structure** (index.html):
   - Semantic HTML5 sections with IDs for navigation
   - `#cosmos` container with dual canvas system:
     - `#starfield` canvas (z-index: 1) - 2D stars
     - `#three-scene` canvas (z-index: 2) - 3D elements
     - 3 nebula layers (`.neb-1`, `.neb-2`, `.neb-3`) with CSS animations
     - Vignette and grain overlays for depth
   - Hero section:
     - `.orbit-container` with CSS robot and rotating satellite orbits
     - `.planet` with gradient and pulse animation
     - `.robot` with head (eyes that track cursor), body, antenna
     - 3 `.orbit` layers with `.satellite` elements rotating at different speeds
   - All sections: `#home`, `#services`, `#projects`, `#contact`
   - Project cards use `data-category` attributes for filtering
   - Hero visual positioned right with `justify-content: flex-end` to avoid obscuring center 3D crystal

## Development Workflow

**Running the project:**
- Open `index.html` directly in a browser, or
- Use any local server: `python -m http.server` or `npx serve`

**Making changes:**
- HTML: Edit section content in `index.html`
- Styling: Modify CSS variables in `:root` for theme changes, or edit specific section styles
- Interactivity: Edit corresponding function blocks in `script.js`

**Testing:**
- Test all breakpoints: 1024px, 768px, 480px
- Verify mobile menu toggle works
- Check project filter buttons function correctly
- Validate smooth scroll and navigation highlighting
- Test contact form submission feedback

## Key Features to Preserve

**Visual Effects:**
- **3D Cosmic Background** (cosmos-3d.js):
  - Crystal core with breathing animation and emissive glow
  - 3 orbital rings rotating at different speeds
  - Orbiting particles following ring paths with opacity pulse
  - 12 floating wireframe/solid geometries with rotation and float animation
  - 3 dust particle layers (1300 particles) with scroll parallax
  - Camera responds to mouse movement (parallax) and scroll position
  - Dynamic lighting with 3 pulsing point lights
- **2D Starfield** (starfield-2d.js):
  - 200+ twinkling stars with glow halos
  - Random shooting stars streaking diagonally
- **CSS Nebulas**: 3 animated gradient layers (28s, 34s, 22s cycles)
- **Hero Robot** (CSS-based):
  - Planet with gradient and pulse animation (3s cycle)
  - CSS robot with floating animation (3s ease-in-out)
  - Robot eyes with pupils that follow mouse cursor
  - Glowing antenna with pulse animation
  - Body light with pulse animation
  - 3 satellite orbits rotating at 8s, 12s, 16s (reverse direction on orbit-2)
- Glitch effect on hero title (`.glitch` with `::before`/`::after` pseudo-elements)
- Typing effect with cursor blink (cycles through 4 role descriptions)
- Custom cursor arrow (script.js, desktop only, replaces default cursor)
- All animations use passive event listeners + `requestAnimationFrame` for performance

**Interactive Components:**
- Active navigation link highlighting based on scroll position
- Mobile hamburger menu with slide-in navigation
- Project filtering system (all/web/ia/agent categories)
- Video hover/click play controls
- Form validation and success feedback
- Smooth scroll for anchor links

## Customization Points

**Contact Information:**
- Email: Lines 542, 549 in index.html (currently `votre@email.com`)
- GitHub: Lines 551, 606 in index.html (currently `https://github.com/votre-github`)
- LinkedIn: Lines 559, 607 in index.html (currently `https://linkedin.com/in/votre-linkedin`)

**Content:**
- Typing effect words: Line 57 in script.js (`words` array: 'Web Developer', 'Automatisation IA', 'Agent IA Creator', 'Full Stack Dev')
- Project cards: Lines 165-526 in index.html (6 cards with placeholder SVG icons and no video sources)
- Service cards: Lines 104-149 in index.html (3 cards: Web Development, IA Automation, IA Agents)

**Theme Colors (Auralis Brand):**
- Primary/Aurora: `--primary: #00E5CC` (cyan, line 6)
- Aurora Deep: `--primary-dark: #00BFA6` (line 7)
- Nebula (secondary text): `--secondary: #5A6372` (line 8)
- Deep Space (bg): `--bg-dark: #080B12` (line 10)
- Dark Matter (cards): `--bg-card: #0D1117` (line 11)
- Moonlight (text): `--text-primary: #E8EAED` (line 13)

## Important Notes

**3D Background System:**
- Three.js r128 loaded via CDN (must load before cosmos-3d.js and starfield-2d.js)
- WebGL renderer with `alpha: true` for transparency overlay
- Pixel ratio capped at 2 for performance (`Math.min(devicePixelRatio, 2)`)
- Reduced motion support: stops Three.js clock if `prefers-reduced-motion: reduce`
- Background is fixed (`position: fixed; inset: 0; z-index: 0`)
- All content layers have `z-index > 0` to appear above background

**Hero Robot (CSS):**
- Pure CSS/HTML robot with no external dependencies
- Eyes follow cursor using JavaScript (script.js lines 327-355)
- Positioned right (`justify-content: flex-end`) to not obscure center 3D crystal
- 3 orbit animations using CSS transforms and keyframes
- Robot float animation independent from orbit rotations

**General:**
- No video files are currently linked (project cards have empty video sources)
- Form submission is logged to console only (script.js)
- Custom cursor and robot eye tracking only activate on screens >768px width
- All animations use `requestAnimationFrame` for performance
- Fonts loaded from Google Fonts: Orbitron (display) and Rajdhani (body)
- Default cursor is hidden globally (`cursor: none !important` on all elements)
- Console includes easter egg message (script.js)
- Language: French content throughout

## 3D Background Customization

**Adjusting 3D elements** (cosmos-3d.js):
- Crystal core size: Line 141 `new THREE.IcosahedronGeometry(1.5, 1)` - change first parameter
- Ring sizes: Lines 162-164 `mkRing(radius, tubeSize, opacity, emissive)`
- Particle count: Lines 190-191 `mkOrbiters(count, radius, tiltX, tiltZ)`
- Dust density: Lines 251-253 `mkDust(count, color, size, opacity, spread)`
- Camera distance: Line 126 `camera.position.set(0, 0, 20)` - change z value
- Scroll effect strength: Lines 288-291 (multiply `sp` by different values)

**Adjusting 2D starfield** (starfield-2d.js):
- Star count: Line 382 `Math.floor(200 * ...)` - change base count
- Shooting star frequency: Lines 399, 444 - change time intervals in milliseconds
- Star colors distribution: Line 386 - adjust probability thresholds

**Nebula animations** (style.css):
- Animation speed: `.neb-1` to `.neb-3` animation durations (28s, 34s, 22s)
- Nebula colors/opacity: Modify `rgba()` values in gradient definitions
- Disable nebulas: Comment out `.neb` divs in index.html

**Performance optimization:**
- Reduce particle counts in cosmos-3d.js (lines 190-191, 251-253)
- Lower pixel ratio: Line 121 change `Math.min(window.devicePixelRatio, 2)` to `1`
- Disable dust layers: Comment out `mkDust()` calls and `scene.add(dust1/2/3)`

**Hero Robot customization** (style.css):
- Planet size: `.planet` width/height (line 427-428)
- Robot size: `.robot-head` and `.robot-body` dimensions
- Orbit sizes: `.orbit-1`, `.orbit-2`, `.orbit-3` (lines 605-620)
- Animation speeds: `@keyframes rotate` for orbits (8s, 12s, 16s)
- Satellite colors: `.satellite`, `.orbit-2 .satellite`, `.orbit-3 .satellite`
- Eye tracking sensitivity: `maxDistance` in script.js line 346

## Brand Assets

The `DA-Auralis/auralis-assets/` directory contains complete Auralis brand resources:
- **Logos**: Dark/light variants in horizontal and stacked layouts
- **Icons**: Square and round icons in SVG and PNG (512px), favicons, watermark
- **Web**: Open Graph images (1200x630), LinkedIn banners (1584x396), color palette
- **Applications**: Business card template, email signature, web header

Official brand colors are defined in the CSS `:root` and match the Auralis brand guide.
