import { chromium, type Page } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { AssertionResult } from './rung-1.ts';

/**
 * Rung 5: No pass/fail assertion — this rung is judged by an LLM against the
 * reference image. We just capture a final screenshot and verify the app
 * didn't break (video still present, page didn't error).
 */
async function check(page: Page, screenshotPath: string): Promise<AssertionResult> {
  const pageErrors: string[] = [];
  page.on('pageerror', (err: Error) => pageErrors.push(err.message));

  await page.goto('http://localhost:5173', { waitUntil: 'load', timeout: 15_000 });

  const videoLocator = page.locator('video').first();
  await videoLocator.waitFor({ state: 'attached', timeout: 10_000 });
  await videoLocator.hover();
  await page.waitForTimeout(1_000);

  await mkdir(dirname(screenshotPath), { recursive: true });
  await page.screenshot({ path: screenshotPath, fullPage: false });

  const videoStillPresent = await page
    .locator('video')
    .first()
    .evaluate((v: HTMLVideoElement) => Boolean(v));

  const pass = videoStillPresent && pageErrors.length === 0;
  return {
    pass,
    details: {
      videoStillPresent,
      pageErrors,
      screenshotPath,
    },
  };
}

async function main() {
  const screenshotPath = process.argv[2] ?? '/tmp/rung-5.png';
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    const result = await check(page, screenshotPath);
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.pass ? 0 : 1);
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    console.log(JSON.stringify({ pass: false, details: {}, error: err }, null, 2));
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
