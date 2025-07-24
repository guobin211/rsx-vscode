import * as vscode from 'vscode'

export class RSXFormatter implements vscode.DocumentFormattingEditProvider {
    async provideDocumentFormattingEdits(
        document: vscode.TextDocument,
        _options: vscode.FormattingOptions,
        _token: vscode.CancellationToken
    ): Promise<vscode.TextEdit[]> {
        const text = document.getText()
        // 返回整个文档的编辑
        const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(text.length))

        return [vscode.TextEdit.replace(fullRange, text)]
    }

    // 动态注册格式化功能
    static register(context: vscode.ExtensionContext) {
        const formatter = new RSXFormatter()
        context.subscriptions.push(
            vscode.languages.registerDocumentFormattingEditProvider('rsx', formatter)
        )

        context.subscriptions.push(
            vscode.commands.registerCommand('rsx.format', () => {
                const editor = vscode.window.activeTextEditor
                if (editor && editor.document.languageId === 'rsx') {
                    vscode.commands.executeCommand('editor.action.formatDocument')
                }
            })
        )
    }
}
