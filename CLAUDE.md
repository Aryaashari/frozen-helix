# frozen-helix

A local-first JS framework and app platform. Static HTML + ES modules served from Node, with a WebSocket channel to the local filesystem for persistence. No bundler, no build step, no React.

If we want this to be the best framework in the world, it has to be the simplest and easiest to use, so everyone wants to use it.

Use snake_case, not camelCase, for vars, methods, args, but prefer short, single words, to avoid underscores (_), when possible.

**Construction sequence:** `constructor()` → `assign()` → `instantiate()` → `initialize()`. `instantiate()` is where all setup work happens — it may call sub-methods (`instantiate_draggable()`, `instantiate_list()`, etc.) and always ends by calling `initialize()`. `initialize()` is the empty hook at the very end, for subclasses to override for post-construction customization. Never put setup work in `initialize()` — that's backwards. `initialize()` calls nothing; it just provides a clean override point.

**Naming conventions:**
- **No `_` prefix on methods or properties** unless something is genuinely private from subclasses and shouldn't be called by anyone (rare). If 90% of a class's methods start with `_`, something is wrong. Normal instance state (`this.start_x`, `this.dragging`) needs no prefix.
- **Use readable full names.** `start_x` not `sx`, `start_width` not `sw`. The code is the documentation — short cryptic names make it harder to read, not easier.
- **Lean into Views.** Accept View objects (`this.view`, `this.handle`) and use their API (`.on()`, `.ac()`, `.rc()`, `.style()`) instead of unwrapping to raw elements unless you need a raw DOM feature (e.g. `setPointerCapture`). Keep the `view.el` access minimal and explicit.
- **Follow existing framework patterns.** For drag/interaction classes use `this.view` (element being dragged), `this.handle` (element that initiates drag), `this.container` (children container). Lifecycle hooks are `start`, `move`, `stop` — called as `if (this.start) this.start(e)` so they can be passed as constructor opts or overridden in subclasses.

When generating CSS: Don't use rems, use ems.  My rems are hyper-responsive (get way too small, bad for text).

Always use the view-guide skill, when creating HTML.

When thinking, try to stay hyper focused on one problem and solution at a time.

When generating code, keep it as simple as possible, easy to read, add comments.  When responding to questions in chat, keep it short and simple.

Always look for readme.md's, create them when they're not present, and update them with information they were lacking.  Every directory can have a readme.

Don't use Playwright MCP unless asked, we're getting "Browser is already in use" errors.

## Tech Stack

- **Server**: Node.js, custom HTTP + WebSocket server (`Server/` submodule)
- **Framework**: Vanilla ES modules in `public/framework/` (git submodule)
- **Transport**: WebSocket via `Socket` singleton → `socket.async_rpc("write"|"rm"|"ls", ...)`
- **Persistence**: JSON files on local filesystem, written via Socket

No React, Vue, or JSX. No bundler. Imports are bare `/framework/...` paths served directly.

---

## Object Oriented Design

Each class should attempt to produce a minimal, easy, developer friendly API with minimal usage confusion.  Most classes could benefit from a helper creator function.  For example, `div()` creates a `new View({ tag: "div" })`, or `ui.tabs()` creates `new Tabs()`.  This is mostly for organization and ease of use.  Always simplify the API, thinking about what makes the most sense in the long run.

You can `extend View`, or just add `.render()` which just has `div()` inside, or maybe `.render(){ new this.constructor.View(); }`, for example.

For new Classes, lean into the `new this.constructor.View()` pattern, so that you can `ThingN.View = class extends ThingN-1.View {}`, and cherry pick methods to override for easy extension.

## Key Architectural Concepts

### View / UI Layer
The framework's UI primitive is `View` (see `.claude/skills/view-guide`). Element helpers like `div`, `el`, `h1`, `p` create View instances. Pages are `page.js` files that run imperatively on load.

### Item — Domain Objects
`Item` is the base class for persistent domain objects (Active Record pattern). An Item wraps a `data` object, exposes `get(key)`/`set(key, val)`, and delegates persistence to a swappable `Saver`.

Key rule: **Item stays ignorant of storage**. It calls `this.save()`, never knowing whether that goes to a file, SQLite, or LocalStorage.

### Saver — Persistence Backends
A `Saver` is a plain object or class instance assigned to `item.saver`. It implements:
- `save(item, patch)` — persist the dirty patch (or full data)
- `load(item)` — populate `item.data` from storage → returns Promise
- `delete(item)` — remove from storage

`item.saver` resolves via the parent chain: `this._saver ?? this.parent?.saver`. Set the saver at the root; children inherit automatically.

Current backend: `FileSaver` (JSON file over WebSocket RPC). Future: `SQLiteSaver`, `DOSaver`, `LocalStorageSaver`.

### List — Ordered Collections
`List` (canonical: `core/List/0/List0.js`) is the framework's ordered-collection primitive. Use it wherever you'd reach for an array of domain objects or renderable children.

Key rule: **lean into List**. If a class manages a group of things — test cases, nav items, children — make that group a `List` subclass with a paired `View`. This keeps the framework consistent and gives rendering, hierarchy, and traversal for free. Examples: `Test.List` (list of test cases), `Nav.List` (list of nav items), `Item.children` (list of sub-items).

`ext/List/List.js` is the original location — still present for backwards compat. New code imports from `core/List/0/List0.js`.

### Directory
`Server/plugins/Directory.js` watches `public/` and writes `directory.json` — a full filesystem listing used by the client-side nav (`ext/Directory/Directory.js`).

---

## Class Progression Pattern

Semver conflicts with path-based versioning.  With semver, 0.0.1 leads to 0.0.2, which leads to 0.1.0, which leads to 1.0.0.  But from a directory standpoint, Thing/0/0/1/ could work, but is a bit excessive.

Instead, we're going to lean into this pattern:  Thing/0/Thing0.js should convert on a minimal "learning" class, that represents Thing/1/Thing1.js as best it can.  The idea of the "0th" variant, is that it's sort of the best starting point to learn from.  It has as much as it can, while being as minimal as it can.

The number 1 variant will aim to be a very stable variant.  It will likely take a lot of iteration.  And so we can have 1/0, 1/1, 1/2, etc... 

And number 2+ will be substantial leaps of features/complexity.

Any version could use similar strategy:  Thing/0/0/Thing0.0.js could strip down Thing0.js even more.  Thing/0/1/Thing0.1.js could import Thing0.0.js, and so on.

Also, using framework/core.js's `{ mixin }` to mix several variants together, might not be a bad idea.  It allows you to organize toggle-able chunks of functionality.

Variants can also use **words** instead of numbers when the versions are distinct by role rather than cumulative capability — e.g. `class Saver` → `MemorySaver`, `FileSaver`, `LocalStorageSaver`, `CollectionSaver`. Word-named variants live in flat files under the module folder rather than subfolders; numbers are for layered progression where each level extends the last. These can be combined arbitrarily — `Thing/0/0/`, `Thing/0/1/`, `Thing/Blue/4/15/` are all valid. The sub-folder levels just mean: this thing, at this variant, at this version.

```
framework/core/Item/
  readme.md         ← design doc, open questions, next steps
  0/
    Item0.js        ← MVP: in-memory only, get/set/dirty/save
    page.js         ← test page for Item0
	readme.md
  1/
    Item1.js        ← adds: saver pattern + async load() via saver
    page.js
	readme.md
  2/
    Item2.js        ← adds: children, parent chain, list support
    page.js
	readme.md
```

**Important: Design Brilliantly Simple APIs**
Each class is an API.  Think about future dev's usage of your object.  Use sensible defaults, but allow config.  Don't require 2 steps if 1 would work.  Simplicity is gold.  Use nested methods to break logical portions into parts, to make it easier to read/use.  I use `<base_method_name>_<sub_part>()`.  Like `initialize_part()` or `render_something()`, to indicate it's logically part of that parent method.

We want the overall architecture to read cleanly.  We want to follow known patterns when possible (like creating a `new Thing()` to manage a specific aspect of the logic), to reduce cognitive load on future devs.  If we want this to be the best framework in the world, it has to be the simplest and easiest to use, so everyone wants to use it.

**Rules:**
- Each level must be fully functional and testable on its own.
- Higher levels extend lower ones but **never break the lower-level contract**.
- Domain code (e.g. `Thing1`) imports a specific level (`Item3`) and that import never breaks even as `Item4`, `Item5` are added.
- No level is deleted once code depends on it.
- The `readme.md` in each module folder is the design doc — open questions, decisions, next steps.

**Minimize progressions as things stabilize.** The numbered levels are a *learning/iteration* tool, not a goal — we currently have too many. As a module stabilizes, prefer **consolidating** over adding: fold a variant back into the blessed level, and reach for a **class/config toggle instead of a whole subclass** when the only difference is styling or a flag (e.g. `TabPager` is now just a `.paper-tabs` / `.button-tabs` class on the base Pager, not a distinct layout). Don't spin up `Thing/4/` for a change that a prop or CSS class expresses. Fewer, well-chosen levels > a long ladder of near-duplicates.

**Default version re-export:** A module can publish a stable default by re-exporting the current blessed level from a top-level file:
```
core/Item/Item.js  →  export { default } from "./2/Item2.js";
```
Consumers then choose: `import Item from "/framework/core/Item/Item.js"` (stable default, nicer path) or `import Item2 from "/framework/core/Item/2/Item2.js"` (pinned version, explicit). The top-level re-export moves forward when a new level is promoted; pinned imports never change.

Note: this whole versioning system may evolve if the framework moves toward git submodules or npm packages — the right model for stability guarantees will depend on that distribution story.

This pattern applies to all framework modules: `Component/0/`, `File/0/`, `List/0/`, etc.

---

## File Layout

```
frozen-helix/
  Server/              ← Node server (git submodule)
  scripts/             ← Node tooling (ESM loader, test runner, browser stubs)
    loader.mjs         ← maps /framework/... to public/framework/...
    register.mjs       ← loads the loader via module.register()
    run-all.mjs        ← runs all *.test.js under public/framework/
    stubs/             ← App.js, View.js, Socket.js, localStorage.js for Node tests
  public/
    framework/         ← framework (git submodule)
      core/            ← fundamental primitives
        Item/          ← Item0–Item9 + Item.js (→ Item9)
        List/          ← List0–List8 + List.js (→ List8)
        Test/          ← Test3 (blessed), Test0/Test1 (compat)
        View/          ← DOM abstraction
        App/           ← App singleton
        Events/        ← on/off/emit base class
      ext/             ← extensions built on core
        File/          ← File class (old pre-Item persistence, kept for compat)
        Saver/         ← All saver backends
          Saver.js     ← base class (no-op contract)
          FileSaver/   ← JSON file via WebSocket RPC (per Item)
          ListSaver/   ← JSON array file via WebSocket RPC (whole List)
          MemorySaver/ ← In-memory saver for tests
          LocalStorageSaver/ ← browser localStorage
        Store/         ← Named Item registry (Store.item(name) → FileSaver-backed Item9)
        Notes/         ← NoteItem + NoteList demo
        Todo/          ← TodoItem + TodoList demo
        Socket/        ← WebSocket singleton
        Directory/     ← filesystem listing nav
      lib/             ← pure utilities (util.js, is.js)
      dum/             ← DOM utility layer
    app.js             ← single entry point, exports everything including Item/List/Store/Savers
    directory.json     ← auto-generated filesystem listing
  persistence.md       ← early design doc: Saver, backends, delta model
  persistence2.md      ← later design doc: Item/ORM, dirty tracking, delta shape
  persistence-review.md ← code review of existing File/Component/Dir/Directory
```

---

## Persistence Evolution (Where We Are)

The old system used `File` + `Component` (see `ext/File/`, `ext/Component/`). These work but are messy — "Component" mixes UI and persistence concerns, and version churn left dead code behind.

The new system replaces `Component` with `Item`. The migration is additive: old Component code stays, new Item code is written fresh in `core/Item/`.

**Current phase:** Item0–Item9 and List0–List8 fully implemented with Node test suites. Savers: FileSaver (per-item), ListSaver (whole List → one file), LocalStorageSaver, MemorySaver — all under ext/Saver/, all with Node tests. Test0 (Node-runnable) and Test1 (browser renderer via View) both implemented. Demo apps: ext/Todo/, ext/Notes/. Higher-level: ext/Store/ (named Item registry). **26 suites, 26/26 passing. 21/21 Playwright browser tests passing.**

- `core/Item/Item.js` → Item9 (checkpoint/undo/redo)
- `core/List/List.js` → List8 (index_by: O(1) lookup)
- All `.test.js` files are Node-runnable via `node scripts/run-all.mjs` (26/26 passing)
- `Test1.View` renders test suites in the browser with collapsible `<details>/<summary>` — passed suites collapse by default; all page.js files use it
- `tests/browser/framework.spec.js` — 21 Playwright tests, one per framework page; run with `npx playwright test`
- `framework/page.js` — summary/index page with full Item/List/Saver/module reference tables

**Item progression:** Item0 (get/set) → Item1 (async load/save) → Item2 (children) → Item3 (jspath/delta) → Item4 (reactive List children) → Item5 (reactive set() events) → Item6 (once/save events/batch) → Item7 (computed fields) → Item8 (schema/type coercion) → Item9 (checkpoint/undo/redo)

**List progression:** List0 (traversal/parent) → List1 (add/remove events) → List2 (derived/filtered lists) → List3 (sorted derived) → List4 (reactive transform) → List5 (reactive filter via Item5 change events) → List6 (group_by / group_by_reactive) → List7 (sort_reactive) → List8 (index_by: O(1) lookup Map)

---

## Dev Conventions

- **No console.log clutter** in committed code (use it while debugging, remove it).
- **`ready` promises** — `item.ready` should mean "data loaded, children instantiated, ready to call get/set".
- **`toJSON()`** — nested Items implement `toJSON(){ return this.data }` so `JSON.stringify` traverses the object graph naturally.
- **`app.js`** is the single import entry point for pages: `import app, { el, div, h1, test } from "/app.js"`.
- **Constructor args via Object.assign** — the standard constructor pattern is `constructor(...args){ this.assign(...args) }` where `assign` does `Object.assign(this, ...args)`. This means `new Foo({ key: val })` works for any named property, in any order, all optional. Prefer this over positional arguments or custom destructuring. Subclasses call `super(...args)` and add their own defaults before or after.
- **Class-attached test suites** — test suites live on the class they test: `Item0.test = new Test0({ class: Item0 })`. The `.test.js` file (e.g. `Item0.test.js`) sets this up and re-exports the class. Higher levels import the lower class from its `.test.js` file to get the suite attached: `import Item0 from "../0/Item0.test.js"`. Then `Item1.test.add(Item0.test)` inherits the full contract.
- **Run node tests after edits** — after editing a class that has a `.test.js` file, run it: `node --import ./scripts/register.mjs public/framework/core/Item/0/Item0.test.js`. The `register.mjs` loader maps `/framework/...` imports and stubs browser-only modules (App, View). Exit 0 = all passed; failures print to stdout with ✓/✗ per assertion. Do this before reporting a change as working. If no `.test.js` exists yet, note it as a gap.
- **`readme.md` per module** — every module folder (`core/Foo/`, `ext/Bar/`) should have a `readme.md` design doc. When working in a module, check for its readme and update it: record decisions made, clear up questions that got answered, note new open questions, and add direction when a conversation leads somewhere. Keep readmes living documents, not snapshots.
- **Example `page.js` self-documents** — when writing a class's demo `page.js`, render a short **visible** "key takeaways" note near the top: the 1–3 insights that make this class unique (distilled from its `readme.md`, not the whole thing — we may import & render the full readme later). The point is that browsing the live pages reminds you roughly what each variant is and how it differs from its siblings. Keep it brief; the readme stays the full design doc.

## Testing with Test3

**Use Test3 for all new tests.** Read `public/framework/core/Test/3/readme.md` before writing tests.

```js
// MyClass.node.test.js
import MyClass from './MyClass.js';
import { test, assert } from '/framework/core/Test/3/Test3.js';

export default MyClass.test = test(MyClass, () => {

test("description", () => {
    const obj = new MyClass({ capture: false }); // capture:false for fixture objects
    assert(obj.value === 1, "default value");
});

});
```

- **File naming**: `*.node.test.js` — imported directly by `run-all.mjs`, no spawn.
- **`capture: false`** on any `new Test3(...)` or fixture object created *inside* a test body.
- **Variadic**: `test(MyClass, BaseClass.test, fn)` — inherited tests run before `fn`'s children.
- **Browser**: `import test_obj from "./MyClass.node.test.js"; test_obj.render();` in `page.js`.
- **Node**: `node --import ./scripts/register.mjs path/to/MyClass.node.test.js` or `node scripts/run-all.mjs`.

**Legacy**: Existing 26 suites use Test0/Test1 — do not migrate them. `app.js` still exports the original `test`; for Test3 import directly from `/framework/core/Test/3/Test3.js`.

For every task, make sure to consider this `CLAUDE.md` document thoroughly, and consider changes, revisions, updates, as necessary.