import { chromium, type Page } from 'playwright';
import type { AssertionResult } from './rung-1.ts';

/**
 * Rung 4: Fullscreen button hidden, Share button added with console.log('shared') on click.
 * Behavioral check only — the "did it eject" judgment is handled by an LLM judge
 * against the code + transcript, not by Playwright.
 */
async function check(page: Page): Promise<AssertionResult> {
  const consoleMessages: { text: string; type: string }[] = [];
  page.on('console', (msg: import('playwright').ConsoleMessage) =>
    consoleMessages.push({ text: msg.text(), type: msg.type() })
  );

  await page.goto('http://localhost:5173', { waitUntil: 'load', timeout: 15_000 });

  const videoLocator = page.locator('video').first();
  await videoLocator.waitFor({ state: 'attached', timeout: 10_000 });
  await videoLocator.hover();
  await page.waitForTimeout(500);

  const scan = await page.evaluate(() => {
    // esbuild/tsx wraps named function declarations with __name() for stack
    // traces; that wrapper leaks into the browser closure. Polyfill as no-op.
    // biome-ignore lint/suspicious/noExplicitAny: browser polyfill
    (globalThis as any).__name = (globalThis as any).__name ?? (<T>(fn: T) => fn);

    const visited = new Set<Node>();
    const buttons: { tag: string; aria: string; title: string; text: string; classes: string }[] = [];
    let fullscreenFound = false;

    function looksLikeFullscreen(s: string) {
      return /fullscreen|full-screen|fs-button/i.test(s);
    }

    function looksLikeShare(s: string) {
      return /\bshare\b/i.test(s);
    }

    function walk(root: ParentNode | ShadowRoot) {
      const els = root.querySelectorAll('*');
      for (const el of Array.from(els) as HTMLElement[]) {
        if (visited.has(el)) continue;
        visited.add(el);

        const aria = el.getAttribute('aria-label') ?? '';
        const title = el.getAttribute('title') ?? '';
        const text = el.textContent?.trim() ?? '';
        const cls = el.className?.toString() ?? '';
        const tag = el.tagName.toLowerCase();

        const isButton =
          tag === 'button' ||
          el.getAttribute('role') === 'button' ||
          /-button|button-/.test(tag);

        if (isButton) {
          buttons.push({ tag, aria, title, text, classes: cls });
        }

        const joined = [aria, title, text, cls, tag].join(' ');
        if (looksLikeFullscreen(joined)) {
          const rect = el.getBoundingClientRect();
          const visible = rect.width > 0 && rect.height > 0 && (el as HTMLElement).offsetParent !== null;
          if (visible) fullscreenFound = true;
        }

        if (el.shadowRoot) walk(el.shadowRoot);
      }
    }

    walk(document);

    const shareButton = buttons.find((b) =>
      looksLikeShare([b.aria, b.title, b.text, b.classes, b.tag].join(' '))
    );

    return { buttons, fullscreenVisible: fullscreenFound, shareButton: shareButton ?? null };
  });

  let shareClickLogged = false;
  if (scan.shareButton) {
    const btn = page
      .locator('button, [role="button"]')
      .filter({ hasText: /share/i })
      .first();
    try {
      await btn.click({ timeout: 5_000 });
      await page.waitForTimeout(500);
      shareClickLogged = consoleMessages.some((m) => /shared/i.test(m.text));
    } catch {
      shareClickLogged = false;
    }
  }

  const pass = !scan.fullscreenVisible && scan.shareButton !== null && shareClickLogged;
  return {
    pass,
    details: {
      fullscreenHidden: !scan.fullscreenVisible,
      shareButtonPresent: scan.shareButton !== null,
      shareButton: scan.shareButton,
      shareClickLogged,
      consoleSample: consoleMessages.slice(-10),
    },
  };
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
