import app, { el, div, h1, h2, p } from "/app.js";
import { md, crumb, vstyle } from "../lib.js";
app.$root.ac("page");

vstyle(`
    table.audit { width: 100%; border-collapse: collapse; font-size: .92em; }
    table.audit th, table.audit td { text-align: left; padding: .45em .6em; border-bottom: 1px solid #eee; vertical-align: top; }
    table.audit th { background: #f7f7f7; }
    table.audit code { font-size: .95em; }
    .v { font-weight: 600; white-space: nowrap; padding: .1em .5em; border-radius: 5px; font-size: .82em; color: #fff; }
    .v.core   { background: #1565c0; }
    .v.kit    { background: #2e7d32; }
    .v.lab    { background: #e09000; }
    .v.merge  { background: #00838f; }
    .v.remove { background: #c0392b; }
    .legend span.lbl { margin-right: 1em; }
`);

crumb("/vision/", "← Vision");

h1("2 · Directory Audit");
p("Every framework directory, sorted by concern, with a verdict. \"Usefulness\" here means: does it earn a place in the stable surface, or is it duplicate / superseded / experimental weight?");

div.c("legend", () => {
    p(() => {
        const tags = [["core","Core — frozen spine"],["kit","Kit — stable, opt-in"],["lab","Lab — quarantine"],["merge","Merge — fold into sibling"],["remove","Remove — superseded/dead"]];
        for (const [c, label] of tags)
            el("span", () => { el("span", c).ac("v " + c); el("span", " " + label); }).ac("lbl");
    });
});

// section(title, rows): each row = [path, verdictClass, verdictLabel, note]
function section(title, rows) {
    h2(title);
    el("table", () => {
        el("tr", () => { el("th", "Directory"); el("th", "Verdict"); el("th", "Why / what to do"); });
        for (const [path, vclass, vlabel, note] of rows) {
            el("tr", () => {
                el("td", () => el("code", path));
                el("td", () => el("span", vlabel).ac("v " + vclass));
                el("td", () => md(note));
            });
        }
    }).ac("audit");
}

section("Core spine", [
    ["core/View",   "core", "Core",   "The DOM abstraction + element helpers. The whole framework's foundation."],
    ["core/App",    "core", "Core",   "Page loader + captor. Keep tiny."],
    ["core/Events", "core", "Core",   "on/off/emit base. Substrate."],
    ["core/Base · util · mixin", "core", "Core", "Shared helpers. Fold stray one-offs in here rather than new top-level dirs."],
    ["core/Test",   "kit",  "Kit",    "Test3 is blessed; Test0/1/Original are compat. Dev-time tooling — Kit, not Core."],
]);

section("Persistence — pick the new generation, retire the old", [
    ["core/Item (0–9)", "kit", "Kit", "Blessed. The Active-Record domain object. This is THE persistence story."],
    ["core/List (0–8)", "kit", "Kit", "Blessed ordered-collection primitive."],
    ["ext/Saver/*",     "kit", "Kit", "File/List/Memory/LocalStorage backends. Keep all four — they're the swappable contract."],
    ["ext/Store",       "kit", "Kit", "Named Item registry. The recommended app-data entry point."],
    ["ext/Bind",        "kit", "Kit", "Small, useful two-way DOM↔Item binding. Keep."],
    ["ext/Component (30 files)", "remove", "Remove", "Legacy persistence that Item explicitly replaces. **Biggest single cleanup win.** Lab it first if anything still imports it, then delete."],
    ["ext/File (13 files)",      "remove", "Remove", "Pre-Item file persistence. Superseded by `FileSaver`. Lab → delete."],
    ["ext/Savable",     "remove", "Remove", "One-file experiment, superseded by Saver."],
    ["ext/Thing · Thing_old", "remove", "Remove", "Scratch experiments. Delete."],
    ["ext/List (old)",  "merge",  "Merge",  "Back-compat shim for `core/List`. Repoint imports, then delete."],
    ["ext/Note (singular)", "remove", "Remove", "Duplicate of the Notes demo."],
    ["ext/Fal",         "lab", "Lab", "fal.ai image gen — a real feature, but a domain integration, not framework core. Lab (or its own app)."],
]);

section("Routing / Paging — converge on one", [
    ["core/Page (0–3 + Pager)", "kit", "Kit", "Blessed. Page3 + Column/Tab pager. **The survivor — everything else converges here.**"],
    ["ext/HashPage",   "remove", "Remove", "Self-described \"first attempt.\" Superseded."],
    ["ext/HashPager (2,3)", "lab", "Lab", "\"Evolved\" attempt, but `core/Page` won. Harvest missing ideas, then Lab → delete."],
    ["ext/HashRouter", "lab", "Lab", "Hash routing. Fold the good part into `core/Page` or keep as a Lab reference."],
    ["ext/Router",     "remove", "Remove", "Explicitly \"not implemented.\" Keep the readme as a design note; drop the dir."],
    ["ext/Page",       "remove", "Remove", "Stub superseded by `core/Page`."],
    ["ext/Explorer + ux/Explorer", "lab", "Lab", "Multi-column pager UX. Two copies — pick one, Lab it until it clearly beats `core/Page`."],
]);

section("App shells — choose ONE", [
    ["ext/Lew42",     "kit", "Kit", "**The shell actually in use** (extends App; header/sidenav/breadcrumbs). Bless it as THE reference shell — but split its app-specific bits (logo, favicon) from the reusable frame."],
    ["ext/Workspace", "lab", "Lab", "Competing \"one shell per app\" claim. Reconcile with Lew42 or Lab it."],
    ["ext/WebApp (0–2)", "lab", "Lab", "Another three-panel shell. Lab — fold its best ideas into the chosen shell."],
    ["ext/WebEditor (22 files)", "lab", "Lab", "A visual layout editor — an *app built with* the framework, not the framework. Lab now, graduate to Apps later."],
]);

section("Interaction — consolidate the drag family", [
    ["ext/Draggable (0–3)", "kit", "Kit", "Drag primitives; `Rewidth` is already used by Lew42. The canonical home for drag."],
    ["ext/DragDrop",  "merge", "Merge", "Sortable reordering. Fold into Draggable as a variant."],
    ["ext/Splitter",  "merge", "Merge", "Resize handle. Fold into Draggable (same Pointer-Capture machinery)."],
]);

section("UI / UX / dev utilities", [
    ["ui/",  "kit", "Kit", "Reusable controls (input, slider, scrub, toggle, color). Its readme says \"one file is no bueno\" — split per-control, keep the `ui` facade."],
    ["ux/",  "kit", "Kit", "Tabs, Modal, Toast, Popover, etc. Solid, exported via `ux`. Keep."],
    ["ext/Keys",   "kit", "Kit", "Global shortcut manager, already exported. Keep."],
    ["ext/Socket", "kit", "Kit", "WebSocket transport singleton. Core to the local-first story. Keep."],
    ["ext/Directory", "kit", "Kit", "Filesystem nav used by Lew42 sidenav. Keep."],
    ["ext/Dir",    "remove", "Remove", "Older duplicate of Directory."],
    ["ext/CodeEditor", "kit", "Kit", "Used by Lew42. Keep."],
    ["ext/Lorem",  "kit", "Kit", "Dev placeholder text, imported by Lew42. Small, keep."],
    ["ext/Toolbar", "lab", "Lab", "Reasonable, but not yet load-bearing. Lab until something depends on it."],
    ["ext/Markdown · Document · Module · Inspector · Layout", "lab", "Lab", "Useful-someday pieces, none currently load-bearing (Inspector is commented out in Lew42). Lab."],
    ["dum/", "lab", "Lab", "Prototyping placeholders by design. Lab — explicitly a scratch layer."],
    ["game/", "lab", "Lab", "Camera/Player/Controller — a separate domain. Lab now; strongest candidate to graduate to its own folder/repo."],
]);

div.c("callout", () => {
    h2("If you do nothing else, do these three");
    el("ol", () => {
        el("li", () => md("**Delete the legacy persistence** (`Component`, `File`, `Savable`, `Thing*`) — ~45 files, all superseded by Item/List/Saver. Biggest signal-to-noise gain."));
        el("li", () => md("**Collapse routing to `core/Page`** — move the other five pagers to Lab. The `.page` CSS clash mostly comes from these competing."));
        el("li", () => md("**Pick one app shell** (Lew42) and Lab the other three."));
    });
});

crumb("/vision/css/", "Next → 3 · CSS");
