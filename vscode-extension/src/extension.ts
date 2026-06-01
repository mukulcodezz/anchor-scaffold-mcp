import * as vscode from "vscode";

const SECRET_KEY = "anchorScaffold.apiKey";
const PROVIDER_ID = "anchorScaffold.provider";

export function activate(context: vscode.ExtensionContext): void {
  const didChange = new vscode.EventEmitter<void>();
  context.subscriptions.push(didChange);

  // Re-resolve the server definition whenever the stored key changes.
  context.subscriptions.push(
    context.secrets.onDidChange((e) => {
      if (e.key === SECRET_KEY) {
        didChange.fire();
      }
    })
  );

  // Re-resolve when relevant settings change.
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("anchorScaffold")) {
        didChange.fire();
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("anchorScaffold.setApiKey", async () => {
      const key = await vscode.window.showInputBox({
        prompt: "Enter your AI provider API key (Claude or OpenAI).",
        placeHolder: "sk-...",
        password: true,
        ignoreFocusOut: true,
      });
      if (key === undefined) {
        return; // cancelled
      }
      const trimmed = key.trim();
      if (!trimmed) {
        vscode.window.showWarningMessage("Anchor Scaffold: empty key not saved.");
        return;
      }
      await context.secrets.store(SECRET_KEY, trimmed);
      vscode.window.showInformationMessage("Anchor Scaffold: API key saved.");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("anchorScaffold.clearApiKey", async () => {
      await context.secrets.delete(SECRET_KEY);
      vscode.window.showInformationMessage("Anchor Scaffold: API key cleared.");
    })
  );

  context.subscriptions.push(
    vscode.lm.registerMcpServerDefinitionProvider(PROVIDER_ID, {
      onDidChangeMcpServerDefinitions: didChange.event,
      provideMcpServerDefinitions: async () => {
        const cfg = vscode.workspace.getConfiguration("anchorScaffold");
        const provider = cfg.get<string>("provider", "claude");
        const model = cfg.get<string>("model", "");
        const baseUrl = cfg.get<string>("baseUrl", "");
        const apiKey = (await context.secrets.get(SECRET_KEY)) ?? "";

        const env: Record<string, string> = {
          SCAFFOLD_PROVIDER: provider,
        };
        if (apiKey) {
          env.SCAFFOLD_API_KEY = apiKey;
        }
        if (model) {
          env.SCAFFOLD_MODEL = model;
        }
        if (baseUrl) {
          env.SCAFFOLD_BASE_URL = baseUrl;
        }

        // npx resolves the npm package on first run. Windows needs npx.cmd.
        const command = process.platform === "win32" ? "npx.cmd" : "npx";

        return [
          new vscode.McpStdioServerDefinition(
            "Anchor Scaffold",
            command,
            ["-y", "anchor-scaffold-mcp"],
            env
          ),
        ];
      },

      resolveMcpServerDefinition: async (server) => {
        // Prompt for the key on first use if it is missing.
        const apiKey = await context.secrets.get(SECRET_KEY);
        if (!apiKey) {
          const choice = await vscode.window.showWarningMessage(
            "Anchor Scaffold needs an API key to generate code.",
            "Set API Key"
          );
          if (choice === "Set API Key") {
            await vscode.commands.executeCommand("anchorScaffold.setApiKey");
          }
        }
        return server;
      },
    })
  );
}

export function deactivate(): void {
  // Nothing to clean up beyond context.subscriptions.
}
