# /examples — a navigable content tree

A live showcase built entirely with the **Page system** (`core/Page`). Open `/examples/` in the
browser. Demonstrates the target pattern: **import sets of pages and assemble them into one tree**,
instead of writing a `page.js` per sub-page.

## How it's wired

`page.js` imports *example sets* and calls them inside one root page:

```js
import { page } from "/app.js";
import elements    from "./elements.examples.js";
import interactive from "./interactive.examples.js";
import pages       from "./pages.examples.js";

page("Examples", (root) => {
    elements();      // each set's page() calls run inside root's content fn,
    interactive();   // so they're captured as children of "Examples"
    pages();
});
```

Each `*.examples.js` exports a function that defines a subtree with `page("Name", fn)`. Because
those calls execute while the root page's content fn is running, the captor adopts them as
sub-pages. Nest as deep as you like — every level gets its own button nav, and sub-pages render
**lazily** on first open.

## Files

| File | Subtree |
|------|---------|
| `page.js` | root `Examples` page; imports + assembles the sets; styles |
| `elements.examples.js` | Elements → Headings / Text / Boxes |
| `interactive.examples.js` | Interactive → Counter / Toggle / Style (real `.click()` handlers) |
| `pages.examples.js` | Pages (meta) → How it works / Live nesting / This tree |

## Navigation is URL-addressable (Page/2)

`page()` from `/app.js` is now backed by **Page/2** (hash routing). So this tree is
**deep-linkable and refresh-stable**: click into `Interactive > Counter` and the URL becomes a
hash you can share or reload; browser back/forward work too. The example sets didn't change — the
routing came for free when `core/Page/Page.js` was promoted to Page/2.

(Layout is nested/indented, not flat horizontal columns — that remains a separate presentation
option; see `core/Page/2/readme.md`.)

## Verifying

Browser-only. The MCP browser is often locked ("already in use"); launch your own headless
Playwright via a throwaway script in the project root (so it resolves `node_modules`) that drives
clicks and asserts text. See the project memory note `project-page-system.md`.
