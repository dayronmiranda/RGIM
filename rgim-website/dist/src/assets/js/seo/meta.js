/*
  SEO functionality module
  Extracted from app.js lines 357-461
*/

// SEO helpers
function upsertMetaByName(name, content) {
  let el = document.querySelector('meta[name="' + name + '"]')
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertMetaByProp(prop, content) {
  let el = document.querySelector('meta[property="' + prop + '"]')
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', prop)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href) {
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
  upsertMetaByProp('og:url', href)
}

function ensureAltLink(hreflang) {
  let link = document.querySelector('link[rel="alternate"][hreflang="' + hreflang + '"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'alternate')
    link.setAttribute('hreflang', hreflang)
    document.head.appendChild(link)
  }
  return link
}

export function updateHreflangLinks() {
  const base = location.origin + location.pathname
  const hash = location.hash || '#/home'
  const esUrl = base + '?lang=es' + hash
  const enUrl = base + '?lang=en' + hash
  const defUrl = base + hash
  ensureAltLink('es').setAttribute('href', esUrl)
  ensureAltLink('en').setAttribute('href', enUrl)
  ensureAltLink('x-default').setAttribute('href', defUrl)
}

export function updateSEO(route, state) {
  const seo = (state.t.seo && state.t.seo[route]) || (state.t.seo && state.t.seo.home) || null
  if (seo && seo.title) { document.title = seo.title }
  const desc = seo && seo.description ? seo.description : ''
  if (desc) {
    upsertMetaByName('description', desc)
    upsertMetaByName('twitter:description', desc)
    upsertMetaByProp('og:description', desc)
  }
  const title = seo && seo.title ? seo.title : document.title
  upsertMetaByName('twitter:title', title)
  upsertMetaByProp('og:title', title)
  // Robots per route
  const robots = route === 'admin' ? 'noindex,nofollow' : 'index,follow'
  upsertMetaByName('robots', robots)
  // Locale
  upsertMetaByProp('og:locale', state.lang === 'es' ? 'es_PA' : 'en_US')
  // Canonical per language (avoid hash)
  const canonical = location.origin + location.pathname + '?lang=' + (state.lang || 'es')
  setCanonical(canonical)
  // Hreflang alternates
  updateHreflangLinks()
  try { updateFAQSchema(route, state) } catch(e) {}
}

// JSON-LD: FAQ schema per route
export function updateFAQSchema(route, state) {
  const prev = document.getElementById('faq-jsonld')
  if (prev) prev.remove()
  if (route !== 'faq' && route !== 'home') return
  const faq = state.t.faq || {}
  const items = []
  for (let i = 1; i <= 10; i++) {
    const q = faq['q' + i], a = faq['a' + i]
    if (q && a) {
      items.push({
        '@type': 'Question',
        'name': q,
        'acceptedAnswer': { '@type': 'Answer', 'text': a }
      })
    }
  }
  if (items.length === 0) return
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': items
  }
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.id = 'faq-jsonld'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}