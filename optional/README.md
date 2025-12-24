# Optional / Unused Files

This directory contains files that were moved from the active codebase because they are no longer used in the current Single Page Application (SPA) architecture.

## Why These Files Are Here

The application was converted from a traditional multi-page website to a modern SPA using hash-based routing and web components. These files are remnants from the old architecture.

## Directory Structure

```
optional/
├── legacy-html/        # Standalone HTML pages (replaced by SPA components)
├── unused-js/          # JavaScript files no longer imported or used
└── unused-css/         # CSS files only used by the old HTML pages
```

## Unused HTML Files (7 files)

All moved on: 2025-12-24

### `legacy-html/home.html`
- **Reason**: Replaced by `<page-home>` component loaded via `#/home` route
- **Note**: Legacy standalone page with old-style navigation

### `legacy-html/spots.html`
- **Reason**: Replaced by `<page-spots>` component loaded via `#/spots` route
- **Note**: Contained hardcoded spot cards, now dynamic

### `legacy-html/plan.html`
- **Reason**: Replaced by `<page-plan>` component loaded via `#/plan` route
- **Note**: Referenced wrong paths (../code/) that don't exist in current structure

### `legacy-html/guide_sign_up.html`
- **Reason**: Replaced by `<page-guide-signup>` component loaded via `#/guide-signup` route
- **Note**: Legacy standalone registration page

### `legacy-html/guides.html`
- **Reason**: Replaced by `<page-guides>` component loaded via `#/guides` route
- **Note**: Nearly empty placeholder file

### `legacy-html/spot-info.html`
- **Reason**: Replaced by `<page-spot-info>` component loaded via `#/spot-info` route
- **Note**: Had wrong imports (paths started with ../code/)

### `legacy-html/profile-guide.html`
- **Reason**: Replaced by `<page-guide-profile>` component loaded via `#/guide-profile` route
- **Note**: Contained wrong component paths

## Unused JavaScript Files (4 files)

### `unused-js/ag-plan.js`
- **Reason**: File was completely empty (0 bytes)
- **Note**: Likely leftover from refactoring

### `unused-js/header.js`
- **Reason**: Old version of ag-header.js, incorrectly placed in styles/ directory
- **Note**: Used old navigation (home.html, spots.html), replaced by component/ag-header.js with hash routing

### `unused-js/ag-theme-toggle.js`
- **Reason**: Theme toggle functionality is now built into ag-header.js component
- **Note**: Not imported in index.html, only referenced in old HTML files

### `unused-js/ag-guide-info.js`
- **Reason**: Defines `guide-info` custom element but never used in SPA
- **Note**: Only used by profile-guide.html which itself is unused

## Unused CSS Files (3 files)

### `unused-css/plan.css`
- **Reason**: Only linked in the unused plan.html
- **Note**: SPA's page-plan.js uses inline styles instead

### `unused-css/guide_sign_up.css`
- **Reason**: Only linked in the unused guide_sign_up.html
- **Note**: SPA's page-guide-signup.js uses inline styles instead

### `unused-css/profile-guide.css`
- **Reason**: Only linked in the unused profile-guide.html
- **Note**: SPA's page-guide-profile.js uses inline styles instead

## Can I Delete These Files?

**Yes**, these files are safe to delete. They are kept here only for reference or in case you need to restore old functionality.

### To permanently delete:
```bash
rm -rf optional/
```

### To restore a file:
```bash
# Example: restore home.html
cp optional/legacy-html/home.html frontend/src/
```

## Current Active Architecture

The application now uses:
- **Entry Point**: `frontend/src/index.html`
- **Routing**: Hash-based routing in `frontend/src/router/app-router.js`
- **Pages**: Web components in `frontend/src/pages/page-*.js`
- **Components**: Reusable components in `frontend/src/component/`
- **Styles**: Component-scoped inline styles + global CSS in `frontend/src/styles/`

---

**Last Updated**: 2025-12-24
**Files Moved**: 14 total (7 HTML, 4 JavaScript, 3 CSS)
**Space Saved**: ~50KB of unused code removed from active codebase
