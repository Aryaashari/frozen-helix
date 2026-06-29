// Run all test files under public/framework/
// *.node.test.js — imported; run() + report() called here
// *.test.js      — spawned; they self-run via run_if_main guard
import { spawnSync } from 'child_process';
import { readdirSync } from 'fs';
import { pathToFileURL } from 'url';
import path from 'path';
import { fileURLToPath } from 'url';

// *.node.test.js files import via absolute /framework/... paths, which only
// resolve through register.mjs's loader. Since we import them in-process, this
// script must itself run with that loader. If it isn't, re-exec with it.
if (!process.env.RUN_ALL_LOADED) {
    const self = fileURLToPath(import.meta.url);
    const r = spawnSync(process.execPath, ['--import', './scripts/register.mjs', self], {
        stdio: 'inherit',
        env: { ...process.env, RUN_ALL_LOADED: '1' },
    });
    process.exit(r.status ?? 1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', 'public', 'framework');

const SKIP_DIRS = new Set(['game']);

function find_tests(dir, node = [], classic = []) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith('.') && !SKIP_DIRS.has(entry.name)) {
            find_tests(full, node, classic);
        } else if (entry.name.endsWith('.node.test.js')) {
            node.push(full);
        } else if (entry.name.endsWith('.test.js')) {
            classic.push(full);
        }
    }
    return { node, classic };
}

const { node, classic } = find_tests(root);
let passed = 0, failed = 0;

// *.node.test.js — import and call run() + report()
for (const file of node) {
    const rel = path.relative(process.cwd(), file).split(path.sep).join('/');
    try {
        const mod = await import(pathToFileURL(file).href);
        const suite = mod.default;
        suite.run().report();
        if (suite.failed) {
            failed++;
        } else {
            passed++;
        }
    } catch(e) {
        console.error(`ERROR: ${rel}\n  ${e.message}`);
        failed++;
    }
}

// *.test.js (classic) — spawn; they self-run via run_if_main guard
for (const file of classic) {
    const rel = path.relative(process.cwd(), file).split(path.sep).join('/');
    const result = spawnSync(
        process.execPath,
        ['--import', './scripts/register.mjs', file],
        { stdio: 'inherit' }
    );
    if (result.status === 0) {
        passed++;
    } else {
        console.error(`FAILED: ${rel}`);
        failed++;
    }
}

const total = node.length + classic.length;
console.log(`\n${total} suites: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
