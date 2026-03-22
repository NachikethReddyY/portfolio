# Design System: Rounded Sophistication

## 1. Overview & Creative North Star: "The Editorial Curator"
This design system rejects the "boxy" constraints of traditional SaaS. Our Creative North Star is **The Editorial Curator**—a visual language that blends the authoritative weight of a premium print magazine with the fluid, tactile responsiveness of modern high-end hardware.

We achieve **Professional Playfulness** not through whimsy, but through exaggerated geometry and breathing room. By pairing the high-intellect "Noto Serif" with ultra-rounded containers (`24px+`), we create an interface that feels both qualified and approachable. The layout breaks the "template" look by using intentional white space, staggering elements along an asymmetrical axis, and treating every screen as a curated composition rather than a data grid.

---

## 2. Color Architecture
Our palette is rooted in a "Bright-Light" philosophy. We use sophisticated blue accents to signal trust, while neutral tones provide a high-end, gallery-like backdrop.

### Named Color Roles
* **Primary (#004ac6)** & **Primary Container (#2563eb):** Our "Signature Blue." Reserved for high-intent actions and brand-defining moments.
* **Surface (#faf8ff) & Background (#faf8ff):** A crisp, slightly cool white that prevents the UI from feeling "yellowed" or aged.
* **Tertiary (#943700):** Used sparingly as an "Organic Counterpoint" to the blue, providing warmth in notifications or specific status cues.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. We define boundaries through:
1. **Tonal Shifts:** Placing a `surface-container-low` section against a `surface` background.
2. **Negative Space:** Using the Spacing Scale (specifically `spacing-12` and `spacing-16`) to create mental groupings.

### Glass & Gradient Strategy
To move beyond "flat" design, apply a subtle linear gradient to main CTAs (from `primary` to `primary_container`). For floating overlays (modals, dropdowns), use **Glassmorphism**:
* **Fill:** `surface_container_lowest` at 80% opacity.
* **Effect:** Backdrop-blur (12px–20px).
This ensures the UI feels like a layered, physical environment.

---

## 3. Typography: The Intellectual Contrast
We utilize a high-contrast typographic pairing to signal "High-End Editorial."

* **Display & Headlines (Noto Serif):** These are our "Voice." Large, serifed type conveys authority and history. Use `display-lg` (3.5rem) for hero moments to command attention.
* **Body & Labels (Inter):** Our "Utility." Inter provides maximum legibility at smaller scales. It balances the "playfulness" of the rounded corners with a "qualified" engineering feel.
* **Hierarchy Note:** Always maintain a minimum 2-step jump in the scale between headlines and body text to ensure the editorial intent is clear.

---

## 4. Elevation & Depth: Tonal Layering
We abandon traditional "drop shadows" in favor of **Tonal Layering**. Depth is a result of surface value, not artificial light.

* **The Layering Principle:**
* **Base:** `surface`
* **Sectioning:** `surface-container-low`
* **Interactive Cards:** `surface-container-lowest` (This creates a "lifted" effect through brightness).
* **Ambient Shadows:** If a shadow is required for a floating element, use the `on-surface` color at 4% opacity with a blur radius of 40px+. It should feel like an atmospheric glow, not a shadow.
* **The Ghost Border:** For accessibility in form fields, use the `outline_variant` at **20% opacity**. Never use 100% opaque lines.

---

## 5. Components & Primitives

### High-Roundness Standards
* **Default Corner Radius:** `1rem` (16px) for small components.
* **Signature Radius (md/lg):** `1.5rem` to `2rem` (24px–32px) for cards, buttons, and input fields.
* **Pill Radius (full):** `9999px` for chips and tags.

### Buttons
* **Primary:** High-roundness (`full`), using the blue gradient. Padding: `1rem 2rem`.
* **Secondary:** `surface-container-high` background with `on-surface` text. No border.
* **Tertiary:** Ghost style; text-only with a `surface-variant` hover state.

### Input Fields
* **Style:** Soft-filled (`surface-container-low`) with a `2rem` corner radius.
* **Interaction:** On focus, the background shifts to `surface-container-highest` and a subtle `primary` "Ghost Border" (20% opacity) appears.

### Cards & Lists
* **Anti-Divider Rule:** Dividers are forbidden. Use vertical white space (`spacing-8`) or alternating background tints (`surface-container-low` vs `surface-container-lowest`) to separate list items.
* **Asymmetric Cards:** Experiment with cards that have varied padding (e.g., `spacing-8` on top/bottom, `spacing-10` on sides) to create an editorial rhythm.

### Suggested Signature Component: The "Curated Tile"
A large-format card (radius: `xl`) that uses a `display-sm` Noto Serif headline overlapping a high-resolution image, utilizing a glassmorphic footer for metadata.

---

## 6. Do’s and Don'ts

### Do
* **Do** embrace extreme roundness. If it feels "too round," it’s likely just right for this system.
* **Do** use `surface-bright` for the main canvas to keep the light-mode experience feeling premium.
* **Do** allow type to breathe. Use the `spacing-20` (5rem) for section margins.

### Don’t
* **Don’t** use black (#000000). Use `on-surface` (#191b23) for all text to maintain tonal softness.
* **Don’t** use 1px borders. Use background color shifts.
* **Don’t** use "Standard Blue." Only use the specified #2563EB accent to ensure the brand stays in the "High-End" territory.
* **Don’t** crowd the interface. If a screen feels busy, remove containers, don't add borders.