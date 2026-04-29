import { chromium, type Page } from 'playwright';
import type { AssertionResult } from './rung-1.ts';

/**
 * Rung 3 is styling — accent color #ff3e00 and a semi-transparent black control bar.
 * Checks are intentionally loose: we accept any control/chrome element whose
 * computed color resolves to rgb(255, 62, 0), and any element whose background
 * is rgba(0, 0, 0, <1). Both libraries' styling approaches differ; the test is
 * "is the intent reflected anywhere in the rendered tree."
 */
async function check(page: Page): Promise<AssertionResult> {
  await page.goto('http://localhost:5173', { waitUntil: 'load', timeout: 15_000 });

  const videoLocator = page.locator('video').first();
  await videoLocator.waitFor({ state: 'attached', timeout: 10_000 });

  // Hover the player so controls are visible, then pause a moment for transitions.
  await videoLocator.hover();
  await page.waitForTimeout(500);

  const scan = await page.evaluate(() => {
    // esbuild/tsx wraps named function declarations with __name() for stack
    // traces; that wrapper leaks into the browser closure. Polyfill as no-op.
    // biome-ignore lint/suspicious/noExplicitAny: browser polyfill
    (globalThis as any).__name = (globalThis as any).__name ?? (<T>(fn: T) => fn);

    const TARGET_COLOR = 'rgb(255, 62, 0)';

    const visited = new Set<Node>();
    const matches: { tag: string; classes: string; kind: 'color' | 'bg' }[] = [];
    let semiTransparentBlackFound = false;

    function walk(root: ParentNode | ShadowRoot) {
      const elements = root.querySelectorAll('*');
      for (const el of Array.from(elements) as HTMLElement[]) {
        if (visited.has(el)) continue;
        visited.add(el);

        const cs = getComputedStyle(el);

        const color = cs.color;
        const fill = cs.fill;
        const stroke = cs.stroke;
        const borderColor = cs.borderColor;
        const bg = cs.backgroundColor;

        if ([color, fill, stroke, borderColor].some((c) => c === TARGET_COLOR)) {
          matches.push({
            tag: el.tagName.toLowerCase(),
            classes: el.className?.toString() ?? '',
            kind: 'color',
          });
        }

        // rgba(0, 0, 0, a) with 0 < a < 1
        const m = bg.match(/^rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*([\d.]+)\s*\)$/);
        if (m) {
          const alpha = Number.parseFloat(m[1]!);
          if (alpha > 0 && alpha < 1) {
            semiTransparentBlackFound = true;
            matches.push({
              tag: el.tagName.toLowerCase(),
              classes: el.className?.toString() ?? '',
              kind: 'bg',
            });
          }
        }

        // Recurse into shadow roots that Playwright's pierce-selector can see but
        // getComputedStyle can't traverse on its own.
        if (el.shadowRoot) {
          walk(el.shadowRoot);
        }
      }
    }

    walk(document);

    return {
      accentMatches: matches.filter((m) => m.kind === 'color'),
      bgMatches: matches.filter((m) => m.kind === 'bg'),
      semiTransparentBlackFound,
    };
  });

  const pass = scan.accentMatches.length > 0 && scan.semiTransparentBlackFound;
  return { pass, details: scan };
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
