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
            ["One repo, tier directories (today)", "Yes, via import paths", "1 repo, 1 ver", "✅ Do this now. Zero tooling."],
            ["One repo → publish 1 pkg w/ subpath exports", "Yes, via export map", "1 repo, 1 ver", "✅ The graduation step, when Core freezes."],
        ];
        for (const [a, b, c, d] of rows) el("tr", () => { el("td", () => md(a)); el("td", b); el("td", c); el("td", () => md(d)); });
    }).ac("opt");
});

div.c("callout good", () => {
    h2("The mechanism that does it all: subpath exports");
    md("One `package.json` can expose many independent entry points. That single feature gives you \"import just the View class\" and \"import the whole enterprise Kit\" — from **one package, one version** — no monorepo, no extra repos.");
    el("pre", () => {
        el("span", "// package.json — one package, many doors\n").ac("c");
        el("span", `{
  "name": "frozen-helix",
  "exports": {
    ".":      "./public/framework/core/View/View.js",   `).ac("g");
        el("span", "// minimal start\n").ac("c");
        el("span", `    "./view": "./public/framework/core/View/View.js",
    "./app":  "./public/framework/core/App/App.js",
    "./item": "./public/framework/core/Item/Item.js",
    "./list": "./public/framework/core/List/List.js",
    "./page": "./public/framework/core/Page/Page.js",
    "./ui":   "./public/framework/ui/ui.js",
    "./ux":   "./public/framework/ux/ux.js"
    `).ac("g");
        el("span", "// add a line as each piece is blessed; never expose lab/\n").ac("c");
        el("span", `  }
}`).ac("g");
    }).ac("code");
});

div(() => {
    h2("What each user imports");
    el("pre", () => {
        el("span", "// Beginner — literally just the View class\n").ac("c");
        el("span", `import { div, h1, p } from "frozen-helix";\n\n`).ac("g");
        el("span", "// Growing app — add data + routing when needed\n").ac("c");
        el("span", `import Item from "frozen-helix/item";
import Page from "frozen-helix/page";\n\n`).ac("g");
        el("span", "// Enterprise — the whole Kit, still one versioned package\n").ac("c");
        el("span", `import { ui } from "frozen-helix/ui";
import { ux } from "frozen-helix/ux";`).ac("g");
    }).ac("code");
    md("Same import paths work today over HTTP (`/framework/core/View/View.js`) and tomorrow as a package — the `exports` map just blesses the stable subset of paths that already exist.");
});

div(() => {
    h2("The roadmap (no big bang)");
    el("ol", () => {
        el("li", () => md("**Now:** apply the tiers in-tree (move Lab, trim `/app.js`). Nothing published. Pure cleanup."));
        el("li", () => md("**Next:** keep building — but new work lands in `lab/` until it earns promotion to Kit. The blessed surface only grows on purpose."));
        el("li", () => md("**When Core freezes:** add the `exports` map above. Tag `0.1.0`. You can now `npm i frozen-helix` and still serve it raw over HTTP — same files."));
        el("li", () => md("**Later, if ever needed:** a piece that genuinely wants its own release cadence (e.g. `game/`) graduates to its own folder/repo. By then it's isolated enough that splitting it is cheap — not a merge."));
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
