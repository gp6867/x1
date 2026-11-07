import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { promises as fs } from 'fs';
import path from 'path';
import { preview } from 'vite';

// ROUTE_MAP: original URL → what to actually render
// '/' renders '/home' (landing page) and saves as index.html
const ROUTE_MAP = {
  '/': '/home',
  '/home': '/home',
  '/pricing': '/pricing',
  '/blog': '/blog',
  '/blog/monsterx-vs-chatgpt-for-coding': '/blog/monsterx-vs-chatgpt-for-coding',
  '/blog/how-to-use-ai-for-python-debugging': '/blog/how-to-use-ai-for-python-debugging',
  '/blog/why-ai-needs-memory': '/blog/why-ai-needs-memory',
  '/blog/best-free-ai-tools-for-students': '/blog/best-free-ai-tools-for-students',
  '/blog/best-free-ai-tools-for-developers-2027': '/blog/best-free-ai-tools-for-developers-2027',
  '/blog/best-ai-tools-for-college-students-usa': '/blog/best-ai-tools-for-college-students-usa',
  '/tools/python-error-fixer': '/tools/python-error-fixer',
  '/tools/regex-generator': '/tools/regex-generator',
  '/tools/code-explainer': '/tools/code-explainer',
  '/compare/monsterx-vs-chatgpt': '/compare/monsterx-vs-chatgpt',
  '/alternatives/chatgpt': '/alternatives/chatgpt',
  '/guides/ai-coding-assistants': '/guides/ai-coding-assistants',
  '/fix/python-attributeerror': '/fix/python-attributeerror',
  '/fix/python-typeerror': '/fix/python-typeerror',
  '/fix/react-cannot-read-properties': '/fix/react-cannot-read-properties',
  '/fix/cors-error-express': '/fix/cors-error-express',
  '/fix/javascript-undefined-function': '/fix/javascript-undefined-function',
  '/about': '/about',
  '/contact': '/contact',
  '/privacy': '/privacy',
  '/terms': '/terms',
};

const PORT = 4173;
const DIST_DIR = 'dist';
const MIN_HTML_SIZE = 15000;

async function main() {
  console.log('🚀 Starting prerender...\n');

  try {
    await fs.access(path.join(DIST_DIR, 'index.html'));
  } catch {
    console.error('❌ dist/index.html not found. Run `vite build` first.');
    process.exit(0);
  }

  console.log(`📡 Starting preview server on port ${PORT}...`);
  const server = await preview({
    preview: { port: PORT, strictPort: true, host: 'localhost' },
  });
  console.log('   ✅ Server ready\n');

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
    console.warn('⚠️  No browser — skipping prerender:', err.message);
    server.httpServer.close();
    process.exit(0);
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent(
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  );

  let ok = 0;
  let failed = 0;

  for (const [route, targetRoute] of Object.entries(ROUTE_MAP)) {
    process.stdout.write(`📄 ${route} (via ${targetRoute})... `);
    try {
      await page.goto(`http://localhost:${PORT}${targetRoute}`, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      await new Promise((r) => setTimeout(r, 1500));

      const html = await page.content();

      if (html.length < MIN_HTML_SIZE) {
        throw new Error(`Too short (${html.length} bytes)`);
      }

      // CRITICAL: reject output if no real headings (catches chat UI case)
      if (!html.includes('<h1') || !html.includes('<h2')) {
        throw new Error('No h1/h2 — content not rendered (chat UI?)');
      }

      if (html.includes('STATIC H1 FOR BING CRAWLERS')) {
        throw new Error('Static fallback still present');
      }

      const filePath = route === '/'
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

  process.exit(0);
}

const watchdog = setTimeout(() => {
  console.warn('\n⚠️  Prerender timeout (90s) — deploy continues.');
  process.exit(0);
}, 90_000);
watchdog.unref();

main().catch((err) => {
  console.error('\n💥 Prerender crashed:', err);
  process.exit(0);
});
