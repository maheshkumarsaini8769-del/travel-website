<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Build / runtime quirks (Windows + OneDrive machine)

- **Local build crashes with** `Error: . is neither a posix nor a windows path, and there is no 'join' method...` — this is a known Next 14 + Windows issue. Fixed by patching `node_modules/next/dist/compiled/webpack/bundle5.js`: in the `join`/`dirname`/`relative` helpers, replace the `throw new Error(...)` fallback for relative paths with `P.posix.join(v,E)` / `P.posix.dirname(v)` / `P.posix.relative(v,E)`. NOTE: any `npm install` (or `npm ci`) wipes this patch — reapply if builds crash again.
- **`flight-client-entry-plugin` crash** (`path.isAbsolute(undefined)` / `ImportContextDependency`) after interrupted builds — caused by a corrupted webpack filesystem cache. Fix: delete the whole `.next` folder, then rebuild.
- **Build flakiness**: builds on this machine intermittently truncate/hang. Workaround: kill the process listening on port 3333 (NOT all node processes — that can kill the tooling shell), delete `.next`, rebuild with `node node_modules/next/dist/bin/next build`.
- **Use Node 20 for builds**: `C:\Users\hi\AppData\Local\Temp\opencode\node20\node-v20.20.2-win-x64\node.exe node_modules/next/dist/bin/next build` — system Node 22 shows the fs-path errors.
- Prod server: `node .../node.exe node_modules/next/dist/bin/next start -p 3333`, started hidden with `Start-Process`. Never run `next dev` while the prod server is running (same `.next`, corrupts it).

