import app, { el, div, h1, h2, p } from "/app.js";
import { md, crumb, vstyle } from "../lib.js";
app.$root.ac("page");

vstyle(`
    .tier { border: 1px solid #ddd; border-radius: 10px; padding: 1.25em 1.5em; margin: 1em 0; }
    .tier h2 { margin-top: 0; }
    .tier .who { color: #666; font-style: italic; }
    .tier.core { border-left: 6px solid #1565c0; }
    .tier.kit  { border-left: 6px solid #2e7d32; }
    .tier.lab  { border-left: 6px solid #e09000; }
    .tier.apps { border-left: 6px solid #6a1b9a; }
    table.cmp { width: 100%; border-collapse: collapse; }
    table.cmp th, table.cmp td { text-align: left; padding: .5em .6em; border-bottom: 1px solid #eee; vertical-align: top; }
    table.cmp th { background: #f7f7f7; }
`);

crumb("/vision/", "← Vision");

h1("1 · The Tier Model");
p("Replace \"a branch per cleanup\" with \"a tier per maturity level.\" Tiers are just directories. Code moves up a tier as it stabilizes and out (deleted) when it's superseded — all on main, no merge hell.");

div.c("callout", () => {
    md("**The one rule that makes this work:** `/app.js` only re-exports **Core** and **Kit**. Everything in **Lab** is reachable solely by its explicit full path (`/framework/lab/.../Thing.js`). That single boundary is what keeps the public surface small while letting experiments live freely.");
});

// One helper renders every tier card: class, title, audience line, body fn.
function tier(cls, title, who, body) {
    div.c("tier " + cls, () => {
        h2(title);
        p(who).ac("who");
        body();
    });
}

tier("core", "Tier 0 — Core (frozen)", "Changes almost never. Breaking it breaks everything.", () => {
    p("The irreducible spine. This is the \"start with literally just the View class\" entry point.");
    el("ul", () => {
        el("li", () => md("`core/View` — the DOM abstraction + element helpers (`el`, `div`, `p`, `h1`, `style`)."));
        el("li", () => md("`core/App` — the page-loading singleton + captor wiring."));
        el("li", () => md("`core/Events`, `core/Base`, `core/util`, `core/mixin` — the tiny shared substrate."));
        el("li", () => md("`framework.css` — **base layer** (reset) + **util layer** (flex/grid/spacing utilities) only."));
    });
    md("**Promise:** stable API, stable class names. If something here changes, it's a real version bump.");
});

tier("kit", "Tier 1 — Kit (stable, opt-in)", "Blessed, documented, re-exported from /app.js. Each piece independently importable.", () => {
    p("The batteries. You reach for these deliberately; you never pay for them unless you import them.");
    el("ul", () => {
        el("li", () => md("**Data:** `Item`, `List`, `Saver` (File/List/Memory/LocalStorage), `Store`, `Bind`."));
        el("li", () => md("**Routing:** `Page` (the blessed Page3 + Pager). All other pagers are Lab."));
        el("li", () => md("**UI/UX:** `ui` (controls), `ux` (Tabs, Modal, Toast…), `Keys`, `Socket`."));
        el("li", () => md("**Interaction:** `Draggable` (with `Splitter`/`DragDrop` folded in)."));
    });
    md("**Promise:** the blessed default (`/app.js` re-export) moves forward; pinned path imports never break.");
});

tier("lab", "Tier 2 — Lab (experimental)", "No stability promise. Free to churn, rename, or be deleted. Import by full path only.", () => {
    p("The workshop. Everything half-built, superseded, or domain-specific lives here so it stops polluting the stable surface.");
    el("ul", () => {
        el("li", () => md("Superseded routing: `HashPage`, `HashPager`, `HashRouter`, `Router`, `Explorer`."));
        el("li", () => md("Competing shells: `Workspace`, `WebApp`, `WebEditor`."));
        el("li", () => md("Legacy persistence still referenced somewhere: `Component`, `File`, old `ext/List`."));
        el("li", () => md("Domain extras: `Fal`, `Module`, `Inspector`, `Markdown`, `Document`."));
    });
    md("**Promise:** none — and that's the point. Lab is where you can move fast without breaking Core/Kit consumers.");
});

tier("apps", "Tier 3 — Apps & Demos (consumers)", "These USE the framework. They are not part of it.", () => {
    p("Demos prove the stack works end-to-end. They belong beside the framework, not inside its core.");
    el("ul", () => {
        el("li", () => md("`Notes` — the canonical full-stack demo (Item + List + Saver + View)."));
        el("li", () => md("`Todo` — Item7 + List4 + CollectionSaver."));
        el("li", () => md("`game/` — a genuinely separate domain; a candidate to graduate to its own folder/repo."));
    });
});

div(() => {
    h2("Why tiers beat branches");
    el("table", () => {
        el("tr", () => { el("th", "Branch-based pruning"); el("th", "Tier-based pruning"); });
        const rows = [
            ["Stable + experimental diverge over time", "They live side by side on main — no divergence"],
            ["Re-merging across projects = the hell you hit", "Nothing to merge; you move files between folders"],
            ["\"Is this branch still alive?\" ambiguity", "A directory's tier is its status"],
            ["Deleting work feels risky (it's on a branch)", "Deleting Lab is safe — nothing stable imports it"],
        ];
        for (const [a, b] of rows) el("tr", () => { el("td", a); el("td", b); });
    }).ac("cmp");
});

div.c("callout", () => {
    md("**Migration is a move, not a rewrite.** Step one is purely mechanical: create `framework/lab/`, move the Lab list into it, and delete the Lab re-exports from `/app.js`. Nothing in Core/Kit imports Lab, so the stable tree keeps working untouched. You can do it in an afternoon, on `main`, with zero branches.");
});

crumb("/vision/audit/", "Next → 2 · The Audit");
