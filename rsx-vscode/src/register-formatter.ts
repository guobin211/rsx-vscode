import * as vscode from 'vscode'
import { RSXFormatter } from './formatter'

export function registerFormatter(context: vscode.ExtensionContext) {
    // 注册格式化提供者
    const formatter = new RSXFormatter()
    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider('rsx', formatter)
    )

    // 添加格式化命令
    context.subscriptions.push(
        vscode.commands.registerCommand('rsx.format', () => {
            const editor = vscode.window.activeTextEditor
            if (editor && editor.document.languageId === 'rsx') {
                vscode.commands.executeCommand('editor.action.formatDocument')
            }
        })
    )
}
