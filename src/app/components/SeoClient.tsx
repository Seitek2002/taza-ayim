'use client';

import { useEffect, useMemo } from 'react';
import { selectSeo } from '../i18n/dictionaries';
import { useCurrentLang } from '../i18n/useLang';

function setMeta(name: string, content: string) {
  if (!content) return;
  let el = document.querySelector(
    `meta[name="${name}"]`,
  ) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setOg(property: string, content: string) {
  if (!content) return;
  let el = document.querySelector(
    `meta[property="${property}"]`,
  ) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function ensureJsonLd(id: string, json: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(json);
}

type SEO = {
  title: string;
  description: string;
  keywords: readonly string[] | string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  business?: {
    name: string;
    telephone: string;
    address: string;
    areaServed: string;
  };
};

export default function SeoClient() {
  const lang = useCurrentLang();
  const seo = useMemo<SEO>(() => selectSeo(lang), [lang]);

  useEffect(() => {
    // Title
    if (seo.title) document.title = seo.title;

    // Basic meta
    setMeta('description', seo.description);
    setMeta(
      'keywords',
      Array.isArray(seo.keywords) ? seo.keywords.join(', ') : '',
    );

    // Open Graph
    setOg('og:title', seo.ogTitle || seo.title);
    setOg('og:description', seo.ogDescription || seo.description);
    setOg('og:type', 'website');
    if (seo.ogImage) setOg('og:image', seo.ogImage);

    // Twitter
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', seo.twitterTitle || seo.title);
    setMeta('twitter:description', seo.twitterDescription || seo.description);
    if (seo.ogImage) setMeta('twitter:image', seo.ogImage);

    // JSON-LD LocalBusiness
    const business = seo.business;
    if (business) {
      ensureJsonLd('jsonld-localbusiness', {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: business.name,
        telephone: business.telephone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: business.address,
          addressCountry: 'KG',
        },
        areaServed: business.areaServed,
        url: typeof window !== 'undefined' ? window.location.origin : undefined,
        image: seo.ogImage ? [seo.ogImage] : undefined,
      });
    }
  }, [seo]);

  return null;
}
