import app, { h1, p, div, el, style } from "/app.js";

app.$root.ac("page");
h1("Playwright Test Page");
p("This page is for experimenting with Playwright.");
div.c("status", "Ready.");

el("button", "Click me").click(() => {
    console.log("button clicked");
    alert("Hello from Playwright!");
});

style(`
  .icons { display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: 10px; margin-top: 28px; }
  .icon-card { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 12px 8px 10px; border: 1px solid #e0e0dc; border-radius: 8px; background: #fff; cursor: default; user-select: none; }
  .icon-card:hover { background: #f5f5f4; }
  .thumb { width: 46px; height: 34px; display: flex; align-items: center; justify-content: center; }
  .icon-label { font-size: 11px; color: #888; font-weight: 500; }
  /* mini blocks */
  .b  { background: #ccc; border-radius: 2px; flex-shrink: 0; }
  .bd { background: #aaa; border-radius: 2px; flex-shrink: 0; }
  /* layout utils — order matters: later classes override earlier ones */
  .r   { display: flex; flex-direction: row; align-items: center; gap: 3px; }
  .cv  { display: flex; flex-direction: column; gap: 2px; }
  .f1  { flex: 1; }
  .ac  { align-items: center; }
  .af  { align-items: flex-start; }
  .ae  { align-items: flex-end; }
  .as  { align-items: stretch; }
  .jc  { justify-content: center; }
  .jsb { justify-content: space-between; }
  .w38 { width: 38px; }
  .h26 { height: 26px; }
  .g2  { gap: 2px; }
  /* special thumbnail backgrounds / borders */
  .circ   { border-radius: 50%; }
  .dashed { border: 1.5px dashed #bbb; border-radius: 3px; }
  .img-bg { background: #e0e0dc; border-radius: 3px; }
  .cta-bg { background: #e9e9e6; border-radius: 3px; padding: 4px; box-sizing: border-box; }
  .grid3  { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2px; width: 38px; height: 26px; }
`);

const bar  = (w, h, dark) => div.c(dark ? "bd" : "b").style({ width: w, height: h });
const card = (label, draw) =>
    div.c("icon-card", () => {
        div.c("thumb", draw);
        el("span").ac("icon-label").text(label);
    });

div.c("icons", () => {

    card("Frame", () => {
        div.c("r jc w38 h26 dashed", () => {
            bar("14px", "10px");
        });
    });

    card("Columns", () => {
        div.c("r as g2 w38 h26", () => {
            div.c("b f1");
            div.c("b f1");
        });
    });

    card("Row", () => {
        div.c("r g2 w38", () => {
            bar("16px", "20px");
            bar("16px", "20px");
        });
    });

    card("Grid", () => {
        div.c("grid3", () => {
            for (let i = 0; i < 6; i++) div.c("b");
        });
    });

    card("Text", () => {
        div.c("cv w38", () => {
            bar("90%", "3px", true);
            bar("100%", "3px");
            bar("75%", "3px");
            bar("85%", "3px");
        });
    });

    card("Image", () => {
        div.c("r jc w38 h26 img-bg", () => {
            div.c("bd circ").style({ width: "12px", height: "12px" });
        });
    });

    card("Navbar", () => {
        div.c("r jsb w38", () => {
            bar("8px", "6px", true);
            div.c("r g2", () => {
                bar("6px", "3px");
                bar("6px", "3px");
                bar("6px", "3px");
            });
        });
    });

    card("Hero", () => {
        div.c("cv ac w38", () => {
            bar("65%", "5px", true);
            bar("85%", "3px");
            bar("70%", "3px");
            div.c("b").style({ width: "14px", height: "5px", marginTop: "4px" });
        });
    });

    card("Features", () => {
        div.c("r af g2 w38", () => {
            for (let i = 0; i < 3; i++) {
                div.c("cv f1", () => {
                    div.c("b").style({ width: "8px", height: "8px", borderRadius: "3px" });
                    bar("100%", "3px", true);
                    bar("100%", "3px");
                });
            }
        });
    });

    card("Sidebar", () => {
        div.c("r g2 w38", () => {
            div.c("b").style({ flex: "2", height: "18px" });
            div.c("cv f1 g2", () => {
                div.c("b").style({ width: "100%", height: "8px" });
                div.c("b").style({ width: "100%", height: "8px" });
            });
        });
    });

    card("Gallery", () => {
        div.c("grid3", () => {
            for (let i = 0; i < 6; i++) div.c("bd");
        });
    });

    card("Pricing", () => {
        div.c("r ae g2 w38 h26", () => {
            bar("11px", "12px");
            bar("11px", "22px", true);
            bar("11px", "12px");
        });
    });

    card("Testimonial", () => {
        div.c("cv ac w38", () => {
            bar("80%", "3px");
            bar("90%", "3px");
            bar("65%", "3px");
            div.c("bd circ").style({ width: "10px", height: "10px", marginTop: "3px" });
        });
    });

    card("CTA", () => {
        div.c("cv ac jc w38 h26 cta-bg", () => {
            bar("60%", "4px", true);
            bar("80%", "3px");
            div.c("b").style({ width: "14px", height: "5px", marginTop: "2px" });
        });
    });

    card("Footer", () => {
        div.c("r g2 w38", () => {
            bar("10px", "14px", true);
            for (let i = 0; i < 3; i++) {
                div.c("cv f1 g2", () => {
                    bar("100%", "3px");
                    bar("80%", "3px");
                    bar("90%", "3px");
                });
            }
        });
    });

});
