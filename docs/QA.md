# Verification: 28 September 2026

The redesign was checked locally in Chromium at 1440 × 1000 and 390 × 844. The dedicated preview remains available at `http://localhost:3000`.

## Automated checks

`npm run build`, `npm run build:preview`, and all seven Node tests pass. Syntax checks pass for both browser scripts, and `git diff --check` is clean.

Tests cover preserved directory counts and editorial paragraphs, intentional section removals, internal anchors and asset paths, credits and structured data, per-page search metadata, transfer budgets, canonical trailing slashes, public-file isolation and video byte ranges.

## Browser checks

138 desktop and mobile assertions passed:

- 64 checks for slow forward and reverse mountain scrolling, reading pauses, profile fit, navbar direction changes and keyboard visibility, square cards and hidden scrollbars.
- 32 checks for image decoding, constrained centered statistics, section boundaries, touch-sized listing buttons, chapter highlighting, dialog bounds, accessible naming, focus entry and restoration, and mobile menu behavior.
- 42 checks across the three focused search pages for desktop/mobile widths, images, canonical URLs, structured data, headings and navigation.

All 319 rendered homepage images decode successfully. No horizontal page overflow or local console errors were found. These checks establish rendering and behavior, not the correctness of every legacy third-party claim or logo.

Operating-system reduced-motion handling is implemented in CSS and JavaScript. The browser driver's CDP allowlist did not permit emulating that OS preference, so a physical-device reduced-motion check remains unverified. File-transfer measurements are not a Lighthouse or Core Web Vitals score.

## Reviewed screenshots

- [Desktop hero](screenshots/home-desktop.jpg)
- [Mobile hero](screenshots/home-mobile.jpg)
- [Centered statistics](screenshots/metrics-desktop.jpg)
- [Editorial reading guide](screenshots/story-desktop.jpg)
- [Section boundary and listing control](screenshots/section-boundary.jpg)
- [Listing dialog](screenshots/listing-dialog.jpg)
- [Desktop mountain profile](screenshots/mountains-desktop.jpg)
- [Mobile mountain profile](screenshots/mountains-mobile.jpg)

## Content limits

The original community estimates remain qualified rather than presented as independently verified current figures. Seventeen legacy directory records still lack verified logo assets. Misleading parked-domain icons were removed; readable names, initials or a flag remain. See [asset sources](ASSETS.md), [beta notes](BETA.md) and `data/logo-audit.json`.

The current footer still uses the supplied Snow composite. A [new image prompt](prompts/himalayan-footer.md) is ready, but no new footer bitmap has been generated.

## Live review deployment

[https://siliconpeaks-snow.vercel.app](https://siliconpeaks-snow.vercel.app) responds publicly without a login. All four pages, robots and sitemap return 200. Source and package files return 404. Video byte ranges return 206. The live mobile check passes 17 assertions and decodes all 319 homepage images. Preview responses carry `X-Robots-Tag: noindex, nofollow`.
