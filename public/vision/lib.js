// Shared helpers for the /vision/ pages.
// p() only auto-wraps `code` spans — it does NOT understand **bold**.
// md() adds **bold** on top, so the docs can use light markdown inline.
import { el, p, div, style } from "/app.js";

// Parse a string into a <p> with **bold** → <strong> and `code` → <code>.
// Mixed parts (strings + Views) are passed straight to p(), whose
// backtick_append handles strings and appends Views (the append moves
// any auto-captured child into the <p>, so capture order self-corrects).
export function md(text) {
    const re = /\*\*([^*]+)\*\*|`([^`]+)`/g;
    const parts = [];
    let last = 0, m;
    while ((m = re.exec(text)) !== null) {
        if (m.index > last) parts.push(text.slice(last, m.index));
        if (m[1] !== undefined) parts.push(el("strong", m[1])); // **bold**
        else parts.push(el("code", m[2]));                      // `code`
        last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return p(...parts);
}

// A breadcrumb / next-link line.
export function crumb(href, label) {
    return p(() => { el("a", label).href(href); }).ac("crumb");
}

// Inject the shared vision-page styles once.
export function vstyle(extra = "") {
    style(`
        .crumb a { color: var(--prim); text-decoration: none; }
        .callout { border-left: 4px solid var(--prim); background: #f6f6ff; padding: 1em 1.25em; border-radius: 0 8px 8px 0; margin: 1em 0; }
        .callout.bad  { border-left-color: #c0392b; background: #fff4f2; }
        .callout.good { border-left-color: #2e7d32; background: #f2faf3; }
        pre.code { background: #1e1e26; color: #e6e6e6; padding: 1em 1.25em; border-radius: 8px; overflow-x: auto; font-size: .85em; line-height: 1.5; }
        pre.code .c { color: #7a8aa0; } /* comment */
        pre.code .g { color: #82d982; } /* good / added */
        ${extra}
    `);
}
