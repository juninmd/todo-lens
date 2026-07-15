# ✅ todo-lens

A tiny **VS Code extension** that surfaces the `TODO` / `FIXME` / `HACK` / `XXX` / `BUG` / `NOTE` comments in the file you're editing — as a **sidebar tree** you can click to jump to, plus a **status-bar counter**.

No workspace-wide indexing, no noise — just the current file, updated on save and when you switch editors.

## Features
- Activity-bar view listing every tagged comment with its line and message.
- Click an item → cursor jumps to that line.
- Status bar shows the live count (`✔ 5 TODOs`); click to refresh.
- Configurable tag set (`todoLens.tags`).

## Install (dev)
```bash
# open this folder in VS Code, press F5 (Extension Development Host)
# or package it:
npx @vscode/vsce package
```

## Layout
- `src/scan.js` — pure scanner (`scanText`), unit-tested with `bun test`.
- `extension.js` — TreeDataProvider + status bar + jump command (the only file that imports `vscode`).

## Dev
```bash
bun test
```

MIT.
