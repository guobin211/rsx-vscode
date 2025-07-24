import * as vscode from 'vscode'

export function registerFormatter(context: vscode.ExtensionContext) {
    // 注册格式化
    const scssFormatter = vscode.languages.registerDocumentFormattingEditProvider(
        { language: 'rsx', pattern: '**/*.rsx' },
        {
            provideDocumentFormattingEdits(
                _document: vscode.TextDocument,
                _options: vscode.FormattingOptions
            ): vscode.TextEdit[] {
                return []
            }
        }
    )
    context.subscriptions.push(scssFormatter)
}
