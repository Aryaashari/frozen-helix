# /vision — Framework Direction & Pruning Strategy

Living strategy docs for getting frozen-helix back to a **stable, minimal, useful** core
without the multi-branch / multi-repo merge hell that the last pruning attempt caused.

These are **rendered pages** (browse them live), not just markdown. Start at `/vision/`.

## Pages

| Page | What it answers |
|------|-----------------|
| `page.js` | Index — the vision, where we drifted, the key insight, TL;DR strategy |
| `tiers/page.js` | **The model:** Core (frozen) / Kit (stable, opt-in) / Lab (experimental) / Apps (demos). Tiers are directories, not branches — that's the merge-hell fix. |
| `audit/page.js` | Every framework directory with a verdict: Core / Kit / Lab / Merge / Remove |
| `css/page.js` | The `.page` global-selector clash and the naming policy that kills it |
| `scaling/page.js` | npm vs monorepo vs one-repo. Answer: one repo, one version, subpath `exports` for 0→enterprise |

## The one-line strategy

**One repo. One version. Stability is a directory tier, not a branch or a package.**
`/app.js` re-exports only Core + Kit; Lab is import-by-full-path only. When Core freezes,
publish a single package with a subpath `exports` map — no monorepo tooling, no extra repos.

## Top 3 concrete moves (from the audit)

1. Delete legacy persistence (`Component`, `File`, `Savable`, `Thing*`) — ~45 files superseded by Item/List/Saver.
2. Collapse routing to `core/Page`; move the other ~5 pagers to Lab (this also removes most of the `.page` CSS clash).
3. Pick one app shell (`Lew42`) and Lab the other three (`Workspace`, `WebApp`, `WebEditor`).

## Shared helpers

`lib.js` — `md()` (inline `**bold**` + `` `code` ``, since `p()` only does backticks),
`crumb()` (nav links), `vstyle()` (shared page styling). Import in each sub-page.

## Status

Audit + strategy only — **no framework code was modified** to produce these. Implementing the
moves above is the follow-up work.
