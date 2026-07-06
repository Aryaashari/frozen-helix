import app, { el, div, h1, h2, p } from "/app.js";
import { md, vstyle } from "./lib.js";
app.$root.ac("page");

vstyle(`
    .vision-lede { font-size: 1.15em; color: #333; }
    .vision-nav { display: flex; flex-wrap: wrap; gap: .5em; margin: 2em 0; }
    .vision-nav a {
        display: block; padding: .6em 1em; border: 1px solid #ddd;
        border-radius: 8px; text-decoration: none; color: #222; background: #fafafa;
    }
    .vision-nav a:hover { border-color: var(--prim); }
    .vision-nav a b { display: block; }
    .vision-nav a small { color: #666; }
`);

function vision_nav() {
    div.c("vision-nav", () => {
        const links = [
            ["/vision/tiers/",   "1 · Tiers",   "The maturity model that replaces branching"],
            ["/vision/audit/",   "2 · Audit",   "Every directory: keep / merge / lab / remove"],
            ["/vision/css/",     "3 · CSS",     "Killing the .page clash for good"],
            ["/vision/scaling/", "4 · Scaling", "From the View class to enterprise — one repo"],
        ];
        for (const [href, title, sub] of links)
            el("a", () => { el("b", title); el("small", sub); }).href(href);
    });
}

h1("Back to the Vision");

p("A strategy for pruning frozen-helix back to a stable, minimal, useful core — without spawning a pile of branches and repos to maintain.")
    .ac("vision-lede");

div.c("callout", () => {
    md("**The commitment:** the absolute simplest architecture. No bundlers, no frameworks, no build step. The easiest possible way to get started — literally just the `View` class if you want — that can *scale up* to a full enterprise app when you need it.");
});

div(() => {
    h2("Where we drifted");
    p("The vision was zero-to-enterprise on one simple spine. In practice the tree grew sideways: lots of half-finished \"advanced\" features that each reached for the same generic names and global CSS, so nothing feels like it's in the right place.");

    el("ul", () => {
        el("li", () => md("**~6 overlapping routing/paging attempts** — `core/Page`, `ext/HashPage`, `ext/HashPager`, `ext/HashRouter`, `ext/Router` (a stub), `ext/Explorer`."));
        el("li", () => md("**~4 competing app shells** — `Lew42` (the one actually used), `Workspace`, `WebApp`, `WebEditor`."));
        el("li", () => md("**Two persistence generations side by side** — the new `Item`/`List`/`Saver` stack and the legacy `Component` (30 files) + `File` (13 files) it was meant to replace."));
        el("li", () => md("**Global CSS name clashes** — `.page` means a 4rem-padded document in one file and a flex column-router in another. See the CSS page."));
        el("li", () => md("**Whole separate domains living in the framework** — `game/` (Camera/Player/Controller), `ext/Fal` (fal.ai image gen)."));
    });
});

div.c("callout good", () => {
    h2("The key insight");
    md("You already invented the fix. The path-versioning pattern (`Item0…Item9`, `Page0…Page3`) lets stable and experimental code coexist in **one tree** instead of one branch per idea.");
    md("Last time, pruning meant *branches* — and branches across several projects is what turned into merge hell. The answer is to prune with **directories, not branches**: sort everything into maturity **tiers** in this single repo, expose only the stable tiers through `/app.js`, and quarantine the rest where it's free to churn or be deleted without ceremony.");
});

div(() => {
    h2("The four documents");
    p("Read in order — each builds on the last.");
});

vision_nav();

div(() => {
    h2("TL;DR — the strategy in five moves");
    el("ol", () => {
        el("li", () => md("**Freeze a tiny Core** (`View` + `App` + element helpers + the CSS reset/utilities). This is the \"just the View class\" entry point."));
        el("li", () => md("**Bless a stable Kit** (`Item`, `List`, `Saver`, `Store`, `Page`, `ui`, `ux`, `Socket`). Opt-in, re-exported from `/app.js`."));
        el("li", () => md("**Quarantine everything else into `lab/`** — importable only by explicit full path, never re-exported, no stability promise."));
        el("li", () => md("**Demote demos to consumers** (`Notes`, `Todo`) — they use the framework, they aren't part of it."));
        el("li", () => md("**Stay one repo, one version.** When Core freezes, publish a *single* package with subpath `exports` — that gives 0→enterprise scaling with no monorepo tooling and no extra repos."));
    });
});
