# Playwright's official image gets us Node 22 + Chromium + Firefox + WebKit
# plus all system deps (libnss3, fonts, etc.) for headless browser work.
FROM mcr.microsoft.com/playwright:v1.50.0-jammy

# Install pnpm directly via npm (skip corepack — the bundled corepack in the
# base image has stale signing keys that fail on current pnpm releases).
# tsx + Claude Code CLI + Playwright library (for assertion scripts).
# Playwright version must match the base image (1.50.x) so it uses the
# pre-installed browsers without trying to download new ones.
RUN npm install -g pnpm@9.15.0 tsx@4.19.0 @anthropic-ai/claude-code playwright@1.50.0

# Install Brave instead of using the Playwright-bundled Chromium. The bundled
# Chromium-for-Testing build statically links ffmpeg without proprietary
# codecs, so the Mux HLS test stream (H.264/AAC) won't decode — the player
# paints a "no compatible source" error overlay that intercepts pointer
# events and the rung-5 visual judge sees the error modal instead of chrome.
# Brave is Chromium-based, ships H.264/AAC, and has an arm64 Jammy .deb
# (Google Chrome Linux and MS Edge Linux are amd64-only). Symlinks expose
# Brave under the names both MCPs probe: Playwright MCP defaults to the
# `chrome` channel; chrome-devtools-mcp's puppeteer-core scans PATH +
# $CHROME_PATH. Without the symlinks, both MCPs fail on turn 1.
RUN set -eux; \
    curl -fsSL https://brave-browser-apt-release.s3.brave.com/brave-browser-archive-keyring.gpg \
      -o /usr/share/keyrings/brave-browser-archive-keyring.gpg; \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/brave-browser-archive-keyring.gpg] https://brave-browser-apt-release.s3.brave.com/ stable main" \
      > /etc/apt/sources.list.d/brave-browser-release.list; \
    apt-get update -qq; \
    apt-get install -y --no-install-recommends brave-browser; \
    rm -rf /var/lib/apt/lists/*; \
    ln -sf /usr/bin/brave-browser /usr/bin/google-chrome; \
    ln -sf /usr/bin/brave-browser /usr/bin/chromium; \
    ln -sf /usr/bin/brave-browser /usr/bin/chrome
ENV CHROME_PATH=/usr/bin/brave-browser \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/brave-browser

# Pre-warm npm cache with Playwright MCP + Chrome DevTools MCP so the first
# time Claude invokes them inside a session, there's no cold-start delay.
RUN npx --yes @playwright/mcp --help >/dev/null 2>&1 || true && \
    npx --yes chrome-devtools-mcp --help >/dev/null 2>&1 || true

WORKDIR /home/pwuser

# Non-root user 'pwuser' ships with the base image. Use it.
USER pwuser

# Claude Code writes to ~/.claude inside the container — fresh every run since
# containers are --rm. No host ~/.claude contamination.
ENV HOME=/home/pwuser

# Make globally-installed modules (playwright, tsx runtime deps) resolvable
# from scripts outside a local node_modules — our assertion scripts live in
# /harness (bind-mounted read-only) and `import 'playwright'` there.
ENV NODE_PATH=/usr/lib/node_modules

# Pre-bake the workspace's React/Vite/TS deps into the image so each cell
# doesn't pay a cold `pnpm install` (saves ~30-60s/cell). Only deps that
# never change between cells are baked here; library-specific deps
# (mux-player / video-js) still install fresh per-cell. The cell entrypoint
# copies this dir into /home/pwuser/workspace and runs `pnpm install` to
# resync, which is near-instant when the store is already populated.
# Build context is the ax-bench repo root: `docker build -f harness/docker/Dockerfile -t ax-bench:latest .`
COPY --chown=pwuser:pwuser harness/template/package.json /home/pwuser/workspace-cache/package.json
WORKDIR /home/pwuser/workspace-cache
RUN pnpm install --reporter=silent
WORKDIR /home/pwuser

ENTRYPOINT ["tsx"]
