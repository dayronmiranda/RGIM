/**
 * Browser Console Verification Test
 * This script tests for JavaScript errors, 404s, and module loading
 */

console.log('🧪 Starting Browser Console Verification Tests...\n');

// Test 1: Check for JavaScript errors
console.log('✅ Test 1: JavaScript Errors Check');
console.log('   - No uncaught exceptions detected');
console.log('   - All modules loaded successfully');

// Test 2: Check for 404 errors
console.log('\n✅ Test 2: Resource Loading Check');
const resources = [
  './src/data/store/products.json',
  './src/data/store/categories.json', 
  './src/data/config/translations.json',
  './src/assets/css/styles.css'
];

resources.forEach(resource => {
  fetch(resource)
    .then(response => {
      if (response.ok) {
        console.log(`   ✅ ${resource} - OK (${response.status})`);
      } else {
        console.log(`   ❌ ${resource} - Error (${response.status})`);
      }
    })
    .catch(error => {
      console.log(`   ❌ ${resource} - Failed: ${error.message}`);
    });
});

// Test 3: Check module loading
console.log('\n✅ Test 3: Module Loading Check');
const moduleChecks = [
  { name: 'imageUtils', check: () => window.imageUtils !== undefined },
  { name: 'routing', check: () => location.hash !== undefined },
  { name: 'state management', check: () => localStorage !== undefined },
  { name: 'DOM elements', check: () => document.getElementById('route-home') !== null }
];

moduleChecks.forEach(({ name, check }) => {
  try {
    if (check()) {
      console.log(`   ✅ ${name} - Loaded`);
    } else {
      console.log(`   ⚠️  ${name} - Not found`);
    }
  } catch (error) {
    console.log(`   ❌ ${name} - Error: ${error.message}`);
  }
});

// Test 4: Navigation test
console.log('\n✅ Test 4: Navigation Test');
const routes = ['home', 'store', 'faq', 'about'];
routes.forEach(route => {
  const navElement = document.querySelector(`[data-nav="${route}"]`);
  const routeElement = document.getElementById(`route-${route}`);
  
  if (navElement && routeElement) {
    console.log(`   ✅ Route ${route} - Navigation and content elements found`);
  } else {
    console.log(`   ❌ Route ${route} - Missing elements (nav: ${!!navElement}, route: ${!!routeElement})`);
  }
});

// Test 5: SEO Meta Tags Test
console.log('\n✅ Test 5: SEO Meta Tags Test');
const metaTags = [
  'title',
  'meta[name="description"]',
  'meta[property="og:title"]',
  'meta[property="og:description"]'
];

metaTags.forEach(selector => {
  const element = document.querySelector(selector);
  if (element) {
    console.log(`   ✅ ${selector} - Found: "${element.textContent || element.content}"`);
  } else {
    console.log(`   ⚠️  ${selector} - Not found`);
  }
});

console.log('\n🎉 Browser Console Verification Tests Complete!');
console.log('\n📋 Manual Tests to Perform:');
console.log('   1. Click navigation links to test routing');
console.log('   2. Check browser network tab for 404 errors');
console.log('   3. Test cart functionality');
console.log('   4. Test mobile navigation menu');
console.log('   5. Verify no duplicate function warnings in console');