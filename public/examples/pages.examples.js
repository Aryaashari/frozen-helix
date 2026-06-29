import { page, h2, h3, p, div } from "/app.js";

// Meta examples — the page system explaining itself, with a live nested demo.
export default function pages(){
    page("Pages", (pg) => {
        h2("The Page system");
        p("A `Page` is the thing at a `/path/`. One `page()` helper makes both root documents and nested sub-pages — the captor decides which.");

        page("How it works", () => {
            h3("page() + captor");
            p("`page(\"Title\", fn)` with no active page → a root (rendered by App.load_page).");
            p("`page(\"Title\", fn)` inside another page's content → a sub-page (captured as a child).");
            p("Pages stay dormant until rendered — sub-pages render lazily on first open.");
        });

        page("Live nesting", (live) => {
            h3("This page has children");
            p("The buttons above were generated from page() calls below — nest as deep as you like.");
            page("Child A", () => p("You opened Child A."));
            page("Child B", (b) => {
                p("Child B has its own child:");
                page("Grandchild", () => p("Three levels deep, each with its own nav."));
            });
        });

        page("This tree", () => {
            h3("Where this came from");
            p("`/examples/page.js` imports example *sets* (`elements`, `interactive`, `pages`) and calls them inside one root page. Each set defines its own subtree.");
            p("That's the \"import sets of pages, add them to the tree\" pattern — no per-page file needed.");
        });
    });
}
