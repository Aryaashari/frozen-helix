import { app, page, h1, p } from "/app.js";

// Import sets of example pages…
import elements    from "./elements.examples.js";
import interactive from "./interactive.examples.js";
import pages       from "./pages.examples.js";

app.$root.ac("pad");

// Styling for the page-tree nav + interactive bits.
import { el } from "/app.js";
el("style", `
    .page { margin-bottom: 1em; }
    .page > .nav { display: flex; flex-wrap: wrap; gap: .5em; margin: .5em 0 1em; }
    .page-btn { cursor: pointer; padding: .4em .9em; background: rgba(0,0,0,.08); border-radius: .25em; user-select: none; }
    .page-btn.active { background: #3b82f6; color: #fff; font-weight: bold; }
    .page > .pages { padding-left: 1em; border-left: 3px solid rgba(0,0,0,.08); }

    .btn { display: inline-block; cursor: pointer; padding: .5em 1em; margin: .3em 0; background: #111; color: #fff; border-radius: .3em; user-select: none; }
    .counter-out { font-size: 2em; margin: .2em 0; }
    .toggle-box { display: inline-block; padding: 1em 2em; background: #ddd; cursor: pointer; border-radius: .3em; }
    .toggle-box.on { background: #10b981; color: #fff; }
`);

h1("frozen-helix — Examples");
p("A navigable tree built with the Page system. Click the category buttons to explore.");

// …and assemble them into ONE page tree. Each set's page() calls are captured
// as children of this root, because they run inside its content fn.
page("Examples", (root) => {
    p("Pick a category:");
    elements();
    interactive();
    pages();
});
