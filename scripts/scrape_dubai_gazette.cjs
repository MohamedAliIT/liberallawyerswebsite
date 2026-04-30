#!/usr/bin/env node
/**
 * scripts/scrape_dubai_gazette.js
 * CommonJS + Puppeteer
 *
 * Args:
 *   1) YEAR      : number (required)
 *   2) DEEP      : 0|1  (navigate carousel to fetch all cards)
 *   3) RESOLVE   : 0|1  (try to resolve direct PDF link from viewer page)
 *
 * Environment:
 *   PUPPETEER_EXECUTABLE_PATH  -> full path to Chrome/Chromium (optional)
 *
 * Output: JSON to stdout
 *   { items: [{ title, viewer_url, pdf_url, issue_no }, ...] }
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const YEAR = parseInt(process.argv[2] || '0', 10);
const DEEP = parseInt(process.argv[3] || '0', 10);
const RESOLVE = parseInt(process.argv[4] || '0', 10);

if (!YEAR || String(YEAR).length !== 4) {
  console.error('DUBAI_GAZETTE_ERROR: invalid or missing YEAR');
  process.exit(1);
}

const BASE = 'https://dlp.dubai.gov.ae/ar/Pages/OfficialGazette.aspx';
const DEBUG_DIR = path.resolve(process.cwd(), 'storage', 'app', 'dubai_gazette_debug');

function ensureDir(p) { try { fs.mkdirSync(p, { recursive: true }); } catch { /* ignore */ } }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function saveSnapshot(page, filename) {
  try {
    ensureDir(DEBUG_DIR);
    const html = await page.content();
    fs.writeFileSync(path.join(DEBUG_DIR, filename), html, 'utf8');
    console.log(`[debug] saved snapshot: ${path.join(DEBUG_DIR, filename)}`);
  } catch (e) {
    // ignore
  }
}

async function launchBrowser() {
  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || undefined;
  return puppeteer.launch({
    headless: true,
    executablePath,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-features=site-per-process',
    ],
  });
}

async function clickDecade(page, decade) {
  // يحاول العثور على بطاقة "1960s" .. "1970s" .. إلخ بالاعتماد على النص
  await page.evaluate((d) => {
    const nodes = Array.from(document.querySelectorAll('.owl-years .years_col'));
    const node = nodes.find(n => (n.textContent || '').replace(/\s+/g, ' ').includes(`${d}s`));
    if (node) node.click();
  }, decade);
  await sleep(1000);
}

async function clickYear(page, year) {
  // في SharePoint السيناريو المعتاد: زر داخل years-listing يطلق __doPostBack
  await page.evaluate((y) => {
    const wrap = document.getElementById('ctl00_ctl43_g_9253b2c5_8b88_4967_af9b_d0a469bebc8c_yearLayout');
    if (!wrap) return;
    // يبحث عن data-value="year_1964"
    let btn = wrap.querySelector(`[data-value="year_${y}"]`);
    if (btn) { btn.click(); return; }

    // fallback: أي عنصر نصه يساوي السنة
    const all = Array.from(wrap.querySelectorAll('*'));
    const target = all.find(n => /^\s*\d{4}\s*$/.test(n.textContent || '') && (n.textContent || '').trim() === String(y));
    if (target) target.click();
  }, year);
  await sleep(1400);
}

async function grabVisibleCards(page) {
  return await page.evaluate(() => {
    const out = [];
    const root = document.querySelector('#ctl00_ctl43_g_9253b2c5_8b88_4967_af9b_d0a469bebc8c_pdfLayout');
    if (!root) return out;

    // بطاقات الكاروسيل
    const cards = root.querySelectorAll('.owl-years-2 .owl-stage .owl-item .item, .owl-years-2 .owl-stage .owl-item');
    cards.forEach(card => {
      const txt = (card.textContent || '').replace(/\s+/g, ' ').trim();

      // رابط العارض الرسمي
      let href = null;
      const a = card.querySelector('a[href*="PDFViewer.aspx"]');
      if (a) href = a.getAttribute('href');

      // رقم العدد: الدائرة السفلية عادةً فيها رقم مفرد
      let issueNo = null;
      const numberNode = Array.from(card.querySelectorAll('*'))
        .find(n => /^\s*\d{1,3}\s*$/.test(n.textContent || ''));
      if (numberNode) {
        const m = (numberNode.textContent || '').match(/\d{1,3}/);
        if (m) issueNo = parseInt(m[0], 10);
      }
      // احتياطي: أول رقم واضح في النص
      if (!issueNo) {
        const m2 = txt.match(/^\s*(\d{1,3})\b/);
        if (m2) issueNo = parseInt(m2[1], 10);
      }

      // عنوان مبسّط (أزل عبارة عرض PDF وحجم الملف)
      let title = txt.replace(/عرض\s+كملف\s+PDF.*$/i, '').trim();

      if (href) {
        out.push({
          title,
          viewer_url: href.startsWith('http') ? href : new URL(href, location.origin).toString(),
          pdf_url: null,
          issue_no: issueNo || null,
        });
      }
    });

    return out;
  });
}

async function harvestAllCards(page, deep) {
  const seen = new Map(); // key = viewer_url
  const push = (arr) => arr.forEach(it => { if (it.viewer_url && !seen.has(it.viewer_url)) seen.set(it.viewer_url, it); });

  push(await grabVisibleCards(page));

  if (!deep) return Array.from(seen.values());

  let noGain = 0;
  const MAX_ROUNDS = 80;

  for (let i = 0; i < MAX_ROUNDS; i++) {
    const clicked = await page.evaluate(() => {
      const next = document.querySelector('.owl-years-2 .owl-next');
      if (next) { next.click(); return true; }
      return false;
    });
    if (!clicked) break;

    await sleep(900);
    const batch = await grabVisibleCards(page);

    const before = seen.size;
    push(batch);
    const added = seen.size - before;

    if (added === 0) {
      noGain++;
      if (noGain >= 2) break; // يبدو أننا دُرنا على كل العناصر
    } else {
      noGain = 0;
    }
  }

  return Array.from(seen.values());
}

async function resolvePdfDirect(browser, baseViewerUrl) {
  // محاولة خفيفة لاستخراج رابط PDF من صفحة العارض
  // نراقب الشبكة لأي طلب pdf/ashx أو تحميل ملف
  const page = await browser.newPage();
  let pdf = null;

  const tryPick = (url) => {
    if (!url) return;
    const u = url.toLowerCase();
    if (u.endsWith('.pdf') || u.includes('getfile') || u.includes('download')) {
      pdf = url;
    }
  };

  page.on('response', async (resp) => {
    tryPick(resp.url());
    // أحياناً يكون PDF ضمن redirect
    const req = resp.request();
    if (req) tryPick(req.url());
  });

  try {
    await page.goto(baseViewerUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await sleep(800);

    // أحيانًا يوجد رابط تحميل واضح داخل الصفحة
    const href = await page.evaluate(() => {
      const a1 = document.querySelector('a[href$=".pdf"]');
      if (a1) return a1.href;
      const link = Array.from(document.querySelectorAll('a'))
        .map(a => a.href)
        .find(h => /GetFile|download|\.pdf/i.test(h || ''));
      return link || null;
    });
    if (href) pdf = href;
  } catch {
    // ignore
  } finally {
    await page.close().catch(() => {});
  }

  return pdf;
}

(async () => {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  page.setDefaultTimeout(90000);

  // تجاهل تحذير responseType غير المدعوم
  page.on('console', (msg) => {
    const t = msg.text();
    if (!/moz-chunked-arraybuffer/i.test(t)) {
      // يمكنك الطباعة إن رغبت
      // console.log('[console]', t);
    }
  });

  console.log('Opening index …');
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await saveSnapshot(page, 'year-index-initial.html');

  // اختر العقدة والسنة
  const decade = Math.floor(YEAR / 10) * 10;
  await clickDecade(page, decade);
  await saveSnapshot(page, `after-decade-${decade}.html`);

  await clickYear(page, YEAR);
  await saveSnapshot(page, `after-year-${YEAR}.html`);

  // انتظر ظهور حاوية الكاروسيل
  await page.waitForSelector('#ctl00_ctl43_g_9253b2c5_8b88_4967_af9b_d0a469bebc8c_pdfLayout', { timeout: 120000 });
  await sleep(600);

  // اجمع كل البطاقات
  const itemsRaw = await harvestAllCards(page, !!DEEP);

  // ترتيب مبدئي مستقر
  const items = itemsRaw
    .map(it => ({
      title: it.title || '',
      viewer_url: it.viewer_url,
      pdf_url: null,
      issue_no: it.issue_no,
    }))
    .sort((a, b) => {
      const A = a.issue_no ?? 9999;
      const B = b.issue_no ?? 9999;
      if (A !== B) return A - B;
      return String(a.viewer_url).localeCompare(String(b.viewer_url));
    });

  // (اختياري) حل رابط الـ PDF
  if (RESOLVE && items.length) {
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      try {
        const pdf = await resolvePdfDirect(browser, it.viewer_url);
        if (pdf) it.pdf_url = pdf;
      } catch {
        // ignore
      }
    }
  }

  console.log(JSON.stringify({ items }, null, 2));

  await browser.close();
})().catch(async (e) => {
  console.error('DUBAI_GAZETTE_ERROR:', e.message);
  process.exit(1);
});
