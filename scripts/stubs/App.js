// Node test stub — replaces browser-only App/App.js during Node test runs.
import is from "../../public/framework/core/util/is/is.js";

class StubView {
    ac() { return this; }
    rc() { return this; }
    append() { return this; }
    static stylesheet() {}
}
const noop = () => new StubView();

// Minimal Events so browser-only modules (e.g. HashRouter `extends Events`) can
// be IMPORTED in Node. They are never instantiated in Node tests (they need
// `window`); this just lets the import graph resolve.
class Events {
    on() { return this; }
    off() { return this; }
    emit() { return this; }
}

export { StubView as View, Events, is, noop as el, noop as div, noop as h1, noop as h2, noop as p, noop as icon };
export const test = () => {};
export const assert = () => {};
export default { stylesheet() {} };
