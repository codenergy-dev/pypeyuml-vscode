// --- extension.ts (VSCode Extension Entry Point) ---

import * as vscode from 'vscode';
import { CompletionItemProvider } from './providers/completion-item-provider';
import { DocumentLinkProvider } from './providers/document-link-provider';
import { findPipelineFiles } from './functions/find-pipeline-files';
import { extractPipelineInfo } from './functions/extract-pipeline-info';

let pipelineData: Record<string, string[]> = {};

export function activate(context: vscode.ExtensionContext) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) return;

  const rootPath = workspaceFolders[0].uri.fsPath;
  const pipelineFiles = findPipelineFiles(rootPath);
  pipelineFiles.forEach(fullPath => {
    const info = extractPipelineInfo(fullPath);
    if (info) {
      const [name, args] = info;
      pipelineData[name] = args;
    }
  });

  context.subscriptions.push(CompletionItemProvider(pipelineData));
  context.subscriptions.push(DocumentLinkProvider());
}

export function deactivate() {}