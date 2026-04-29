import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

/**
 * Best-effort page screenshot. Unlike the rung assertions, this never throws
 * on missing elements — if the page loads at all, we capture it. Used to give
 * judges a per-rung visual record even when the rung didn't strictly pass.
 */
async function main() {
  const screenshotPath = process.argv[2] ?? '/tmp/screenshot.png';
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    await page.goto('http://localhost:5173', { waitUntil: 'load', timeout: 15_000 });
    // Give the app a moment to render, but don't require any specific element.
    await page.waitForTimeout(1_500);
    await mkdir(dirname(screenshotPath), { recursive: true });
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(JSON.stringify({ ok: true, screenshotPath }));
    process.exit(0);
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    console.log(JSON.stringify({ ok: false, error: err }));
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
