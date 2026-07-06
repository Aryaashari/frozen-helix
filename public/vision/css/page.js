import app, { el, div, h1, h2, p } from "/app.js";
import { md, crumb, vstyle } from "../lib.js";
app.$root.ac("page");

vstyle(`
    pre.code .b { color: #ff7a7a; } /* bad / removed */
    pre.code .k { color: #c792ea; } /* selector */
    table.rule { width: 100%; border-collapse: collapse; font-size: .92em; }
    table.rule th, table.rule td { text-align: left; padding: .45em .6em; border-bottom: 1px solid #eee; vertical-align: top; }
    table.rule th { background: #f7f7f7; }
`);

crumb("/vision/", "← Vision");

h1("3 · CSS Strategy — Kill the Clash");
p("The CSS problem isn't volume, it's naming. Generic English words (.page, .main, .left, .root, .card, .nav) are used as global selectors, so two unrelated features collide.");

div(() => {
    h2("Exhibit A: the .page collision");
    p("`.page` is defined two incompatible ways, and a third file has to actively undo one of them:");
    el("pre", () => {
        el("span", "/* framework.css — theme layer: a PROSE DOCUMENT */\n").ac("c");
        el("span", ".page { max-width: 60em; background: #fff; padding: 4rem; }\n\n");
        el("span", "/* ext/HashPage/HashPage.css — a FLEX COLUMN ROUTER */\n").ac("c");
        el("span", ".page { display: flex; gap: 1em; }\n\n");
        el("span", "/* core/Page/Pager/Pager.css — forced to neutralize the theme */\n").ac("c");
        el("span", ".pager { max-width: none; padding: 0; background: transparent; }\n");
        el("span", '.col-row > .page { max-width: none; }  /* "override theme .page" */').ac("c");
    }).ac("code");
    p("Same class name, three different intents. Any page that loads more than one of these files gets whichever rule wins the cascade — invisible, position-dependent breakage.");
});

div.c("callout bad", () => {
    md("**Root cause:** there's no rule about who is allowed to own a bare class name globally. `.page` got claimed by a document-theme rule, by a router, and by a Pager — none scoped, all global.");
});

div(() => {
    h2("The naming policy");
    p("Three buckets, and every class must declare which one it's in:");
    el("table", () => {
        el("tr", () => { el("th", "Bucket"); el("th", "Who owns it"); el("th", "Examples"); });
        const rows = [
            ["Global utilities", "framework.css only, documented", "`.flex`, `.grid`, `.gap`, `.pad`, `.mb`, `.dark`"],
            ["Component-scoped", "A component's own CSS, prefixed", "`.fh-pager`, `.fh-doc`, `.fh-toolbar`"],
            ["Local / structural", "Scoped under a component root", "`.fh-pager > .nav`, never bare `.nav`"],
        ];
        for (const [a, b, c] of rows) el("tr", () => { el("td", () => md(a)); el("td", () => md(b)); el("td", () => md(c)); });
    }).ac("rule");
    md("**The ban:** no bare generic English word (`page`, `card`, `nav`, `main`, `left`, `root`, `header`) may be a global selector. It's either a documented utility or it carries a component prefix.");
});

div.c("callout good", () => {
    h2("The fix for .page specifically");
    p("The theme `.page` rule isn't a \"page\" at all — it's a prose document container (60em, white, padded). Rename it to its real meaning and the conflict evaporates:");
    el("pre", () => {
        el("span", "/* framework.css — rename the document container */\n").ac("c");
        el("span", ".fh-doc { max-width: 60em; background: #fff; padding: 4em; }\n").ac("g");
        el("span", ".fh-doc > section { margin: 3em 0; }\n\n").ac("g");
        el("span", "/* router/pager keeps .fh-pager (already prefixed) — nothing to neutralize */").ac("c");
    }).ac("code");
    md("Then `app.$root.ac(\"page\")` becomes `ac(\"fh-doc\")` (or a `doc` helper). The Pager files can delete every \"override theme .page\" line — there's nothing left to override.");
    md("Note the `4rem → 4em` change: per project convention, use ems, not rems.");
});

div(() => {
    h2("Use the @layer cascade you already have");
    md("`framework.css` already declares `@layer base, theme, util, ovr` — the right backbone. Lean into it so precedence is intentional, not accidental:");
    el("ul", () => {
        el("li", () => md("**base** — reset only (box-sizing, margins, element defaults)."));
        el("li", () => md("**theme** — design tokens (`--prim`, `--bg`, `--column`) + element theming. No generic component classes here."));
        el("li", () => md("**util** — the documented global utility classes. The only place bare words live."));
        el("li", () => md("**components** — add a layer; each component's CSS opts in, prefixed, scoped. Co-locate it with the component (already the pattern for most `ext/*` dirs)."));
    });
});

div(() => {
    h2("Migration — mechanical and safe");
    el("ol", () => {
        el("li", () => md("Rename theme `.page` → `.fh-doc` in `framework.css`; update the few page roots that use it."));
        el("li", () => md("Delete the \"override theme .page\" lines in `Pager.css` / `ColumnPager.css`."));
        el("li", () => md("Move superseded routers (`HashPage` etc.) to **Lab** — that removes the duplicate `.page` definitions entirely."));
        el("li", () => md("Grep for other bare offenders (`.main`, `.left`, `.root`, `.card`) and prefix or scope them as you touch each component."));
    });
});

div.c("callout", () => {
    md("**Why this is low-risk:** renames and prefixes are find-and-replace, not redesign. And because the worst clashes come from the duplicate routers, simply Lab-ing them (Audit step 2) deletes half the problem for free.");
});

crumb("/vision/scaling/", "Next → 4 · Scaling");
