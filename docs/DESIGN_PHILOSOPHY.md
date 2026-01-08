# Y-Link Design Philosophy

This document defines the domain-wide design philosophy for the Y-Link website. It is grounded in the current implementation and tokens in `src/app/globals.css`, and aligned with the brand profile from Supabase.

## Core intent

- Build trust through clarity, restraint, and technical precision.
- Prefer determinism and readability over flashy visuals or decorative noise.
- Showcase intelligence and performance without overpromising or hype.

## Brand foundation

- Brand name: Y-Link
- Tagline: Intelligent lighting control, simplified
- Values: innovation without unnecessary complexity, reliability, security by design, performance, developer-friendly, long-term thinking
- Tone: clear, confident, technical, minimal buzzwords; honest about limits
- Avoid: "Revolutionary", "Game-changing", "Disruptive", one-click magic, overpromising AI

## Visual system

### Color and surfaces

Tokens live in `src/app/globals.css` and are the source of truth.

- Default theme: dark (applied at startup in `src/app/layout.tsx`).
- Light mode: available and should remain first-class.

Use surfaces as calm, low-saturation neutrals:

- Background: `--background`
- Foreground text: `--foreground`
- Card surfaces: `--card` with `--card-foreground`
- Muted panels: `--muted`, `--accent`, `--secondary`
- Borders and inputs: `--border`, `--input`

Action and emphasis:

- Primary: `--primary` and `--primary-foreground`
- Destructive: `--destructive` and `--destructive-foreground`
- Ring for focus: `--ring`

Guidelines:

- Prefer subtle contrast changes (border, background, opacity) over loud color shifts.
- Primary is for primary CTAs only; secondary actions use neutral buttons or underlined text.
- Use muted text for metadata and navigation scaffolding.

### Typography

Global font usage is `font-sans`, with a clean, modern sans serif tone. Typography classes are defined in `src/app/globals.css`:

- `.text-display`: product hero statements
- `.text-heading-lg`: page-level headings
- `.text-heading`: section headings
- `.text-title`: card titles
- `.text-body-lg` and `.text-body`: long-form content and body copy
- `.text-label`: metadata, nav group labels, small UI labeling

Guidelines:

- Headings are medium-weight and tight in tracking; avoid oversized or heavy display type.
- Use `.text-label` for low-emphasis, uppercase labels and navigation grouping.
- Body copy should be calm and readable, not dense or decorative.

### Layout and spacing

- Layout container: `.container-custom` in `src/app/globals.css` (max width 1280px, padded).
- Section rhythm: `.section-spacing` provides consistent vertical cadence across pages.
- Long-form text should use `.prose-constrained` to maintain ~65ch reading width.

Guidelines:

- Use border separators between sections (`border-t border-border/40`) to keep structure crisp.
- Layout should feel spacious and deliberate; avoid busy grids or small gutters.

### Backgrounds and patterns

- The base background uses a subtle grid (`.grid-background`), applied in `src/app/[locale]/layout.tsx`.
- Grid opacity is low and should remain understated.

Guidelines:

- Do not introduce high-contrast textures or gradients.
- Pattern use should reinforce technical precision, not aesthetics-first decoration.

### Components and surfaces

- Cards: `SectionCard` uses rounded corners, soft borders, and `bg-card`.
- Buttons: primary buttons use solid fill; secondary actions are border-only or links.
- Links: underlined with offset to keep a technical, editorial feel.

Guidelines:

- Prefer rounded shapes with moderate radius (`--radius` = 0.75rem).
- Keep shadows subtle; rely on borders and background shifts instead.

### Motion and interaction

- Motion is minimal: short fades or opacity transitions only.
- Navigation and buttons use small hover/opacity changes.

Guidelines:

- Avoid attention-grabbing animations or complex transitions.
- Favor predictability over delight.

## Content presentation

- Lead with the concrete outcome or capability.
- Use short, informative headings; avoid marketing fluff.
- Use lists for technical benefits or system steps.
- Be honest about scope and limitations.

## Do and Don’t

### Do

- Keep contrast high enough for readability in both themes.
- Use neutral backgrounds with precise borders for structure.
- Keep CTAs focused and singular per section.
- Use standard spacing utilities for predictable rhythm.
- Use technical language where it clarifies, not to impress.

### Don’t

- Don’t introduce playful colors, gradients, or visual noise.
- Don’t use hype language or speculative claims.
- Don’t overuse shadows or heavy glass effects.
- Don’t cram multiple CTAs into a single hero or section.
- Don’t change the overall tone without brand approval.

## Quick implementation checklist

- Colors: only use the tokens in `src/app/globals.css`.
- Typography: use the existing scale classes, not ad-hoc sizes.
- Spacing: use `.section-spacing` and `.container-custom`.
- Background: keep the grid subtle; avoid new textures.
- CTAs: primary for the main action, secondary as neutral.
- Tone: clear, technical, honest.

## References

- Color and typography tokens: `src/app/globals.css`
- Layout background and page shell: `src/app/[locale]/layout.tsx`
- Navigation patterns: `src/components/Navbar.tsx`
- Footer patterns: `src/components/Footer.tsx`
- Card styling: `src/components/SectionCard.tsx`
