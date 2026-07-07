import app, { el, div, h1, h2, p } from "/app.js";
import { md, crumb, vstyle } from "../lib.js";
app.$root.ac("page");

vstyle(`
    table.opt { width: 100%; border-collapse: collapse; font-size: .92em; }
    table.opt th, table.opt td { text-align: left; padding: .5em .6em; border-bottom: 1px solid #eee; vertical-align: top; }
    table.opt th { background: #f7f7f7; }
`);

crumb("/vision/", "← Vision");

h1("4 · Scaling — From the View Class to Enterprise");
p("The goal: a beginner imports one tiny thing and ships; an enterprise app imports the whole Kit — and you maintain one repository, one version. Here's how, without monorepo tooling or a fleet of repos.");

div.c("callout bad", () => {
    h2("What NOT to do (it's what burned you)");
    el("ul", () => {
        el("li", () => md("**Multiple repos / a real monorepo** (Lerna/Nx/pnpm-workspaces). Independent versions drift; cross-package changes need coordinated bumps; and merging long-lived splits is exactly the pain you already lived through."));
        el("li", () => md("**Branches as the unit of stability.** A branch per \"version\" of the framework re-creates the merge hell. Stability should be a directory tier, not a branch."));
    });
});

div(() => {
    h2("The options, honestly compared");
    el("table", () => {
        el("tr", () => { el("th", "Option"); el("th", "Scales 0→enterprise?"); el("th", "Repos"); el("th", "Verdict"); });
        const rows = [
            ["Many small repos / packages", "Yes", "Many", "No — version skew + merge hell. The thing to avoid."],
            ["Monorepo w/ workspace tooling", "Yes", "1 repo, N pkgs", "Overkill now. Tooling complexity you don't need yet."],
            ["One repo, tier directories + absolute-path imports (today)", "Yes, via import paths", "1 repo, 1 ver", "✅ **This is the answer.** Zero tooling, zero build."],
            ["Publish 1 pkg w/ subpath exports + import map", "Yes, but needs a generated import map (build step)", "1 repo, 1 ver", "Deferred — only if outside users ever `npm i` it."],
        ];
        for (const [a, b, c, d] of rows) el("tr", () => { el("td", () => md(a)); el("td", b); el("td", c); el("td", () => md(d)); });
    }).ac("opt");
});

div.c("callout good", () => {
    h2("The mechanism you already have: absolute-path imports");
    md("You don't need `exports`, an import map, or any build step to scale from a single class to the full Kit. **Plain ES-module imports by absolute URL already do it** — the exact thing you use today.");
    el("pre", () => {
        el("span", "// Minimal start — just the View class. Nothing else is pulled in.\n").ac("c");
        el("span", `import { div, h1, p } from "/framework/core/View/View.js";\n\n`).ac("g");
        el("span", "// Growing app — add a primitive when you actually need it.\n").ac("c");
        el("span", `import Item from "/framework/core/Item/Item.js";
import Page from "/framework/core/Page/Page.class.js";\n\n`).ac("g");
        el("span", "// Full Kit — the barrel. One import, everything blessed.\n").ac("c");
        el("span", `import app, { Item, List, ui, ux } from "/app.js";`).ac("g");
    }).ac("code");
    md("That **is** zero-to-enterprise, with zero tooling. The scaling knob is simply *which file you import*: one leaf module for minimal, `/app.js` for everything. The tier directories + the \"`/app.js` re-exports only Core+Kit\" rule are the whole story — no packaging required.");
});

div.c("callout", () => {
    h2("What about npm? Deferred — and deliberately so.");
    md("Publishing to npm only matters the day an **external** consumer wants to `npm i frozen-helix` and write `\"frozen-helix/item\"` instead of a URL path. Nothing in your own local-first workflow needs it.");
    md("And it isn't free: browsers don't read a package's `exports` field and won't resolve bare specifiers on their own, so you'd need an **import map** to hand-write or — worse — **generate from `exports`, which is a build step.** That trades away the no-build commitment for ergonomics you don't need yet.");
    md("**Decision: skip it for now.** Keep absolute-path imports. If you ever publish, revisit then; by that point a tiny generator script (you already have `scripts/`) can emit the map, and it's an opt-in convenience for outside users — never something *your* app depends on.");
});

div(() => {
    h2("The roadmap (no big bang)");
    el("ol", () => {
        el("li", () => md("**Now:** apply the tiers in-tree (move Lab, trim `/app.js`). Pure cleanup, no packaging, no build."));
        el("li", () => md("**Next:** keep building — but new work lands in `lab/` until it earns promotion to Kit. The blessed surface (`/app.js`) only grows on purpose."));
        el("li", () => md("**Scaling stays free:** import one leaf file for minimal, `/app.js` for the Kit. That's the whole zero-to-enterprise story — no `exports`, no import map, no bundler."));
        el("li", () => md("**Only if you ever publish externally:** add `exports` + a generated import map then. Explicitly deferred — not part of getting stable."));
    });
});

div.c("callout", () => {
    h2("The single principle");
    md("**One repo. One version. Stability is a directory tier, not a branch or a package.** Subpath `exports` is what lets that one versioned thing scale from a single `View` import up to a full enterprise Kit — exactly the zero-to-enterprise vision, delivered with the least machinery possible.");
});

div(() => {
    h2("Where to go next");
    p(() => {
        el("a", "Re-read the Tier model").href("/vision/tiers/");
        el("span", "  ·  ");
        el("a", "See the directory verdicts").href("/vision/audit/");
        el("span", "  ·  ");
        el("a", "Fix the CSS clash").href("/vision/css/");
    });
});

crumb("/vision/", "← Back to Vision index");
