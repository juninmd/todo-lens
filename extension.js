const vscode = require("vscode");
const { scanText } = require("./src/scan");

/** TreeDataProvider backed by a scan of the active editor. */
class TodoProvider {
  constructor() {
    this._onDidChange = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChange.event;
    this.items = [];
  }

  refresh() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      this.items = [];
    } else {
      const tags = vscode.workspace.getConfiguration("todoLens").get("tags");
      this.items = scanText(editor.document.getText(), tags);
    }
    this._onDidChange.fire();
    return this.items.length;
  }

  getChildren() {
    return this.items.map((it) => {
      const node = new vscode.TreeItem(`${it.tag}: ${it.message || "(sem texto)"}`);
      node.description = `linha ${it.line + 1}`;
      node.iconPath = new vscode.ThemeIcon(it.tag === "FIXME" || it.tag === "BUG" ? "bug" : "note");
      node.command = {
        command: "todoLens.jump",
        title: "jump",
        arguments: [it.line, it.col],
      };
      return node;
    });
  }

  getTreeItem(el) {
    return el;
  }
}

function activate(context) {
  const provider = new TodoProvider();
  vscode.window.registerTreeDataProvider("todoLensView", provider);

  const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
  status.command = "todoLens.refresh";
  context.subscriptions.push(status);

  const update = () => {
    const n = provider.refresh();
    status.text = `$(checklist) ${n} TODO${n === 1 ? "" : "s"}`;
    status.tooltip = "todo-lens — clique para atualizar";
    status.show();
  };

  context.subscriptions.push(
    vscode.commands.registerCommand("todoLens.refresh", update),
    vscode.commands.registerCommand("todoLens.jump", (line, col) => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const pos = new vscode.Position(line, col);
      editor.selection = new vscode.Selection(pos, pos);
      editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenter);
    }),
    vscode.window.onDidChangeActiveTextEditor(update),
    vscode.workspace.onDidSaveTextDocument(update),
  );

  update();
}

function deactivate() {}

module.exports = { activate, deactivate };
