import app, { el, div, h1, h2, p } from "/app.js";

app.$root.ac("pad");

h1("Layout");
div.c("card", () => {
    h2("Layout");
    p("Layout is a system for arranging elements on a page.");
});