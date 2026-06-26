import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const OUT = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'http://localhost:3131';
const URL  = BASE + '/framework/ext/WebEditor/0/';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await ctx.newPage();

const errors = [];
const warns  = [];
const r404s  = [];
page.on('console', m => {
    if (m.type() === 'error')   errors.push(m.text());
    if (m.type() === 'warning') warns.push(m.text());
});
page.on('pageerror', e => errors.push('[pageerror] ' + e.message));
page.on('response', r => { if (r.status() === 404) r404s.push(r.url()); });

// Step 1: navigate
console.log('Step 1: navigate');
await page.goto(URL, { waitUntil: 'networkidle', timeout: 20000 });
await page.screenshot({ path: path.join(OUT, 'we-01-initial.png') });

// Step 2: three-panel layout
const sidebar  = await page.$('.we-sidebar');
const canvas   = await page.$('.we-canvas');
const props    = await page.$('.we-props');
const header   = await page.$('.we-header');
const undoBtn  = await page.$('.we-btn[title="Undo"]');
const saveBtn  = await page.$('.we-save-btn');
const libItems = await page.$$('.lib-item');
const rootNode = await page.$('[data-node-id="root"]');
console.log('Step 2 layout: sidebar=%s canvas=%s props=%s header=%s', !!sidebar, !!canvas, !!props, !!header);
console.log('Step 2 controls: undo=%s save=%s lib-items=%d root-node=%s', !!undoBtn, !!saveBtn, libItems.length, !!rootNode);

// Step 3: insert nodes via tree API (exposed as window.__we_editor)
console.log('Step 3: insert Frame + Text via tree API');
const inserted = await page.evaluate(async () => {
    await new Promise(r => setTimeout(r, 200)); // let socket connect
    const ed = window.__we_editor;
    if (!ed) return { ok: false, reason: 'no window.__we_editor' };
    const tree = ed.tree;

    const frame = tree.constructor.new_frame({ label: 'My Frame', bg: '#f0f0ff' });
    const text  = tree.constructor.new_text({ label: 'My Text', text: 'Hello World' });
    tree.insert(frame, 'root', 0);
    tree.insert(text,  'root', 1);
    return {
        ok: true,
        nodeIds: Array.from(document.querySelectorAll('[data-node-id]')).map(e => e.getAttribute('data-node-id')),
        dirty: Object.keys(tree._dirty),
    };
});
console.log('Step 3:', inserted);
await page.screenshot({ path: path.join(OUT, 'we-02-after-insert.png') });

// Step 4: click a child node to select it
console.log('Step 4: click a child node');
const allNodes = await page.$$('[data-node-id]');
console.log('  total nodes in DOM:', allNodes.length);
if (allNodes.length > 1) {
    await allNodes[1].click();
    await page.waitForTimeout(300);
}
await page.screenshot({ path: path.join(OUT, 'we-03-selected.png') });
const selectedIds = await page.$$eval('[data-node-id].selected', els => els.map(e => e.getAttribute('data-node-id')));
console.log('Step 4 selected:', selectedIds);

// Step 5: props panel content for selected node
const propsText = await page.$eval('.props-wrap', el => el.innerText.trim().slice(0, 300)).catch(() => '(not found)');
console.log('Step 5 props panel:\n', propsText.slice(0, 200));

// Step 6: Save
console.log('Step 6: click Save');
await page.click('.we-save-btn');
await page.waitForTimeout(2500); // wait long enough for WS round-trip + the 1500ms reset
const saveBtnText = await page.$eval('.we-save-btn', el => el.textContent.trim()).catch(() => '?');
const saveBtnDisabled = await page.$eval('.we-save-btn', el => el.disabled).catch(() => null);
console.log('Step 6 save btn: text=%s disabled=%s', saveBtnText, saveBtnDisabled);
await page.screenshot({ path: path.join(OUT, 'we-04-saved.png') });

// Step 7: verify save.json
console.log('Step 7: verify save.json');
const saveJson = await page.evaluate(async () => {
    try {
        const r = await fetch('/framework/ext/WebEditor/0/save.json?' + Date.now());
        if (!r.ok) return null;
        return r.json();
    } catch(e) { return null; }
});
console.log('Step 7 save.json:', saveJson ? 'EXISTS tree.id=' + saveJson?.tree?.id + ' children=' + saveJson?.tree?.children?.length : 'NOT FOUND');

// Step 8: undo check
console.log('Step 8: check undo state');
const undoDisabled = await page.$eval('.we-btn[title="Undo"]', el => el.disabled).catch(() => null);
const redoDisabled = await page.$eval('.we-btn[title="Redo"]', el => el.disabled).catch(() => null);
console.log('Step 8: undo-disabled=%s redo-disabled=%s', undoDisabled, redoDisabled);

// Step 9: reload + persistence check
console.log('Step 9: reload and verify persistence');
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(600);
const nodesAfterReload = await page.$$eval('[data-node-id]', els => els.length).catch(() => 0);
console.log('Step 9 nodes after reload:', nodesAfterReload, '(expect > 1 if save.json was written)');
await page.screenshot({ path: path.join(OUT, 'we-05-reloaded.png') });

// Report
console.log('\n=== 404s ===');
r404s.filter(u => !u.includes('?')).forEach(u => console.log('404:', u)); // skip our cache-bust fetch
console.log('\n=== CONSOLE ERRORS ===');
if (errors.length === 0) console.log('(none)');
else errors.forEach(e => console.log('ERR:', e));
console.log('\n=== WARNINGS ===');
if (warns.length === 0) console.log('(none)');
else warns.forEach(w => console.log('WARN:', w));
console.log('\nScreenshots:', OUT);
await browser.close();
