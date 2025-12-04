import * as vscode from 'vscode';
import * as cp from 'node:child_process';
import {
    LanguageClient,
    type LanguageClientOptions,
    type Executable
} from 'vscode-languageclient/node';
import { logger, LogLevel } from './logger';

let client: LanguageClient;
let outputChannel: vscode.OutputChannel;

/**
 * 检查全局是否安装了 rsx-language-server
 */
function checkGlobalServer(): boolean {
    try {
        // Unix/Linux/macOS
        cp.execSync('which rsx-language-server', { encoding: 'utf-8', stdio: 'pipe' });
        return true;
    } catch {
        try {
            // Windows
            cp.execSync('where rsx-language-server', { encoding: 'utf-8', stdio: 'pipe' });
            return true;
        } catch {
            return false;
        }
    }
}

/**
 * 提示用户安装 rsx-language-server
 */
async function promptInstallServer(): Promise<boolean> {
    const choice = await vscode.window.showErrorMessage(
        'RSX Language Server is not installed globally. Would you like to install it?',
        'Install with npm',
        'Cancel'
    );

    if (choice === 'Install with npm') {
        const terminal = vscode.window.createTerminal('Install RSX Language Server');
        terminal.show();
        terminal.sendText('npm install -g rsx-language-server');
        vscode.window.showInformationMessage('Please restart VSCode after installation completes.');
        return false;
    }

    return false;
}

export async function activate(context: vscode.ExtensionContext) {
    console.log('RSX extension activate() called');

    // 创建输出通道
    outputChannel = vscode.window.createOutputChannel('RSX Language Server');
    outputChannel.appendLine('RSX extension activating...');
    logger.setOutputChannel(outputChannel);

    logger.init(LogLevel.DEBUG);
    logger.info('RSX VSCode extension activating');

    // 检查全局是否安装了 rsx-language-server
    if (!checkGlobalServer()) {
        logger.error('rsx-language-server not found in global PATH');
        await promptInstallServer();
        return;
    }

    logger.info('Found rsx-language-server in global PATH');

    // 使用全局命令启动语言服务器
    const serverExecutable: Executable = {
        command: 'rsx-language-server',
        args: ['--stdio'],
        options: {
            env: process.env
        }
    };

    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'rsx' }],
        synchronize: {
            fileEvents: vscode.workspace.createFileSystemWatcher('**/*.rsx')
        },
        outputChannel: outputChannel
    };

    // 创建语言客户端
    client = new LanguageClient(
        'RsxLanguageServer',
        'RSX Language Server',
        serverExecutable,
        clientOptions
    );
    logger.info('Language client created');

    // 启动客户端，这也会启动服务器
    try {
        await client.start();
        logger.info('Language client started successfully');
        vscode.window.showInformationMessage('RSX Language Server started');
    } catch (err) {
        logger.error('Failed to start language client', { error: String(err) });
        vscode.window.showErrorMessage(`RSX: Failed to start language server: ${err}`);
        return;
    }

    // 注册文档符号提供器
    registerDocumentSymbolProvider(context);
    logger.info('Document symbol provider registered');

    logger.info('RSX VSCode extension activated');
    outputChannel.appendLine('RSX extension activated successfully');
}

function registerDocumentSymbolProvider(context: vscode.ExtensionContext) {
    const symbolProvider = vscode.languages.registerDocumentSymbolProvider('rsx', {
        provideDocumentSymbols(document: vscode.TextDocument): vscode.DocumentSymbol[] {
            const symbols: vscode.DocumentSymbol[] = [];
            const text = document.getText();
            const lines = text.split('\n');

            let currentSection: string | null = null;
            let sectionStart = 0;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();

                if (line === '---') {
                    if (currentSection === null) {
                        currentSection = 'rust';
                        sectionStart = i;
                    } else if (currentSection === 'rust') {
                        symbols.push(
                            new vscode.DocumentSymbol(
                                'Rust Section',
                                'Server-side logic',
                                vscode.SymbolKind.Module,
                                new vscode.Range(sectionStart, 0, i, 0),
                                new vscode.Range(sectionStart, 0, i, 0)
                            )
                        );
                        currentSection = null;
                    }
                } else if (line.startsWith('<script')) {
                    currentSection = 'script';
                    sectionStart = i;
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
                        );
                        currentSection = null;
                    }
                } else if (line.startsWith('<template')) {
                    currentSection = 'template';
                    sectionStart = i;
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
                        );
                        currentSection = null;
                    }
                } else if (line.startsWith('<style')) {
                    currentSection = 'style';
                    sectionStart = i;
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
                        );
                        currentSection = null;
                    }
                }
            }

            return symbols;
        }
    });

    context.subscriptions.push(symbolProvider);
}

export function deactivate(): Thenable<void> | undefined {
    console.log('RSX extension deactivate() called');
    logger.info('RSX VSCode extension deactivating');
    logger.close();

    if (outputChannel) {
        outputChannel.appendLine('RSX extension deactivating...');
        outputChannel.dispose();
    }

    if (!client) {
        return undefined;
    }
    return client.stop();
}
