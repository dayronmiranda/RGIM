# RGIM Website Code Cleanup Checklist

## Introduction

This checklist contains all the necessary changes to clean up the RGIM website codebase by removing redundant code, duplications, and unused elements. **All items in this checklist must be completed and then committed as a single cleanup commit** before proceeding with any new feature development.

The cleanup focuses on:
- Removing duplicate functions and modules
- Eliminating unused code and dependencies
- Standardizing code patterns
- Optimizing file structure
- Ensuring code integrity

---

## Core Module Duplications (Critical)

- [ ] Remove duplicate SEO functions (lines 209-280) from app.js and use only seo/meta.js module
- [ ] Remove duplicate cart operations from core/state.js stateHelpers object and use only store/cart.js
- [ ] Eliminate getImagePath() and createImageElement() functions from app.js and migrate logic to modules/imageUtils.js
- [ ] Remove duplicate aiSearch function from app.js (exists in modules/aiSearch.js and store/search.js)
- [ ] Remove duplicate updateSEO function from app.js (exists in seo/meta.js)
- [ ] Remove duplicate updateHreflangLinks function from app.js (exists in seo/meta.js)
- [ ] Remove duplicate updateFAQSchema function from app.js (exists in seo/meta.js)
- [ ] Remove duplicate aiSearch function from store/search.js (exists in modules/aiSearch.js)

## Legacy Code Removal

- [ ] Remove legacy wrapper functions from app.js as specified in TODO.md
- [ ] Remove duplicate cart operations (addToCart, removeFromCart, etc.) from core/state.js stateHelpers
- [ ] Eliminate unused callback parameters in openMobileCartModal function
- [ ] Remove unused callback functions in mobile/navigation.js
- [ ] Clean up unused imports in mobile/navigation.js

## Module Integration and Cleanup

- [ ] Verify if modules/cacheManager.js is actually being used, remove if not
- [ ] Verify if modules/lazyLoader.js is fully integrated, integrate or remove
- [ ] Remove global window.imageUtils instance if not being used
- [ ] Remove unused AISearch class export in modules/aiSearch.js if only instance is used
- [ ] Unify search functions to avoid duplication between modules

## Function and Variable Cleanup

- [ ] Remove duplicate fmtCurrency function between modules
- [ ] Remove duplicate toast functions
- [ ] Remove duplicate modal functions between mobile and desktop
- [ ] Remove duplicate validation functions
- [ ] Remove unused function parameters in rendering functions
- [ ] Remove unused callback functions
- [ ] Remove orphaned event listeners with no associated elements
- [ ] Remove unused configuration objects

## CSS and Styling Cleanup

- [ ] Remove duplicate styles between input.css and styles.css
- [ ] Remove unused CSS rules in styles.css
- [ ] Remove duplicate keyframes (spin, fadeIn, etc.)
- [ ] Remove unused CSS classes not referenced in HTML
- [ ] Consolidate duplicate media query rules for mobile
- [ ] Remove redundant Tailwind CSS configurations

## HTML Structure Cleanup

- [ ] Remove duplicate Tailwind CSS scripts (CDN and local)
- [ ] Remove duplicate or redundant meta tags
- [ ] Clean up unnecessary HTML comments
- [ ] Remove unused hidden div elements
- [ ] Remove placeholder elements not being used

## JavaScript Code Standards

- [ ] Remove unused event listeners in app.js
- [ ] Remove declared but unused variables
- [ ] Remove uncalled callback functions
- [ ] Remove unused imports/exports in modules
- [ ] Standardize function declaration style (arrow functions vs function declarations)
- [ ] Standardize error handling across all modules
- [ ] Consolidate async/await vs Promises usage
- [ ] Unify variable and function naming conventions

## File System and Dependencies

- [ ] Remove unused dependencies from package.json
- [ ] Remove unnecessary .gitkeep files
- [ ] Remove unused example or placeholder files
- [ ] Remove completed TODO comments
- [ ] Clean up unused imports in all modules

## Debug and Development Cleanup

- [ ] Remove unnecessary console.log debugging statements
- [ ] Remove obsolete or redundant comments
- [ ] Remove commented-out code that's no longer needed
- [ ] Remove completed TODOs from codebase

---

## Code Integrity Test

After completing all cleanup tasks, run the following tests to ensure code integrity:

### Automated Tests

- [ ] Run `npm install` to verify all dependencies resolve correctly
- [ ] Run `npm run build-css-prod` to ensure CSS builds without errors
- [ ] Run `npm run build` to verify the complete build process works
- [ ] Run `npm run serve` and verify the development server starts correctly

### Manual Functionality Tests

- [ ] Navigate to all routes (/, /store, /faq, /about, /admin) and verify they load
- [ ] Test cart functionality: add items, modify quantities, remove items
- [ ] Test mobile navigation menu opens and closes correctly
- [ ] Test product search functionality works
- [ ] Test category filtering works
- [ ] Test checkout form submission creates history entries
- [ ] Test admin login and dashboard functionality
- [ ] Test language switching between ES/EN
- [ ] Verify all images load correctly with fallbacks
- [ ] Test responsive design on mobile devices

### Browser Console Tests

- [ ] Verify no JavaScript errors in browser console
- [ ] Verify no 404 errors for missing resources
- [ ] Verify no duplicate function warnings
- [ ] Check that all modules load correctly
- [ ] Verify SEO meta tags update correctly on route changes

### Performance Verification

- [ ] Verify page load times are acceptable
- [ ] Check that CSS file size is optimized
- [ ] Verify no duplicate network requests
- [ ] Confirm lazy loading works for images

### Final Verification

- [ ] Commit all changes with message: "feat: comprehensive code cleanup and deduplication"
- [ ] Create a backup branch before cleanup: `git checkout -b backup-before-cleanup`
- [ ] Verify git diff shows only intentional removals and no accidental deletions
- [ ] Test build and deployment process works correctly

---

**Note**: This cleanup should result in a significantly smaller, more maintainable codebase with no loss of functionality. All tests must pass before considering the cleanup complete.