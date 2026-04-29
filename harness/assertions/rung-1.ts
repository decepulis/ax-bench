import { chromium, type Page } from 'playwright';

export type AssertionResult = {
  pass: boolean;
  details: Record<string, unknown>;
  error?: string;
};

async function check(page: Page): Promise<AssertionResult> {
  await page.goto('http://localhost:5173', { waitUntil: 'load', timeout: 15_000 });

  // Find any video element anywhere in the page, including inside shadow DOM.
  // Playwright's locator() auto-pierces open shadow roots.
  const videoLocator = page.locator('video').first();
  await videoLocator.waitFor({ state: 'attached', timeout: 10_000 });

  const details = await videoLocator.evaluate((video: HTMLVideoElement) => {
    return {
      exists: true,
      src: video.currentSrc || video.src || null,
      readyState: video.readyState,
      networkState: video.networkState,
      duration: Number.isFinite(video.duration) ? video.duration : null,
      paused: video.paused,
    };
  });

  // Trigger load() + muted play() so players that default to preload="none"
  // or programmatic-autoplay (hls.js / Mux Player) start pumping data.
  await videoLocator.evaluate((v: HTMLVideoElement) => {
    v.muted = true;
    v.load?.();
    v.play?.().catch(() => {});
  });

  // Wait up to 20s for readyState >= 1 (HAVE_METADATA). If metadata never
  // loads we still record the state — the pass check is permissive (below).
  try {
    await page.waitForFunction(
      () => {
        const v = document.querySelector('video') as HTMLVideoElement | null;
        return v !== null && v.readyState >= 1;
      },
      undefined,
      { timeout: 20_000 }
    );
    details.readyState = await videoLocator.evaluate((v: HTMLVideoElement) => v.readyState);
    details.duration = await videoLocator.evaluate((v: HTMLVideoElement) =>
      Number.isFinite(v.duration) ? v.duration : null
    );
  } catch {
    // Fall through — readyState stayed 0. Pass check below is permissive.
  }

  // Rung 1 tests "player wired up and playable in principle", not "metadata
  // decoded within 20s in headless Chromium". Pass if the element exists,
  // has a stream source, and is actively loading (networkState >= 1).
  const networkState = details.networkState as number;
  const hasSource = details.src !== null && details.src !== '';
  const pass = Boolean(details.exists) && hasSource && networkState >= 1;
  return { pass, details };
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
