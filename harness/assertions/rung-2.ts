import { chromium, type Page } from 'playwright';
import type { AssertionResult } from './rung-1.ts';

async function check(page: Page): Promise<AssertionResult> {
  await page.goto('http://localhost:5173', { waitUntil: 'load', timeout: 15_000 });

  const videoLocator = page.locator('video').first();
  await videoLocator.waitFor({ state: 'attached', timeout: 10_000 });

  const details = await videoLocator.evaluate((video: HTMLVideoElement) => {
    return {
      muted: video.muted,
      autoplay: video.autoplay,
      loop: video.loop,
      poster: video.poster || null,
      playing: !video.paused && video.readyState >= 2,
    };
  });

  // Preview-image check: either the native poster attribute is set, OR
  // there's a visible <img> element inside the player's DOM subtree
  // (covers Mux Player's thumbnailTime-driven <img> overlay).
  const previewImageVisible = await page.evaluate(() => {
    const video = document.querySelector('video') as HTMLVideoElement | null;
    if (!video) return false;
    if (video.poster) return true;
    // Walk up from video to find a player container, then look for any <img> inside.
    let parent: HTMLElement | null = video.parentElement;
    for (let i = 0; i < 8 && parent; i++) {
      const imgs = parent.querySelectorAll('img');
      for (const img of Array.from(imgs)) {
        const rect = img.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) return true;
      }
      parent = parent.parentElement;
    }
    return false;
  });

  const result = {
    ...details,
    previewImageVisible,
  };

  const pass =
    result.muted === true &&
    result.autoplay === true &&
    result.loop === true &&
    previewImageVisible === true;

  return { pass, details: result };
}

async function main() {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
  try {
    const page = await browser.newPage();
    const result = await check(page);
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
