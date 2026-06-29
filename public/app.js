import Lew42 from "./framework/ext/Lew42/Lew42.js";
import dum from "./framework/dum/dum.js";
import "./framework/core/View/ResizeObserver.js";

const app = new Lew42();

app.dum = dum;

export default app;
export { app };
export * from "./framework/ext/Lew42/Lew42.js";
export { dum };

// Framework primitives — importable from /app.js for convenience
export { default as Item  } from "./framework/core/Item/Item.js";
export { default as List  } from "./framework/core/List/List.js";
export { default as Page, page } from "./framework/core/Page/Page.js";
export { default as Store } from "./framework/ext/Store/Store.js";
export { default as FileSaver         } from "./framework/ext/Saver/FileSaver/FileSaver.js";
export { default as MemorySaver       } from "./framework/ext/Saver/MemorySaver/MemorySaver.js";
export { default as LocalStorageSaver } from "./framework/ext/Saver/LocalStorageSaver/LocalStorageSaver.js";
export { default as ListSaver         } from "./framework/ext/Saver/ListSaver/ListSaver.js";
export * from "./framework/ext/Bind/bind.js";

// UI controls and UX patterns
export { default as ui } from "./framework/ui/ui.js";
export { default as ux } from "./framework/ux/ux.js";

// Keyboard shortcut manager
export { default as Keys } from "./framework/ext/Keys/Keys.js";