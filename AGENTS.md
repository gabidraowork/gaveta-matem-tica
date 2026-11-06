<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules (Gaveta Matemática)

- Each question is a self-contained "drawer" module in `src/drawers/<id>/index.ts` implementing `DrawerModule` and registered in `src/drawers/index.ts`; drawers draw imperatively (Three.js / Canvas) inside `mount()` — keeps questions decoupled from the React shell.
- The whole app renders at `/` from `src/components/GavetaApp.tsx`; per-drawer overlay exceptions live in `StageView.tsx` (`isCuboEnem`, `isCupulaEnem`, ...) — matches the source project's pattern.
- Math calculations live in `src/lib/matematica.ts` (1:1 port of `docs/matematica.py`) exposed via `src/lib/matematica.functions.ts`; the server runtime cannot execute Python, so keep the TS port as the source of truth and `docs/matematica.py` as reference only.
- `tsconfig.json` disables `noUncheckedIndexedAccess`, `noPropertyAccessFromIndexSignature` and `exactOptionalPropertyTypes` to match the migrated source code's compiler settings without rewriting it.
- A question delivered as a standalone single-file HTML simulator lives in `public/simuladores/<name>.html` and its drawer only mounts it in an iframe (`controls: []`, ControlDock/StageView overlays skipped by drawer id) — one source of truth for both the app and the standalone file.
- Drawers must never reveal final answers (e.g. vertex/edge/face totals); they show elements and formulas only.
