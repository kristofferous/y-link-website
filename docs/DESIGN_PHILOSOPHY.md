# Y-Link Design Philosophy

This document defines the domain-wide design philosophy for the Y-Link website. It is grounded in the current live design system and aligned with the Y-Link brand profile.

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

- Default theme: dark.
- Light mode: supported and should remain first-class.

Color system uses calm neutrals plus a focused set of functional accents. All values below are concrete OKLCH values used today.

Dark theme (default):

- Background: oklch(0.08 0 0)
- Foreground text: oklch(0.98 0 0)
- Card surface: oklch(0.11 0 0)
- Muted surface: oklch(0.25 0 0)
- Accent surface: oklch(0.15 0 0)
- Secondary surface: oklch(0.13 0 0)
- Border and input: oklch(0.2 0 0)
- Focus ring: oklch(0.439 0 0)
- Primary (CTA): oklch(0.98 0 0) on oklch(0.08 0 0)
- Destructive: oklch(0.396 0.141 25.723) on oklch(0.637 0.237 25.331)

Light theme:

- Background: oklch(0.985 0 0)
- Foreground text: oklch(0.145 0 0)
- Card surface: oklch(0.98 0 0)
- Muted surface: oklch(0.94 0 0)
- Accent surface: oklch(0.96 0 0)
- Secondary surface: oklch(0.96 0 0)
- Border and input: oklch(0.88 0 0)
- Focus ring: oklch(0.708 0 0)
- Primary (CTA): oklch(0.145 0 0) on oklch(0.985 0 0)
- Destructive: oklch(0.577 0.245 27.325) on oklch(0.577 0.245 27.325)

Guidelines:

- Prefer subtle contrast changes (border, background, opacity) over loud color shifts.
- Primary is for primary CTAs only; secondary actions use neutral buttons or underlined text.
- Use muted text for metadata and navigation scaffolding.

### Typography

Global typography uses a clean, modern sans serif tone. Scale and weights:

- Display: clamp(2.5rem, 5vw, 4.5rem), 600 weight, 1.1 line height, -0.02em tracking
- Heading large: clamp(2rem, 4vw, 3rem), 600 weight, 1.15 line height, -0.015em tracking
- Heading: clamp(1.5rem, 3vw, 2rem), 600 weight, 1.2 line height, -0.01em tracking
- Title: 1.25rem, 600 weight, 1.4 line height, -0.005em tracking
- Body large: 1.125rem, 1.6 line height
- Body: 1rem, 1.6 line height
- Label: 0.875rem, 500 weight, uppercase, 0.02em tracking

Guidelines:

- Headings are medium-weight and tight in tracking; avoid oversized or heavy display type.
- Use labels for low-emphasis, uppercase metadata and navigation grouping.
- Body copy should be calm and readable, not dense or decorative.

### Layout and spacing

- Content max width: 1280px with 1.5rem side padding (2rem at >= 768px, 3rem at >= 1024px).
- Section rhythm: 4rem vertical padding (6rem at >= 768px, 8rem at >= 1024px).
- Long-form text width: ~65ch maximum.

Guidelines:

- Use border separators between sections with ~40% opacity borders to keep structure crisp.
- Layout should feel spacious and deliberate; avoid busy grids or small gutters.

### Backgrounds and patterns

- The base background uses a subtle grid (1px lines, 80px spacing).
- Grid opacity stays low; it should read as technical texture, not decoration.

Guidelines:

- Do not introduce high-contrast textures or gradients.
- Pattern use should reinforce technical precision, not aesthetics-first decoration.

### Components and surfaces

- Cards: rounded corners, soft borders, calm surfaces.
- Buttons: primary uses solid fill; secondary actions are border-only or underlined links.
- Links: underlined with offset for a technical, editorial feel.

Guidelines:

- Prefer rounded shapes with moderate radius (0.75rem).
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

## Do and Don't

### Do

- Keep contrast high enough for readability in both themes.
- Use neutral backgrounds with precise borders for structure.
- Keep CTAs focused and singular per section.
- Use standard spacing utilities for predictable rhythm.
- Use technical language where it clarifies, not to impress.

### Don't

- Don't introduce playful colors, gradients, or visual noise.
- Don't use hype language or speculative claims.
- Don't overuse shadows or heavy glass effects.
- Don't cram multiple CTAs into a single hero or section.
- Don't change the overall tone without brand approval.

## Quick implementation checklist

- Colors: use the OKLCH values listed above without introducing new hues.
- Typography: keep to the defined scale and weights; avoid ad-hoc sizes.
- Spacing: respect the 4/6/8rem vertical cadence and 1280px max width.
- Background: keep the grid subtle; avoid new textures.
- CTAs: primary for the main action, secondary as neutral.
- Tone: clear, technical, honest.
