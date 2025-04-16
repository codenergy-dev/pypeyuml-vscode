import * as vscode from 'vscode';
import { findFileInWorkspace } from '../functions/find-file-in-workspace';

export const DocumentLinkProvider = () => vscode.languages.registerDocumentLinkProvider({ scheme: 'file', language: 'yuml' }, {
  provideDocumentLinks(document) {
    const links: vscode.DocumentLink[] = [];
    const regex = /\[([a-zA-Z0-9_]+)(?:\|[^\]]*)?\]/g;

    const text = document.getText();
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text))) {
      const pipelineName = match[1];
      const startPos = document.positionAt(match.index + 1);
      const endPos = document.positionAt(match.index + 1 + pipelineName.length);

      const fileName = `${pipelineName}.py`;
      const pipelinePath = findFileInWorkspace(`${pipelineName}.py`);

      if (pipelinePath) {
        const uri = vscode.Uri.file(pipelinePath);
        links.push(new vscode.DocumentLink(new vscode.Range(startPos, endPos), uri));
      }
    }

    return links;
  }
});