import { page, h2, h3, p, div } from "/app.js";

// Interactive examples — real event handlers via View.click() and .text()/.ac().
export default function interactive(){
    page("Interactive", (i) => {
        h2("Interactive");
        p("Views have a chaining API: `.click(fn)`, `.text(v)`, `.ac/.rc(class)`. No virtual DOM.");

        page("Counter", () => {
            h3("Counter");
            p("Click the button — it mutates the View directly.");
            let n = 0;
            const out = div.c("counter-out", "0");
            div.c("btn", "+1").click(() => out.text(String(++n)));
        });

        page("Toggle", () => {
            h3("Toggle");
            p("Toggle a class on click.");
            const box = div.c("toggle-box", "off");
            box.click(() => {
                box.toggle_class("on");
                box.text(box.has_class("on") ? "on" : "off");
            });
        });

        page("Style", () => {
            h3("Inline style");
            const btn = div.c("btn", "Randomize color");
            btn.click(() => {
                const c = "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
                btn.style({ background: c, color: "#fff" });
            });
        });
    });
}
