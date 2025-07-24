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
        documentSelector: [
            { scheme: 'file', language: 'rsx' },
            { scheme: 'untitled', language: 'rsx' }
        ],
        synchronize: {
            fileEvents: vscode.workspace.createFileSystemWatcher('**/*.rsx')
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

    // 注册文档符号提供器
    registerDocumentSymbolProvider(context)
}

function registerDocumentSymbolProvider(context: vscode.ExtensionContext) {
    const symbolProvider = vscode.languages.registerDocumentSymbolProvider('rsx', {
        provideDocumentSymbols(document: vscode.TextDocument): vscode.DocumentSymbol[] {
            const symbols: vscode.DocumentSymbol[] = []
            const text = document.getText()
            const lines = text.split('\n')

            let currentSection: string | null = null
            let sectionStart = 0

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim()

                if (line === '---') {
                    if (currentSection === null) {
                        currentSection = 'rust'
                        sectionStart = i
                    } else if (currentSection === 'rust') {
                        symbols.push(
                            new vscode.DocumentSymbol(
                                'Rust Section',
                                'Server-side logic',
                                vscode.SymbolKind.Module,
                                new vscode.Range(sectionStart, 0, i, 0),
                                new vscode.Range(sectionStart, 0, i, 0)
                            )
                        )
                        currentSection = null
                    }
                } else if (line.startsWith('<script')) {
                    currentSection = 'script'
                    sectionStart = i
                } else if (line === '</script>') {
                    if (currentSection === 'script') {
                        symbols.push(
                            new vscode.DocumentSymbol(
                                'Script Section',
                                'Client-side logic',
                                vscode.SymbolKind.Module,
                                new vscode.Range(sectionStart, 0, i, line.length),
                                new vscode.Range(sectionStart, 0, i, line.length)
                            )
                        )
                        currentSection = null
                    }
                } else if (line.startsWith('<template')) {
                    currentSection = 'template'
                    sectionStart = i
                } else if (line === '</template>') {
                    if (currentSection === 'template') {
                        symbols.push(
                            new vscode.DocumentSymbol(
                                'Template Section',
                                'HTML template',
                                vscode.SymbolKind.Module,
                                new vscode.Range(sectionStart, 0, i, line.length),
                                new vscode.Range(sectionStart, 0, i, line.length)
                            )
                        )
                        currentSection = null
                    }
                } else if (line.startsWith('<style')) {
                    currentSection = 'style'
                    sectionStart = i
                } else if (line === '</style>') {
                    if (currentSection === 'style') {
                        symbols.push(
                            new vscode.DocumentSymbol(
                                'Style Section',
                                'SCSS styles',
                                vscode.SymbolKind.Module,
                                new vscode.Range(sectionStart, 0, i, line.length),
                                new vscode.Range(sectionStart, 0, i, line.length)
                            )
                        )
                        currentSection = null
                    }
                }
            }

            return symbols
        }
    })

    context.subscriptions.push(symbolProvider)
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined
    }
    return client.stop()
}
