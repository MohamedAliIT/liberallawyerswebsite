#!/usr/bin/env node
/**
 * Usage:
 *   node fetch_uaelegis_downloads.cjs <sector> <page>
 * Output JSON:
 *   { "items": [ {href,id,lang,title,number,year}, ... ] }
 */
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const fs = require('fs');
const path = require('path');
const process = require('process');

const BASE = 'https://uaelegislation.gov.ae';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ======================= Utils ======================= */
const toWesternDigits = (s = '') =>
  (s || '')
    .replace(/[\u0660-\u0669]/g, d => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u06F0-\u06F9]/g, d => String(d.charCodeAt(0) - 0x06F0));

const trimN = (s) => (s || '').replace(/\s+/g, ' ').trim();

function rxExtractFallback(input = '') {
  const S = toWesternDigits(trimN(input));
  const rxNumAr  = /(?:ال)?(?:قانون|مرسوم(?: بقانون)?|قرار(?: وزاري| مجلس الوزراء)?|نظام|لائحة|تعليمات)[^\.،\n]*?\sرقم\s*[\(（]?\s*([0-9]+(?:\/[0-9]+)?)\s*[\)）]?/ui;
  const rxYearAr = /(?:سنة|لسنة|لعام)\s*(20\d{2}|19\d{2})/u;

  const rxNumEn  = /\b(?:Decree(?:-Law)?|Law|Cabinet Decision|Resolution|Bylaw|Regulation)[^.\n]*?\b(?:No\.?|Number)\s*[\(（]?\s*([0-9]+(?:\/[0-9]+)?)\s*[\)）]?/i;
  const rxYearEn = /\b(?:of|for)\s*(20\d{2}|19\d{2})\b/i;

  const rxNumLoose = /\b(?:No\.?|Number)\s*[\(（]?\s*([0-9]+(?:\/[0-9]+)?)\s*[\)）]?/i;

  let number = null, year = null;
  const mNum  = S.match(rxNumAr) || S.match(rxNumEn) || S.match(rxNumLoose);
  const mYear = S.match(rxYearAr) || S.match(rxYearEn);
  if (mNum)  number = (mNum[1] || '').replace(/[^0-9/]/g, '').replace(/\/+$/,'');
  if (mYear) year   = parseInt(mYear[1], 10);
  return { number: number || null, year: Number.isFinite(year) ? year : null };
}

async function allowNet(page) {
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const t = req.resourceType();
    if (t === 'image' || t === 'media' || t === 'font') return req.abort();
    return req.continue();
  });
}

async function antiOverlay(page) {
  await page.evaluate(() => {
    const hide = (sel) => document.querySelectorAll(sel).forEach(el => el.style.display = 'none');
    hide('#onetrust-banner-sdk, .ot-sdk-container, .cookie, .cookies, .cookie-consent, [id^="uw-"], .uwy');
    document.body.style.overflow = 'auto';
  }).catch(() => {});
}

function collectIdsFromText(text = '') {
  const ids = new Set();
  const rx = /\/legislations\/(\d+)(?:[\/?#]|$)/gi;
  let m; while ((m = rx.exec(text))) ids.add(parseInt(m[1], 10));
  return Array.from(ids).filter(Boolean);
}

async function collectIdsFromDom(page) {
  return await page.evaluate(() => {
    const ids = new Set();
    document.querySelectorAll('a[href*="/legislations/"]').forEach(a => {
      const h = a.getAttribute('href') || a.href || '';
      const m = h && h.match(/\/legislations\/(\d+)(?:[\/?#]|$)/i);
      if (m) ids.add(parseInt(m[1], 10));
    });
    return Array.from(ids).filter(Boolean);
  });
}

/**
 * Pulls labeled values robustly from detail page (AR & EN):
 *   AR labels: "رقم التشريع", "سنة الإصدار"
 *   EN labels: "Legislation Number", "Year of Issuance"
 * Also scans generic dt/dd, th/td, info cards.
 */
async function extractDetail(page) {
  const title =
    await page.$eval('h1, .title, .page-title', el => (el.innerText || '').trim()).catch(async () => (await page.title()) || '');

  const kv = await page.evaluate(() => {
    const getTxt = (el) => (el && (el.innerText || el.textContent) || '').trim();
    const pairs = [];

    // dt/dd
    document.querySelectorAll('dt').forEach(dt => {
      const dd = dt.nextElementSibling && dt.nextElementSibling.tagName.toLowerCase() === 'dd' ? dt.nextElementSibling : null;
      const label = getTxt(dt), value = getTxt(dd);
      if (label && value) pairs.push([label, value]);
    });

    // th/td
    document.querySelectorAll('table').forEach(t => {
      t.querySelectorAll('tr').forEach(tr => {
        const th = tr.querySelector('th'), td = tr.querySelector('td');
        const label = getTxt(th), value = getTxt(td);
        if (label && value) pairs.push([label, value]);
      });
    });

    // list items like: <li><strong>Label</strong> Value</li>
    document.querySelectorAll('li').forEach(li => {
      const strong = li.querySelector('strong,b');
      const label = getTxt(strong);
      const value = strong ? getTxt(li).replace(label, '').trim() : '';
      if (label && value) pairs.push([label, value]);
    });

    return pairs;
  });

  const want = {
    // Arabic labels seen on the site
    ar: {
      number: ['رقم التشريع','رقم','رقم القانون','رقم المرسوم','رقم القرار'],
      year:   ['سنة الإصدار','السنة','سنة','لسنة'],
    },
    // English labels seen on the site
    en: {
      number: ['Legislation Number','Number','Law Number','Decree Number','Resolution Number'],
      year:   ['Year of Issuance','Year'],
    },
  };

  const findLabeled = (labels) => {
    for (const [label, value] of kv) {
      const L = (label || '').replace(/\s+/g,' ').trim();
      for (const target of labels) {
        if (L.includes(target)) return value;
      }
    }
    return null;
  };

  // detect language via html[lang] if present
  const lang = await page.evaluate(() => document.documentElement.getAttribute('lang') || '').catch(() => '');
  const prefer = (lang && lang.startsWith('ar')) ? want.ar : want.en;

  // 1) direct labeled extraction
  let number = findLabeled(prefer.number) || findLabeled(want.ar.number) || findLabeled(want.en.number);
  let year   = findLabeled(prefer.year)   || findLabeled(want.ar.year)   || findLabeled(want.en.year);

  if (number) number = toWesternDigits(number).replace(/[^0-9/]/g, '').replace(/\/+$/,'') || null;
  if (year) {
    const y = parseInt(toWesternDigits(year).match(/(19|20)\d{2}/)?.[0] || '', 10);
    year = Number.isFinite(y) ? y : null;
  }

  // 2) fallback to robust regex on the visible text
  if (!number || !year) {
    const blob = await page.evaluate(() => {
      const t = (document.body.innerText || '').trim();
      return t.length > 30000 ? t.slice(0, 30000) : t;
    }).catch(() => '');
    const rx = rxExtractFallback(title + '\n' + blob);
    if (!number) number = rx.number;
    if (!year)   year   = rx.year;
  }

  return {
    title: trimN(title),
    number: number || null,
    year: Number.isFinite(year) ? year : null,
  };
}

/* ======================= Args ======================= */
const sector = parseInt(process.argv[2] || '0', 10);
const pageNo = parseInt(process.argv[3] || '1', 10);
if (!sector || !pageNo) {
  console.error('Usage: node fetch_uaelegis_downloads.cjs <sector> <page>');
  process.exit(2);
}

/* ======================= Main ======================= */
(async () => {
  const urlAr = `${BASE}/ar/legislations?sector=${sector}&page=${pageNo}`;

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--lang=ar',
      '--window-size=1280,1600',
    ],
    defaultViewport: { width: 1280, height: 1600 },
  });

  const debugDir = path.join(process.cwd(), 'storage', 'app', 'uae_legislation', '__debug');
  fs.mkdirSync(debugDir, { recursive: true });

  try {
    const page = await browser.newPage();
    await allowNet(page);

    // Capture HTML/JSON XHR to regex IDs as fallback
    const bodies = [];
    page.on('response', async (res) => {
      try {
        const ct = (res.headers()['content-type'] || '').toLowerCase();
        if (ct.includes('json') || ct.includes('html')) {
          const txt = await res.text().catch(() => '');
          if (txt) bodies.push(txt.slice(0, 800000));
        }
      } catch {}
    });

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36');
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'ar,en;q=0.8' });

    // Listing
    await page.goto(urlAr, { waitUntil: 'networkidle2', timeout: 120000 });
    await antiOverlay(page);

    // Scroll to trigger lazy content
    await page.evaluate(async () => {
      await new Promise((r) => {
        let y = 0;
        const id = setInterval(() => {
          window.scrollTo(0, (y += 1000));
          if (y > document.body.scrollHeight + 2000) { clearInterval(id); r(); }
        }, 120);
      });
    }).catch(() => {});
    await sleep(600);

    // 1) DOM IDs
    let ids = await collectIdsFromDom(page);

    // 2) Page HTML regex
    if (!ids.length) {
      const html = await page.content();
      ids = collectIdsFromText(html);
    }

    // 3) XHR regex
    if (!ids.length && bodies.length) {
      for (const b of bodies) for (const id of collectIdsFromText(b)) ids.push(id);
      ids = Array.from(new Set(ids));
    }

    if (!ids.length) {
      const dbg = path.join(debugDir, `listing_sector${sector}_page${pageNo}.html`);
      fs.writeFileSync(dbg, await page.content());
      process.stdout.write(JSON.stringify({ items: [], debug: dbg }, null, 2));
      return;
    }

    const results = [];
    for (const id of ids) {
      for (const lang of ['ar', 'en']) {
        const detailUrl = `${BASE}/${lang}/legislations/${id}`;
        try {
          await page.goto(detailUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
          await antiOverlay(page);
          const det = await extractDetail(page);
          results.push({
            href: `${BASE}/${lang}/legislations/${id}/download`,
            id,
            lang,
            title: det.title,
            number: det.number,
            year: det.year,
          });
          await sleep(60);
        } catch {
          // ignore this lang if it fails
        }
      }
    }

    process.stdout.write(JSON.stringify({ items: results }, null, 2));
  } catch (e) {
    process.stdout.write(JSON.stringify({ items: [], error: String(e && e.message ? e.message : e) }, null, 2));
  } finally {
    await browser.close().catch(() => {});
  }
})();
