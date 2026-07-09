import app, { el, div, h1, h2, p, style, ux } from "/app.js";

app.$root.ac("page arya-page");

// Setup the styles for the page
style(`
.arya-page { max-width: 46em; margin: 0 auto; padding: 1.5em; line-height: 1.6; }

.arya-hero {
    text-align: center;
    padding: 2em 1em;
    border-radius: 1em;
    background: linear-gradient(135deg, #5b57d6, #8a4fff);
    color: #fff;
    margin-bottom: 1.5em;
}
.arya-hero .avatar {
    width: 5em; height: 5em;
    margin: 0 auto 0.6em;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8em; font-weight: 700;
}
.arya-hero h1 { margin: 0; font-size: 2em; }
.arya-hero .role { margin: 0.3em 0 0; opacity: 0.9; }

.arya-card {
    border: 1px solid #e6e6e3;
    border-radius: 0.75em;
    padding: 1.2em 1.4em;
    margin-bottom: 1.2em;
    background: #fafafa;
}
.arya-card h2 { margin: 0 0 0.5em; font-size: 1.2em; color: #5b57d6; }

.arya-skills { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 0.5em; }
.arya-skills li {
    padding: 0.3em 0.8em;
    border-radius: 2em;
    background: #ece9ff;
    color: #5b57d6;
    font-size: 0.9em;
}

.arya-counter { display: flex; align-items: center; gap: 1em; }
.arya-counter button {
    font-size: 1em; cursor: pointer;
    border: none; border-radius: 0.5em;
    padding: 0.5em 1.1em;
    background: #5b57d6; color: #fff;
    font-family: inherit;
}
.arya-counter button:hover { background: #4a46c0; }
.arya-counter .count { font-size: 1.4em; font-weight: 700; min-width: 1.5em; text-align: center; }

.arya-footer { text-align: center; color: #6b6b66; font-size: 0.9em; margin-top: 1.5em; }
`);

// Hero section
div.c("arya-hero", () => {
	div.c("avatar", "A");
	h1("Arya Ashari");
	p("Web Developer — exploring this framework").ac("role");
});

// About section
div.c("arya-card", () => {
	h2("About This");
	p("Hi! This page is built entirely with the `View` framework — no React, no JSX, no `innerHTML`. Every element is created through the `captor pattern`, so `h1()`, `p()`, and `div()` attach to their parent automatically.");
});

// Hobbies section
div.c("arya-card", () => {
	h2("Hobbies");
	el("ul", () => {
		for (const skill of ["Playing Football", "Programming", "Playing Chess"]) {
			el("li", skill);
		}
	}).ac("arya-skills");
});

// Interactive demo
div.c("arya-card", () => {
	h2("Interactive Demo");
	p("Click the buttons to see View's built-in event handling:");

	let count = 0;

	div.c("arya-counter", () => {
		el("button", "−").click(() => {
			// Don't allow the counter to go below 0.
			if (count - 1 < 0) {
				ux.toast("Counter can't go below 0!", { type: "error" });
				return;
			}
			display.text(String(--count));
		});
		var display = div.c("count", String(count));
		el("button", "+").click(() => display.text(String(++count)));
	});
});

// Footer Section
div.c("arya-footer", () => {
	p(() => el("a", "Back to home").href("/"));
});
