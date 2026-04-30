#!/usr/bin/env node
// Usage: node download_uaelegis_pdf.cjs <id> <lang> <outputPath>

const fs = require('fs');
const path = require('path');
const os = require('os');

const puppeteer = require('puppeteer-extra');                 // ✅ use puppeteer-extra
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ensureDir = (p) => fs.mkdirSync(p, { recursive: true });

function looksPdf(buf) {
  if (!buf || buf.length < 5) return false;
  // %PDF-
  return buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46 && buf[4] === 0x2D;
}

function newestFile(dir) {
  try {
    const files = fs.readdirSync(dir);
    const arr = files
      .map((name) => {
        const full = path.join(dir, name);
        try {
          const st = fs.statSync(full);
          return { name, full, time: st.mtimeMs, size: st.size };
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => b.time - a.time);
    return arr[0] || null;
  } catch {
    return null;
  }
}

(async () => {
  const [, , idArg, langArg, outArg] = process.argv;
  if (!idArg || !langArg || !outArg) {
    console.error('Usage: node download_uaelegis_pdf.cjs <id> <lang> <outputPath>');
    process.exit(2);
  }

  const id = String(idArg).trim();
  const lang = String(langArg).toLowerCase().trim(); // ar|en
  const outPath = path.resolve(outArg);
  ensureDir(path.dirname(outPath));

  const base = 'https://uaelegislation.gov.ae';
  const origin = lang === 'en' ? `${base}/en` : `${base}/ar`;
  const detailUrl = `${origin}/legislations/${id}`;
  const downloadUrl = `${origin}/legislations/${id}/download`;

  // temp download folder (Chrome-managed)
  const tmpDir = path.join(os.tmpdir(), `uaelegis_dl_${Date.now()}_${process.pid}`);
  ensureDir(tmpDir);

  const chromePath = process.env.PUPPETEER_EXECUTABLE_PATH || undefined;
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      `--lang=${lang === 'en' ? 'en' : 'ar'}`,
      '--window-size=1280,1200',
    ],
    defaultViewport: { width: 1280, height: 1200 },
  });

  let saved = false;

  try {
    const page = await browser.newPage();

    // allow Chrome-managed downloads to tmpDir (best-effort across versions)
    try {
      const cdp = await page.target().createCDPSession();
      await cdp.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: tmpDir })
        .catch(async () => {
          const browserCdp = await browser.target().createCDPSession();
          await browserCdp.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: tmpDir }).catch(() => {});
        });
    } catch {}

    // anti-bot + headers
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });
    await page.setUserAgent(
      // slightly varied UA reduces static fingerprinting
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36'
    );
    await page.setExtraHTTPHeaders({
      'Accept-Language': lang === 'en' ? 'en,ar;q=0.8' : 'ar,en;q=0.8',
      'Upgrade-Insecure-Requests': '1',
      Referer: detailUrl,
    });

    // catch any PDF-like network response (incl. octet-stream, attachment, .pdf)
    page.on('response', async (res) => {
      if (saved) return;
      try {
        const headers = res.headers() || {};
        const ctype = (headers['content-type'] || '').toLowerCase();
        const dispo = (headers['content-disposition'] || '').toLowerCase();
        const url = res.url() || '';

        const isPdfish =
          ctype.includes('application/pdf') ||
          ctype.includes('application/octet-stream') ||
          dispo.includes('attachment') ||
          /\.pdf(\?|$)/i.test(url);

        if (!isPdfish) return;

        const buf = await res.buffer().catch(() => null);
        if (looksPdf(buf)) {
          fs.writeFileSync(outPath, buf);
          saved = true;
        }
      } catch {}
    });

    // go to detail
    await page.goto(detailUrl, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.evaluate(() => {
      // hide cookie or accessibility overlays if present
      const hide = (sel) => document.querySelectorAll(sel).forEach(el => el.style.display = 'none');
      hide('#onetrust-banner-sdk, .ot-sdk-container, .cookie, .cookies, .cookie-consent, [id^="uw-"], .uwy');
      document.body.style.overflow = 'auto';
    }).catch(() => {});
    await sleep(600);

    // try clicking native download link
    let clicked = false;
    try {
      const dlSel = 'a[href$="/download"], a[href*="/download?"]';
      const link = await page.$(dlSel);
      if (link) {
        await Promise.all([link.click(), sleep(300)]);
        clicked = true;
      }
    } catch {}

    // also wait explicitly for a PDFish response after click
    if (clicked && !saved) {
      await page.waitForResponse(
        (r) => {
          const h = r.headers() || {};
          const ct = (h['content-type'] || '').toLowerCase();
          const cd = (h['content-disposition'] || '').toLowerCase();
          const u = r.url() || '';
          return ct.includes('application/pdf') ||
                 ct.includes('application/octet-stream') ||
                 cd.includes('attachment') ||
                 /\.pdf(\?|$)/i.test(u);
        },
        { timeout: 20000 }
      ).catch(() => {});
    }

    // last-resort: direct navigation to /download
    if (!saved) {
      const res = await page.goto(downloadUrl, { waitUntil: 'networkidle2', timeout: 120000 }).catch(() => null);
      if (res) {
        const headers = res.headers() || {};
        const ct = (headers['content-type'] || '').toLowerCase();
        if (ct.includes('application/pdf') || ct.includes('application/octet-stream')) {
          const buf = await res.buffer().catch(() => null);
          if (looksPdf(buf)) {
            fs.writeFileSync(outPath, buf);
            saved = true;
          }
        }
      }
    }

    // ultra-fallback: fetch from inside the page with cookies (works if server validates session/headers)
    if (!saved) {
      const fetched = await page.evaluate(async (url) => {
        try {
          const r = await fetch(url, { credentials: 'include' });
          if (!r.ok) return null;
          const ct = (r.headers.get('content-type') || '').toLowerCase();
          const cd = (r.headers.get('content-disposition') || '').toLowerCase();
          if (!ct.includes('application/pdf') && !ct.includes('application/octet-stream') && !cd.includes('attachment')) {
            // still allow—some servers forget headers; we’ll verify %PDF- on Node side
          }
          const ab = await r.arrayBuffer();
          return Array.from(new Uint8Array(ab)); // serialize to plain array
        } catch (e) {
          return null;
        }
      }, downloadUrl).catch(() => null);

      if (fetched && Array.isArray(fetched) && fetched.length > 0) {
        const buf = Buffer.from(Uint8Array.from(fetched));
        if (looksPdf(buf)) {
          fs.writeFileSync(outPath, buf);
          saved = true;
        }
      }
    }

    // check Chrome download dir as fallback
    if (!saved) {
      const deadline = Date.now() + 60_000;
      let finalFile = null;
      while (Date.now() < deadline && !finalFile) {
        const nf = newestFile(tmpDir);
        if (nf && !nf.name.endsWith('.crdownload')) {
          try {
            const fb = fs.readFileSync(nf.full);
            if (looksPdf(fb)) finalFile = nf.full;
          } catch {}
        }
        if (!finalFile) await sleep(500);
      }
      if (finalFile) {
        fs.copyFileSync(finalFile, outPath);
        saved = true;
      }
    }

    if (saved) {
      const bytes = fs.existsSync(outPath) ? fs.statSync(outPath).size : 0;
      console.log(JSON.stringify({ ok: true, id, lang, path: outPath, bytes }));
      process.exit(0);
    }

    // dump HTML for debugging
    const dbg = outPath.replace(/\.pdf$/i, '.debug.html');
    fs.writeFileSync(dbg, await page.content());
    console.error('No completed PDF detected. Debug saved:', dbg);
    process.exit(5);
  } catch (e) {
    console.error('download_uaelegis_pdf error:', e && e.message ? e.message : String(e));
    process.exit(1);
  } finally {
    await browser.close().catch(() => {});
  }
})();
