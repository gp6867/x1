import puppeteer from 'puppeteer';
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
const OUTPUT_DIR = 'dist-prerendered';
const MIN_HTML_SIZE = 3000;

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  console.log('🚀 Starting prerender...\n');

  // 1. Verify dist/ exists
  try {
    await fs.access('dist/index.html');
  } catch {
    console.error('❌ dist/index.html not found. Run `npm run build` first.');
    process.exit(1);
  }

  // 2. Copy all static assets from dist/ to dist-prerendered/
  console.log('📦 Copying static assets...');
  await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
  await copyDir('dist', OUTPUT_DIR);
  console.log('   ✅ Assets copied\n');

  // 3. Start preview server
  console.log(`📡 Starting preview server on port ${PORT}...`);
  const server = await preview({
    preview: { port: PORT, strictPort: true, host: 'localhost' },
  });
  console.log('   ✅ Server ready\n');

  // 4. Launch puppeteer
  console.log('🌐 Launching headless browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });
  console.log('   ✅ Browser ready\n');

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent(
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  );

  let ok = 0;
  let failed = 0;

  // 5. Render each route
  for (const route of ROUTES) {
    process.stdout.write(`📄 ${route}... `);
    try {
      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      // Give React extra time to finish rendering
      await new Promise((r) => setTimeout(r, 1500));

      const html = await page.content();

      if (html.length < MIN_HTML_SIZE) {
        throw new Error(`Too short (${html.length} bytes) — likely not rendered`);
      }

      const filePath =
        route === '/'
          ? path.join(OUTPUT_DIR, 'index.html')
          : path.join(OUTPUT_DIR, route.slice(1), 'index.html');

      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, html);

      console.log(`✅ (${html.length.toLocaleString()} bytes)`);
      ok++;
    } catch (err) {
      console.log(`❌ ${err.message}`);
      failed++;
    }
  }

  // 6. Cleanup
  await browser.close();
  server.httpServer.close();

  console.log(`\n🎉 Done! ${ok} succeeded, ${failed} failed.`);
  console.log(`📂 Output: ${OUTPUT_DIR}/\n`);

  if (ok === 0) {
    console.error('❌ All routes failed. Aborting.');
    process.exit(1);
  }

  if (failed > 0) {
    console.log(`⚠️  ${failed} route(s) failed but ${ok} succeeded — deploy will proceed.`);
  }
}

main().catch((err) => {
  console.error('\n💥 Prerender crashed:', err);
  process.exit(1);
});
