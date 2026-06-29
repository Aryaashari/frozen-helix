import { page, h2, h3, p, div, el } from "/app.js";

// An "example set" — call it INSIDE a page's content fn and its page() calls
// are captured as sub-pages of that page. This is the "import sets of pages,
// add them to the tree" pattern.
export default function elements(){
    page("Elements", (e) => {
        h2("Element helpers");
        p("`div`, `p`, `h1`–`h6`, `el` create View instances. Calling them appends to the current captor — no JSX, no template strings.");

        page("Headings", () => {
            h2("Headings");
            ["h1", "h2", "h3"].forEach(tag => el(tag, `This is an <${tag}>`));
        });

        page("Text", () => {
            h3("Paragraphs");
            p("`p()` supports `backticks` → inline <code> automatically.");
            p("Each call appends in order to the page.");
        });

        page("Boxes", () => {
            h3("Styled boxes");
            p("`.ac(class)` adds classes; style them with a <style> tag.");
            el("style", `.demo-box{display:flex;gap:.5em}.demo-box>div{padding:1em;color:#fff;border-radius:.3em}`);
            div.c("demo-box", () => {
                div("A").style({ background: "#3b82f6" });
                div("B").style({ background: "#10b981" });
                div("C").style({ background: "#f59e0b" });
            });
        });
    });
}
