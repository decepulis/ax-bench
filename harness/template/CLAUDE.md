# Agent notes

A **Vite dev server is already running** at http://localhost:5173 with HMR.
**Do not run `pnpm dev`, `vite`, or anything that starts a long-running server** —
those commands never exit and will hang your session.

Use the Playwright or Chrome DevTools MCP to open that URL if you need to
visually verify your work. The browsers they need are already installed —
**do not run `playwright install`, `npx @playwright/mcp install-browser`,
or any other browser-install command**, even if an MCP error suggests it.
Those commands replace the bundled binaries and break the rest of the run.

For anything else (installing deps, running scripts that exit), use Bash normally.

When you hit ambiguity or trade-offs, make a reasonable decision and proceed —
don't ask me to confirm. Tell me when you're done and I'll review the result.
