# Acceptance before implementation

1. Home identifies Nachiketh and his developer focus; all three featured projects are reachable.
2. Project stage selects LAH, RoadRunners, and Lumina without shifting surrounding layout; arrow keys work when a project tab has focus.
3. Each project has correct public case-study destination and honest status. LAH remains in development.
4. About and contact anchors navigate to visible sections; contact opens supplied LinkedIn, not an invented email.
5. Project details can open and close with keyboard, with persistent content beneath.
6. Reduced motion disables entrance and pointer motion; content remains visible even if animation initialization fails.
7. At narrow widths, name, project media, navigation and contact fit without horizontal scrolling.
8. Production build completes. Asset requests succeed; no runtime errors observed in available browser UI.

## GSAP and Three.js follow-up

- On fresh load the GSAP hero sequence assembles text and settles fully readable.
- Normal forward/reverse scroll moves GSAP hero, project layers, portrait and contact continuously.
- Direct project tabs and arrow keys update project artwork, title, description and current index together.
- The Three.js sculpture loads, responds to pointer movement, changes pose during hero scroll, and has no perpetual render loop.
- At 320px and 390px, text, sculpture and project summary remain readable without covering controls.
- Live reduced-motion emulation cancels spatial movement, makes projects static selectable panels, and displays the sculpture in a static pose.
- Native disclosure state, case-study/demo/source links and nav anchors remain usable.

## Latest correction: MacBook-style visual replaces abstract frames

- At desktop and 320px the hero visual is immediately recognizable as an open laptop, with screen bezel, keyboard/base and editor.
- Code, AI and terminal panels emerge from the screen in a finite staggered GSAP sequence; all are fully visible in the settled frame.
- Reduced-motion shows the assembled laptop and panels without spatial movement.
- Visual is decorative, introduces no fake action, and never obscures hero text/navigation.

## Narrative portfolio — five-hour build

- First viewport names Nachiketh, full-stack developer / aspiring AI engineer, Singapore, and internship/project availability; no decorative project badge or aimless arrow.
- Homepage story order: identity → hello → education/experience → work → AI workflows → stack → writing → contact/footer.
- Projects and writing have local index/detail routes with direct-link refresh, browser back, meaningful 404 and next/previous discovery.
- GSAP route cover completes on rapid clicks, respects reduced motion, does not trap keyboard focus, and leaves actual links usable.
- Content appears without Sanity credentials; valid published CMS content can replace defaults; failure retains local content. No draft/token leaks to browser.
- Sanity schema validates required fields, safe URL fields, slugs and portable text; configured Studio is lazy loaded separately from portfolio.
- AI content identifies Fleet as orchestration/workflow improvement, not model-weight training unless direct evidence supports it. Contribution links describe actual merged/open state.
- Real 3D GLB has connected screen/base, depth, shadows and lighting; failed/unsupported rendering retains usable page and an intentional fallback.
- Verify desktop 1440-ish, mobile320/390, keyboard, reduced motion, all primary routes and content filters.
