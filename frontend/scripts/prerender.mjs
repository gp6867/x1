import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { promises as fs } from 'fs';
import path from 'path';
import { preview } from 'vite';

const ROUTES = [
  '/',
  '/home',
  '/pricing',
  '/blog',
  '/blog/monsterx-vs-chatgpt-for-coding',
  '/blog/how-to-use-ai-for-python-debugging',
  '/blog/why-ai-needs-memory',
  '/blog/best-free-ai-tools-for-students',
  '/blog/best-free-ai-tools-for-developers-2027',
  '/blog/best-ai-tools-for-college-students-usa',
  '/tools/python-error-fixer',
  '/tools/regex-generator',
  '/tools/code-explainer',
  '/compare/monsterx-vs-chatgpt',
  '/alternatives/chatgpt',
  '/guides/ai-coding-assistants',
  '/fix/python-attributeerror',
  '/fix/python-typeerror',
  '/fix/react-cannot-read-properties',
  '/fix/cors-error-express',
  '/fix/javascript-undefined-function',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
];

const PORT = 4173;
const DIST_DIR = 'dist'; // ← Output directly into dist, not dist-prerendered
const MIN_HTML_SIZE = 8000;

async function main() {
  console.log('🚀 Starting prerender...\n');

  // 1. Verify dist/ exists
  try {
    await fs.access(path.join(DIST_DIR, 'index.html'));
  } catch {
    console.error('❌ dist/index.html not found. Run `vite build` first.');
    process.exit(0); // don't fail deploy
  }

  // 2. Start preview server
  console.log(`📡 Starting preview server on port ${PORT}...`);
  const server = await preview({
    preview: { port: PORT, strictPort: true, host: 'localhost' },
  });
  console.log('   ✅ Server ready\n');

  // 3. Launch browser (works on Vercel + local Linux)
  console.log('🌐 Launching headless browser...');
  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    console.log('   ✅ Browser ready\n');
  } catch (err) {
    console.warn('⚠️  No browser available — skipping prerender:', err.message);
    console.warn('⚠️  Deploy will continue with original dist/ output.');
    server.httpServer.close();
    process.exit(0); // IMPORTANT: do not fail the deploy
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent(
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  );

  let ok = 0;
  let failed = 0;

  // 4. Render each route — write directly into dist/
  for (const route of ROUTES) {
    process.stdout.write(`📄 ${route}... `);
    try {
      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      await new Promise((r) => setTimeout(r, 1500));

      const html = await page.content();

      if (html.length < MIN_HTML_SIZE) {
        throw new Error(`Too short (${html.length} bytes)`);
      }

      if (html.includes('STATIC H1 FOR BING CRAWLERS')) {
        throw new Error('React did not render — static H1 still present');
      }

      const filePath =
        route === '/'
          ? path.join(DIST_DIR, 'index.html')
          : path.join(DIST_DIR, route.slice(1), 'index.html');

      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, html);

      console.log(`✅ (${html.length.toLocaleString()} bytes)`);
      ok++;
    } catch (err) {
      console.log(`❌ ${err.message}`);
      failed++;
    }
  }

  await browser.close();
  server.httpServer.close();

  console.log(`\n🎉 Done! ${ok} succeeded, ${failed} failed.`);
  console.log(`📂 Output: ${DIST_DIR}/\n`);

  if (failed > 0) {
    console.log(`⚠️  ${failed} route(s) failed but deploy will proceed.`);
  }

  process.exit(0); // always exit 0
}

// Watchdog: if prerender hangs > 90s, kill it and let deploy proceed
const watchdog = setTimeout(() => {
  console.warn('\n⚠️  Prerender timed out (90s) — skipping, deploy continues.');
  process.exit(0);
}, 90_000);
watchdog.unref();

main().catch((err) => {
  console.error('\n💥 Prerender crashed:', err);
  console.warn('⚠️  Deploy will continue with original dist/ output.');
  process.exit(0); // never fail the deploy
});
