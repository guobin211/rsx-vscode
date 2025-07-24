import * as vscode from 'vscode'
import {
    LanguageClient,
    type LanguageClientOptions,
    type ServerOptions,
    TransportKind
} from 'vscode-languageclient/node'

let client: LanguageClient

export function activate(context: vscode.ExtensionContext) {
    // 语言服务器配置
    const serverModule = context.asAbsolutePath('dist/server.js')
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] }

    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: debugOptions
        }
    }

    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'rsx' }],
        synchronize: {
            fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
        }
    }

    // 创建语言客户端
    client = new LanguageClient(
        'rsxLanguageServer',
        'RSX Language Server',
        serverOptions,
        clientOptions
    )

    // 启动客户端，这也会启动服务器
    client.start()

    // 注册命令
    const disposable = vscode.commands.registerCommand('rsx.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from RSX!')
    })

    context.subscriptions.push(disposable)
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined
    }
    return client.stop()
}
