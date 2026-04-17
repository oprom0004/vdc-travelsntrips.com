#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

function normalizeBase(url) {
  return url.replace(/\/$/, '');
}

function normalizePath(input) {
  try {
    const u = new URL(input);
    return `${u.pathname.replace(/\/$/, '') || '/'}${u.search}`;
  } catch {
    return input;
  }
}

function remapToBaseUrl(url, baseUrl) {
  const base = new URL(baseUrl);
  const target = new URL(url);
  return `${base.origin}${target.pathname}${target.search}`;
}

function unique(arr) {
  return [...new Set(arr)];
}

function decodeXml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    const text = await res.text();
    return { ok: res.ok, status: res.status, text };
  } catch (error) {
    return { ok: false, status: 0, text: '', error: String(error) };
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchRawWithTimeout(url, timeoutMs, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      method: options.method || 'GET',
      redirect: options.redirect || 'follow',
    });
    const text = options.readText === false ? '' : await res.text();
    return { ok: res.ok, status: res.status, text, headers: res.headers };
  } catch (error) {
    return { ok: false, status: 0, text: '', headers: new Headers(), error: String(error) };
  } finally {
    clearTimeout(timeout);
  }
}

function extractSitemapUrls(xml) {
  const matches = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)];
  return unique(matches.map((m) => decodeXml(m[1].trim())));
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    const entries = fs.readdirSync(cur, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(cur, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else {
        out.push(full);
      }
    }
  }
  return out;
}

function isDynamicSegment(segment) {
  return segment.startsWith('[') && segment.endsWith(']');
}

function isRouteGroup(segment) {
  return segment.startsWith('(') && segment.endsWith(')');
}

function discoverStaticRoutes(cwd) {
  const appDir = path.join(cwd, 'app');
  const files = walk(appDir).filter((f) => /\\page\.tsx$/.test(f));
  const routes = [];

  for (const file of files) {
    const rel = path.relative(appDir, file).replace(/\\/g, '/');
    const withoutPage = rel === 'page.tsx' ? '' : rel.replace(/\/page\.tsx$/, '');
    const segments = withoutPage ? withoutPage.split('/') : [];

    if (segments.some((s) => isDynamicSegment(s))) continue;

    const cleanSegments = segments.filter((s) => !isRouteGroup(s));
    const route = `/${cleanSegments.join('/')}`.replace(/\/+/g, '/');
    routes.push(route === '/' ? '/' : route.replace(/\/$/, ''));
  }

  return unique(routes).sort();
}

function extractMeta(html, name) {
  return extractMetaTagContent(html, 'name', name);
}

function extractMetaTagContent(html, attrName, attrValue) {
  const attr = escapeRegExp(attrName);
  const value = escapeRegExp(attrValue);
  const tagRe = new RegExp(`<meta\\b[^>]*\\b${attr}\\s*=\\s*["']${value}["'][^>]*>`, 'i');
  const tagMatch = html.match(tagRe);
  if (!tagMatch) return '';
  const contentMatch = tagMatch[0].match(/\bcontent\s*=\s*["']([^"']*)["']/i);
  return contentMatch ? contentMatch[1].trim() : '';
}

function extractMetaProperty(html, propertyName) {
  return extractMetaTagContent(html, 'property', propertyName);
}

function extractTitle(html) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  return m ? m[1].replace(/\s+/g, ' ').trim() : '';
}

function extractCanonical(html) {
  const m = html.match(/<link[^>]+rel=["'][^"']*canonical[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>/i);
  return m ? m[1].trim() : '';
}

function extractH1Count(html) {
  return [...html.matchAll(/<h1\b/gi)].length;
}

function extractImgTags(html) {
  return [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
}

function extractImgSrcs(html) {
  return [...html.matchAll(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi)]
    .map((m) => m[1].trim())
    .filter(Boolean);
}

function getAltValue(imgTag) {
  const m = imgTag.match(/\balt\s*=\s*["']([^"']*)["']/i);
  return m ? m[1].trim() : null;
}

function extractFaviconHref(html) {
  const m = html.match(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>/i);
  return m ? m[1].trim() : '';
}

function resolveUrlMaybeRelative(input, baseUrl) {
  try {
    return new URL(input, baseUrl).toString();
  } catch {
    return '';
  }
}

function isLocalhostLike(baseUrl) {
  try {
    const host = new URL(baseUrl).hostname.toLowerCase();
    return host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0';
  } catch {
    return false;
  }
}

function normalizeInternalPath(pathValue) {
  if (!pathValue) return '';
  const clean = pathValue.split('#')[0] || '';
  if (!clean) return '';
  return clean.replace(/\/$/, '') || '/';
}

function extractAnchorHrefs(html) {
  const matches = [...html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi)];
  return matches.map((m) => m[1].trim()).filter(Boolean);
}

function extractJsonLdBlocks(html) {
  const blocks = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim();
    if (raw) blocks.push(raw);
  }
  return blocks;
}

function flattenJsonLd(value) {
  if (Array.isArray(value)) return value.flatMap((item) => flattenJsonLd(item));
  if (value && typeof value === 'object') {
    if (Array.isArray(value['@graph'])) return flattenJsonLd(value['@graph']);
    return [value];
  }
  return [];
}

function detectNextImageFormatsConfig(cwd) {
  const candidates = [
    'next.config.ts',
    'next.config.js',
    'next.config.mjs',
    'next.config.cjs',
  ];
  const existing = candidates.find((file) => fs.existsSync(path.join(cwd, file)));
  if (!existing) return { found: false, hasWebp: false, hasAvif: false, file: '' };

  const fullPath = path.join(cwd, existing);
  const content = fs.readFileSync(fullPath, 'utf8');
  const hasFormats = /formats\s*:\s*\[/.test(content);
  const hasWebp = /['"]image\/webp['"]/.test(content);
  const hasAvif = /['"]image\/avif['"]/.test(content);

  return { found: hasFormats, hasWebp, hasAvif, file: existing };
}

function detectFontStrategy(cwd) {
  const appDir = path.join(cwd, 'app');
  const srcDir = path.join(cwd, 'src');
  const codeFiles = [...walk(appDir), ...walk(srcDir)].filter((f) => /\.(ts|tsx|js|jsx)$/.test(f));
  const cssFiles = [...walk(appDir), ...walk(srcDir)].filter((f) => /\.css$/.test(f));

  let nextFontGoogleImports = 0;
  let nextFontLocalImports = 0;
  let remoteGoogleCssImports = 0;
  const googleImportFiles = [];
  const localImportFiles = [];
  const remoteCssFiles = [];

  for (const file of codeFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (/from\s+['"]next\/font\/google['"]/.test(content)) {
      nextFontGoogleImports += 1;
      if (googleImportFiles.length < 5) googleImportFiles.push(path.relative(cwd, file).replace(/\\/g, '/'));
    }
    if (/from\s+['"]next\/font\/local['"]/.test(content)) {
      nextFontLocalImports += 1;
      if (localImportFiles.length < 5) localImportFiles.push(path.relative(cwd, file).replace(/\\/g, '/'));
    }
  }

  for (const file of cssFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (/fonts\.googleapis\.com/i.test(content) || /@import\s+url\(['"]https?:\/\/fonts\.googleapis\.com/i.test(content)) {
      remoteGoogleCssImports += 1;
      if (remoteCssFiles.length < 5) remoteCssFiles.push(path.relative(cwd, file).replace(/\\/g, '/'));
    }
  }

  return {
    nextFontGoogleImports,
    nextFontLocalImports,
    remoteGoogleCssImports,
    googleImportFiles,
    localImportFiles,
    remoteCssFiles,
  };
}

function detectHardcodedYears(cwd, currentYear) {
  const appDir = path.join(cwd, 'app');
  const srcDir = path.join(cwd, 'src');
  const files = [...walk(appDir), ...walk(srcDir)].filter((f) => /\.(ts|tsx|js|jsx|md|mdx|css)$/.test(f));
  const yearRe = /\b20\d{2}\b/g;
  const samples = [];

  for (const file of files) {
    const rel = path.relative(cwd, file).replace(/\\/g, '/');
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    for (let idx = 0; idx < lines.length; idx += 1) {
      const line = lines[idx];
      if (line.includes('new Date().getFullYear')) continue;
      if (line.includes('currentYear')) continue;

      const hits = [...line.matchAll(yearRe)];
      for (const hit of hits) {
        const year = Number(hit[0]);
        if (year < 2000 || year > 2099) continue;
        if (/\b(setTimeout|setInterval|timeout|duration|delay|milliseconds|ms)\b/i.test(line)) continue;
        samples.push({
          file: rel,
          line: idx + 1,
          year,
          text: line.trim().slice(0, 120),
        });
      }
    }
  }

  const stale = samples.filter((x) => x.year !== currentYear);
  return {
    total: samples.length,
    staleCount: stale.length,
    samples: samples.slice(0, 10),
  };
}

function detectExternalImageRefsInSource(cwd) {
  const appDir = path.join(cwd, 'app');
  const srcDir = path.join(cwd, 'src');
  const files = [...walk(appDir), ...walk(srcDir)].filter((f) => /\.(ts|tsx|js|jsx|md|mdx|css)$/.test(f));
  const imageUrlRe = /https?:\/\/[^\s"'`)}]+?\.(png|jpe?g|webp|avif|gif|svg)(\?[^\s"'`)]+)?/gi;
  const hits = [];

  for (const file of files) {
    const rel = path.relative(cwd, file).replace(/\\/g, '/');
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    for (let idx = 0; idx < lines.length; idx += 1) {
      const line = lines[idx];
      const matches = [...line.matchAll(imageUrlRe)];
      for (const m of matches) {
        hits.push({
          file: rel,
          line: idx + 1,
          url: m[0],
        });
        if (hits.length >= 30) return hits;
      }
    }
  }
  return hits;
}

function buildResult() {
  return {
    score: 100,
    checks: [],
    issues: [],
    pages: [],
  };
}

function pushCheck(result, name, ok, detail = '') {
  result.checks.push({ name, ok, detail });
}

function addIssue(result, severity, code, message, url = '') {
  result.issues.push({ severity, code, message, url });
}

function applyPenalty(result, points) {
  result.score = Math.max(0, result.score - points);
}

function bucketIssues(issues) {
  return {
    error: issues.filter((x) => x.severity === 'error'),
    warn: issues.filter((x) => x.severity === 'warn'),
  };
}

function printHuman(result, options) {
  const { error, warn } = bucketIssues(result.issues);

  console.log('SEO Audit (Next.js)');
  console.log(`Base URL: ${options.baseUrl}`);
  console.log(`Sitemap: ${options.sitemapUrl}`);
  console.log(`Pages Audited: ${result.pages.length}`);
  console.log(`Score: ${result.score}/100`);
  console.log('');

  console.log('Checks:');
  for (const check of result.checks) {
    const mark = check.ok ? 'PASS' : 'FAIL';
    const detail = check.detail ? ` - ${check.detail}` : '';
    console.log(`- [${mark}] ${check.name}${detail}`);
  }

  console.log('');
  if (error.length === 0 && warn.length === 0) {
    console.log('No issues found.');
    return;
  }

  if (error.length) {
    console.log('Errors:');
    for (const issue of error) {
      console.log(`- ${issue.code}: ${issue.message}${issue.url ? ` (${issue.url})` : ''}`);
    }
    console.log('');
  }

  if (warn.length) {
    console.log('Warnings:');
    for (const issue of warn) {
      console.log(`- ${issue.code}: ${issue.message}${issue.url ? ` (${issue.url})` : ''}`);
    }
  }
}

async function checkAssetReachable(url, timeoutMs, cache) {
  if (!url) return { ok: false, status: 0, contentType: '' };
  if (cache.has(url)) return cache.get(url);

  let res = await fetchRawWithTimeout(url, timeoutMs, { method: 'HEAD', readText: false });
  if (res.status === 405 || res.status === 501) {
    res = await fetchRawWithTimeout(url, timeoutMs, { method: 'GET', readText: false });
  }
  const out = {
    ok: res.ok,
    status: res.status,
    contentType: (res.headers.get('content-type') || '').toLowerCase(),
  };
  cache.set(url, out);
  return out;
}

async function crawlInternalPaths(baseUrl, timeoutMs, maxPages = 120) {
  const origin = new URL(baseUrl).origin;
  const queue = ['/'];
  const visited = new Set();
  const discovered = new Set(['/']);

  while (queue.length > 0 && visited.size < maxPages) {
    const currentPath = queue.shift();
    if (!currentPath || visited.has(currentPath)) continue;
    visited.add(currentPath);

    const url = `${origin}${currentPath === '/' ? '' : currentPath}`;
    const res = await fetchWithTimeout(url, timeoutMs);
    if (!res.ok) continue;
    const hrefs = extractAnchorHrefs(res.text);

    for (const href of hrefs) {
      if (
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        href.startsWith('#')
      ) {
        continue;
      }

      let nextUrl;
      try {
        nextUrl = new URL(href, origin);
      } catch {
        continue;
      }
      if (nextUrl.origin !== origin) continue;
      const pathValue = normalizeInternalPath(`${nextUrl.pathname}${nextUrl.search}`);
      if (!pathValue) continue;
      discovered.add(pathValue);
      if (!visited.has(pathValue)) queue.push(pathValue);
    }
  }

  return discovered;
}

async function run() {
  const argv = parseArgs(process.argv.slice(2));
  const cwd = process.cwd();

  const baseUrl = normalizeBase(String(argv.base || process.env.SEO_BASE_URL || 'http://127.0.0.1:3000'));
  const sitemapUrl = String(argv.sitemap || process.env.SEO_SITEMAP_URL || `${baseUrl}/sitemap.xml`);
  const timeoutMs = Number(argv.timeout || process.env.SEO_TIMEOUT_MS || 10000);
  const maxPages = Number(argv['max-pages'] || process.env.SEO_MAX_PAGES || 500);
  const failUnder = Number(argv['fail-under'] || process.env.SEO_FAIL_UNDER || 85);
  const useSitemapHost = Boolean(argv['use-sitemap-host']);
  const json = Boolean(argv.json);
  const assetCheckCache = new Map();
  const localhostMode = isLocalhostLike(baseUrl);

  const result = buildResult();

  const robotsRes = await fetchWithTimeout(`${baseUrl}/robots.txt`, timeoutMs);
  pushCheck(result, 'robots.txt reachable', robotsRes.ok, `status=${robotsRes.status}`);
  if (!robotsRes.ok) {
    addIssue(result, 'error', 'ROBOTS_UNREACHABLE', `robots.txt returned status ${robotsRes.status}`);
    applyPenalty(result, 10);
  } else if (!/sitemap:/i.test(robotsRes.text)) {
    addIssue(result, 'warn', 'ROBOTS_NO_SITEMAP', 'robots.txt has no Sitemap directive');
    applyPenalty(result, 3);
  }

  const sitemapRes = await fetchWithTimeout(sitemapUrl, timeoutMs);
  pushCheck(result, 'sitemap.xml reachable', sitemapRes.ok, `status=${sitemapRes.status}`);
  if (!sitemapRes.ok) {
    addIssue(result, 'error', 'SITEMAP_UNREACHABLE', `sitemap.xml returned status ${sitemapRes.status}`);
    applyPenalty(result, 20);
  }

  const sitemapUrls = sitemapRes.ok ? extractSitemapUrls(sitemapRes.text) : [];
  pushCheck(result, 'sitemap has URLs', sitemapUrls.length > 0, `count=${sitemapUrls.length}`);
  if (sitemapUrls.length === 0) {
    addIssue(result, 'error', 'SITEMAP_EMPTY', 'No URL entries found in sitemap.xml');
    applyPenalty(result, 15);
  }

  const discoveredRoutes = discoverStaticRoutes(cwd);
  const sitemapPaths = new Set(sitemapUrls.map((u) => normalizePath(u)));
  const missingInSitemap = discoveredRoutes.filter((route) => !sitemapPaths.has(route));

  pushCheck(result, 'static app routes included in sitemap', missingInSitemap.length === 0, `missing=${missingInSitemap.length}`);
  if (missingInSitemap.length > 0) {
    for (const route of missingInSitemap) {
      addIssue(result, 'warn', 'SITEMAP_MISSING_ROUTE', 'Static route missing in sitemap', route);
    }
    applyPenalty(result, Math.min(20, missingInSitemap.length * 2));
  }

  const pagesToAudit = sitemapUrls
    .slice(0, Math.max(1, maxPages))
    .map((url) => (useSitemapHost ? url : remapToBaseUrl(url, baseUrl)));

  const homeRes = await fetchWithTimeout(baseUrl, timeoutMs);
  if (homeRes.ok) {
    const faviconHref = extractFaviconHref(homeRes.text);
    pushCheck(result, 'favicon link declared', Boolean(faviconHref));
    if (!faviconHref) {
      addIssue(result, 'warn', 'FAVICON_MISSING', 'No favicon <link rel=\"icon\"> found on homepage', baseUrl);
      applyPenalty(result, 2);
    } else {
      const faviconUrl = resolveUrlMaybeRelative(faviconHref, baseUrl);
      const faviconRes = await fetchWithTimeout(faviconUrl, timeoutMs);
      pushCheck(result, 'favicon file reachable', faviconRes.ok, `status=${faviconRes.status}`);
      if (!faviconRes.ok) {
        addIssue(result, 'warn', 'FAVICON_UNREACHABLE', `Favicon returned status ${faviconRes.status}`, faviconUrl);
        applyPenalty(result, 2);
      }
    }
  } else {
    pushCheck(result, 'favicon link declared', false, 'homepage unreachable');
    addIssue(result, 'warn', 'FAVICON_UNCHECKED', 'Homepage unreachable, favicon check skipped', baseUrl);
    applyPenalty(result, 1);
  }

  const imageConfig = detectNextImageFormatsConfig(cwd);
  pushCheck(
    result,
    'next/image modern formats configured',
    imageConfig.found && imageConfig.hasWebp && imageConfig.hasAvif,
    imageConfig.file ? `file=${imageConfig.file}` : 'next.config not found'
  );
  if (!imageConfig.found || !imageConfig.hasWebp || !imageConfig.hasAvif) {
    addIssue(
      result,
      'warn',
      'IMAGE_FORMATS_NOT_OPTIMAL',
      'Recommended Next image formats (image/webp + image/avif) are not fully configured',
      imageConfig.file || ''
    );
    applyPenalty(result, 2);
  }

  const fontStrategy = detectFontStrategy(cwd);
  pushCheck(
    result,
    'no remote Google Fonts CSS import',
    fontStrategy.remoteGoogleCssImports === 0,
    `count=${fontStrategy.remoteGoogleCssImports}`
  );
  if (fontStrategy.remoteGoogleCssImports > 0) {
    addIssue(
      result,
      'warn',
      'FONT_REMOTE_IMPORT',
      'Detected remote Google Fonts CSS imports. Prefer self-hosted fonts or next/font/local.',
      fontStrategy.remoteCssFiles[0] || ''
    );
    applyPenalty(result, 3);
  }

  pushCheck(
    result,
    'font source is local/self-hosted friendly',
    fontStrategy.nextFontLocalImports > 0 || fontStrategy.nextFontGoogleImports === 0,
    `next/font/local=${fontStrategy.nextFontLocalImports}, next/font/google=${fontStrategy.nextFontGoogleImports}`
  );
  if (fontStrategy.nextFontGoogleImports > 0 && fontStrategy.nextFontLocalImports === 0) {
    addIssue(
      result,
      'warn',
      'FONT_NOT_LOCAL',
      'Project uses next/font/google without next/font/local. For strict localization, prefer local font files.',
      fontStrategy.googleImportFiles[0] || ''
    );
    applyPenalty(result, 2);
  }

  const hardcodedYears = detectHardcodedYears(cwd, new Date().getFullYear());
  pushCheck(
    result,
    'no hardcoded calendar year in app/src content',
    hardcodedYears.total === 0,
    `found=${hardcodedYears.total}`
  );
  if (hardcodedYears.total > 0) {
    const first = hardcodedYears.samples[0];
    const label = first ? `${first.file}:${first.line}` : '';
    const code = hardcodedYears.staleCount > 0 ? 'YEAR_HARDCODED_STALE' : 'YEAR_HARDCODED';
    const message =
      hardcodedYears.staleCount > 0
        ? `Detected ${hardcodedYears.staleCount} stale hardcoded year value(s). Prefer dynamic year rendering.`
        : `Detected hardcoded year value(s). Prefer dynamic year rendering with new Date().getFullYear().`;

    addIssue(result, 'warn', code, message, label);
    applyPenalty(result, Math.min(5, hardcodedYears.total));
  }

  const externalImageRefs = detectExternalImageRefsInSource(cwd);
  pushCheck(result, 'source code image refs are local-first', externalImageRefs.length === 0, `external_refs=${externalImageRefs.length}`);
  if (externalImageRefs.length > 0) {
    const first = externalImageRefs[0];
    addIssue(
      result,
      'warn',
      'IMAGE_EXTERNAL_SOURCE_REF',
      `Detected ${externalImageRefs.length} external image URL reference(s) in source code. Prefer local /public assets.`,
      `${first.file}:${first.line}`
    );
    applyPenalty(result, Math.min(6, externalImageRefs.length));
  }

  const homeHtml = homeRes.ok ? homeRes.text : '';
  const ogTitle = extractMetaProperty(homeHtml, 'og:title');
  const ogDescription = extractMetaProperty(homeHtml, 'og:description');
  const ogImage = extractMetaProperty(homeHtml, 'og:image');
  const ogUrl = extractMetaProperty(homeHtml, 'og:url');
  const twitterCard = extractMeta(homeHtml, 'twitter:card');
  const twitterImage = extractMeta(homeHtml, 'twitter:image');

  const socialMetaComplete = Boolean(ogTitle && ogDescription && ogImage && ogUrl && twitterCard && twitterImage);
  pushCheck(result, 'home OG/Twitter core tags present', socialMetaComplete);
  if (!socialMetaComplete) {
    addIssue(
      result,
      'warn',
      'SOCIAL_META_MISSING',
      'Missing one or more social tags on homepage (og:title/description/image/url or twitter:card/image).',
      baseUrl
    );
    applyPenalty(result, 3);
  }

  if (ogImage) {
    const rawOgImageUrl = resolveUrlMaybeRelative(ogImage, baseUrl);
    let ogImageUrl = rawOgImageUrl;
    if (!useSitemapHost && rawOgImageUrl) {
      try {
        const u = new URL(rawOgImageUrl);
        ogImageUrl = `${new URL(baseUrl).origin}${u.pathname}${u.search}`;
      } catch {
        ogImageUrl = rawOgImageUrl;
      }
    }
    const ogImageCheck = await checkAssetReachable(ogImageUrl, timeoutMs, assetCheckCache);
    pushCheck(result, 'home og:image reachable', ogImageCheck.ok, `status=${ogImageCheck.status}`);
    if (!ogImageCheck.ok || !ogImageCheck.contentType.startsWith('image/')) {
      addIssue(result, 'warn', 'SOCIAL_IMAGE_INVALID', 'og:image is unreachable or not an image content type.', ogImageUrl);
      applyPenalty(result, 2);
    }
  }

  const jsonLdRawBlocks = extractJsonLdBlocks(homeHtml);
  pushCheck(result, 'home JSON-LD present', jsonLdRawBlocks.length > 0, `count=${jsonLdRawBlocks.length}`);
  if (jsonLdRawBlocks.length === 0) {
    addIssue(result, 'warn', 'JSONLD_MISSING', 'No JSON-LD block found on homepage.', baseUrl);
    applyPenalty(result, 3);
  } else {
    let parseErrors = 0;
    const entities = [];
    for (const raw of jsonLdRawBlocks) {
      try {
        const parsed = JSON.parse(raw);
        entities.push(...flattenJsonLd(parsed));
      } catch {
        parseErrors += 1;
      }
    }
    if (parseErrors > 0) {
      addIssue(result, 'warn', 'JSONLD_PARSE_ERROR', `Failed to parse ${parseErrors} JSON-LD block(s).`, baseUrl);
      applyPenalty(result, 2);
    }

    const hasContextType = entities.some((e) => e['@context'] && e['@type']);
    pushCheck(result, 'home JSON-LD has @context and @type', hasContextType);
    if (!hasContextType) {
      addIssue(result, 'warn', 'JSONLD_INCOMPLETE', 'JSON-LD entities missing @context or @type.', baseUrl);
      applyPenalty(result, 2);
    }

    const hasOrgOrWebsite = entities.some((e) => {
      const t = String(e['@type'] || '').toLowerCase();
      return (t === 'organization' || t === 'website') && e.name && e.url;
    });
    pushCheck(result, 'home JSON-LD core entity fields', hasOrgOrWebsite);
    if (!hasOrgOrWebsite) {
      addIssue(
        result,
        'warn',
        'JSONLD_CORE_FIELDS_MISSING',
        'Homepage JSON-LD should include Organization/WebSite with name and url.',
        baseUrl
      );
      applyPenalty(result, 2);
    }
  }

  const base = new URL(baseUrl);
  if (!localhostMode) {
    if (base.protocol === 'https:') {
      const httpCandidate = `http://${base.host}/`;
      const httpRes = await fetchRawWithTimeout(httpCandidate, timeoutMs, { redirect: 'manual', readText: false });
      const location = httpRes.headers.get('location') || '';
      const redirectsToHttps = httpRes.status >= 300 && httpRes.status < 400 && location.startsWith('https://');
      pushCheck(result, 'http redirects to https', redirectsToHttps, `status=${httpRes.status}`);
      if (!redirectsToHttps) {
        addIssue(result, 'warn', 'REDIRECT_HTTP_TO_HTTPS', 'HTTP to HTTPS redirect is not enforced.', httpCandidate);
        applyPenalty(result, 3);
      }
    } else {
      pushCheck(result, 'http redirects to https', true, 'base URL is not https');
    }

    const host = base.hostname;
    const isWww = host.startsWith('www.');
    const altHost = isWww ? host.slice(4) : `www.${host}`;
    const altUrl = `${base.protocol}//${altHost}/`;
    const altRes = await fetchRawWithTimeout(altUrl, timeoutMs, { redirect: 'manual', readText: false });
    const altLoc = altRes.headers.get('location') || '';
    const hostCanonicalized = altRes.status >= 300 && altRes.status < 400 && altLoc.includes(base.host);
    pushCheck(result, 'www/non-www host canonicalized', hostCanonicalized, `status=${altRes.status}`);
    if (!hostCanonicalized) {
      addIssue(result, 'warn', 'REDIRECT_HOST_CANONICAL', 'www and non-www are not clearly canonicalized.', altUrl);
      applyPenalty(result, 2);
    }
  } else {
    pushCheck(result, 'http redirects to https', true, 'skipped on localhost');
    pushCheck(result, 'www/non-www host canonicalized', true, 'skipped on localhost');
  }

  const sampleUrl = sitemapUrls.find((u) => normalizePath(u) !== '/') || '';
  const samplePath = sampleUrl ? normalizeInternalPath(normalizePath(sampleUrl)) : '/';
  if (samplePath && samplePath !== '/') {
    const noSlashUrl = `${base.origin}${samplePath}`;
    const slashUrl = `${base.origin}${samplePath}/`;
    const noSlashRes = await fetchRawWithTimeout(noSlashUrl, timeoutMs, { redirect: 'manual', readText: false });
    const slashRes = await fetchRawWithTimeout(slashUrl, timeoutMs, { redirect: 'manual', readText: false });
    const slashCanonicalized =
      (slashRes.status >= 300 && slashRes.status < 400) || (noSlashRes.status >= 300 && noSlashRes.status < 400);
    pushCheck(result, 'trailing slash canonicalized', slashCanonicalized, `sample=${samplePath}`);
    if (!slashCanonicalized && noSlashRes.status === 200 && slashRes.status === 200) {
      addIssue(
        result,
        'warn',
        'REDIRECT_TRAILING_SLASH',
        'Both trailing-slash and non-trailing-slash URLs are directly accessible for sample path.',
        samplePath
      );
      applyPenalty(result, 2);
    }
  } else {
    pushCheck(result, 'trailing slash canonicalized', true, 'no sample page');
  }

  if (!localhostMode) {
    const crawlSet = await crawlInternalPaths(baseUrl, timeoutMs, 140);
    const orphanPaths = [...sitemapPaths].filter((p) => !crawlSet.has(p));
    pushCheck(result, 'sitemap pages discoverable via internal links', orphanPaths.length === 0, `orphans=${orphanPaths.length}`);
    if (orphanPaths.length > 0) {
      addIssue(
        result,
        'warn',
        'ORPHAN_PAGES',
        `Detected ${orphanPaths.length} sitemap URL(s) not found through internal crawl from homepage.`,
        orphanPaths[0]
      );
      applyPenalty(result, Math.min(6, orphanPaths.length));
    }
  } else {
    pushCheck(result, 'sitemap pages discoverable via internal links', true, 'skipped on localhost');
  }

  const perfStart = Date.now();
  const perfRes = await fetchRawWithTimeout(baseUrl, timeoutMs);
  const ttfbMs = Date.now() - perfStart;
  const htmlBytes = Buffer.byteLength(perfRes.text || '', 'utf8');
  const scriptCount = [...(perfRes.text || '').matchAll(/<script\b/gi)].length;
  const stylesheetCount = [...(perfRes.text || '').matchAll(/<link\b[^>]*rel=["'][^"']*stylesheet[^"']*["']/gi)].length;
  pushCheck(result, 'home lightweight performance baseline', perfRes.ok, `ttfb=${ttfbMs}ms html=${htmlBytes}B scripts=${scriptCount}`);
  if (perfRes.ok && !localhostMode) {
    if (ttfbMs > 800) {
      addIssue(result, 'warn', 'PERF_TTFB_HIGH', `Homepage TTFB is high (${ttfbMs}ms).`, baseUrl);
      applyPenalty(result, 2);
    }
    if (htmlBytes > 200000) {
      addIssue(result, 'warn', 'PERF_HTML_HEAVY', `Homepage HTML is heavy (${htmlBytes} bytes).`, baseUrl);
      applyPenalty(result, 2);
    }
    if (scriptCount > 25) {
      addIssue(result, 'warn', 'PERF_SCRIPT_COUNT', `Homepage has many script tags (${scriptCount}).`, baseUrl);
      applyPenalty(result, 1);
    }
    if (stylesheetCount > 8) {
      addIssue(result, 'warn', 'PERF_STYLESHEET_COUNT', `Homepage has many stylesheet links (${stylesheetCount}).`, baseUrl);
      applyPenalty(result, 1);
    }
  }

  for (const url of pagesToAudit) {
    const pageRes = await fetchWithTimeout(url, timeoutMs);
    const pageInfo = {
      url,
      status: pageRes.status,
      title: '',
      descriptionLength: 0,
      h1Count: 0,
      imgCount: 0,
      imgMissingAlt: 0,
      canonical: '',
    };

    if (!pageRes.ok) {
      addIssue(result, 'error', 'PAGE_UNREACHABLE', `Page returned status ${pageRes.status}`, url);
      applyPenalty(result, 5);
      result.pages.push(pageInfo);
      continue;
    }

    const html = pageRes.text;
    const title = extractTitle(html);
    const description = extractMeta(html, 'description');
    const canonical = extractCanonical(html);
    const h1Count = extractH1Count(html);
    const imgs = extractImgTags(html);
    const imgSrcs = extractImgSrcs(html);
    const missingAltCount = imgs.filter((img) => getAltValue(img) === null).length;
    const emptyAltCount = imgs.filter((img) => getAltValue(img) === '').length;
    const externalImgSrcCount = imgSrcs.filter((src) => /^https?:\/\//i.test(src)).length;

    pageInfo.title = title;
    pageInfo.descriptionLength = description.length;
    pageInfo.h1Count = h1Count;
    pageInfo.imgCount = imgs.length;
    pageInfo.imgMissingAlt = missingAltCount;
    pageInfo.canonical = canonical;

    if (!title) {
      addIssue(result, 'error', 'MISSING_TITLE', 'Missing <title>', url);
      applyPenalty(result, 3);
    } else if (title.length < 20 || title.length > 65) {
      addIssue(result, 'warn', 'TITLE_LENGTH', `Title length out of recommended range (20-65): ${title.length}`, url);
      applyPenalty(result, 1);
    }

    if (!description) {
      addIssue(result, 'error', 'MISSING_DESCRIPTION', 'Missing meta description', url);
      applyPenalty(result, 3);
    } else if (description.length < 70 || description.length > 170) {
      addIssue(result, 'warn', 'DESCRIPTION_LENGTH', `Description length out of recommended range (70-170): ${description.length}`, url);
      applyPenalty(result, 1);
    }

    if (!canonical) {
      addIssue(result, 'error', 'MISSING_CANONICAL', 'Missing canonical link', url);
      applyPenalty(result, 3);
    } else {
      const canonicalPath = normalizePath(canonical);
      const pagePath = normalizePath(url);
      if (canonicalPath !== pagePath) {
        addIssue(result, 'warn', 'CANONICAL_PATH_MISMATCH', `Canonical path ${canonicalPath} differs from page path ${pagePath}`, url);
        applyPenalty(result, 2);
      }
    }

    if (h1Count === 0) {
      addIssue(result, 'error', 'MISSING_H1', 'No <h1> found', url);
      applyPenalty(result, 2);
    } else if (h1Count > 1) {
      addIssue(result, 'warn', 'MULTIPLE_H1', `Found ${h1Count} <h1> elements`, url);
      applyPenalty(result, 1);
    }

    if (missingAltCount > 0) {
      addIssue(result, 'warn', 'IMAGE_ALT_MISSING', `${missingAltCount} image(s) missing alt attribute`, url);
      applyPenalty(result, Math.min(4, missingAltCount));
    }
    if (emptyAltCount > 0) {
      addIssue(result, 'warn', 'IMAGE_ALT_EMPTY', `${emptyAltCount} image(s) have empty alt text`, url);
      applyPenalty(result, Math.min(2, emptyAltCount));
    }
    if (externalImgSrcCount > 0) {
      addIssue(
        result,
        'warn',
        'IMAGE_EXTERNAL_RUNTIME',
        `${externalImgSrcCount} rendered image(s) use absolute external URLs. Prefer local/CDN strategy consistency.`,
        url
      );
      applyPenalty(result, Math.min(2, externalImgSrcCount));
    }

    const robotsMeta = extractMeta(html, 'robots');
    if (/noindex/i.test(robotsMeta)) {
      addIssue(result, 'warn', 'ROBOTS_NOINDEX', `Page has robots=${robotsMeta}`, url);
      applyPenalty(result, 1);
    }

    result.pages.push(pageInfo);
  }

  result.score = Math.max(0, Math.round(result.score));

  if (json) {
    console.log(JSON.stringify({
      options: { baseUrl, sitemapUrl, timeoutMs, maxPages, failUnder, useSitemapHost },
      result,
    }, null, 2));
  } else {
    printHuman(result, { baseUrl, sitemapUrl });
  }

  if (result.score < failUnder || result.issues.some((x) => x.severity === 'error')) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error('SEO audit failed:', error);
  process.exitCode = 1;
});
