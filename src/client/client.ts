import * as path from 'node:path'
import { workspace, ExtensionContext } from 'vscode'

import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node'

let client: LanguageClient

export function activate(context: ExtensionContext) {
    const serverModule = context.asAbsolutePath(path.join('dist', 'server.js'))

    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.stdio },
        debug: {
            module: serverModule,
            transport: TransportKind.stdio
        }
    }

    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'rsx' }],
        synchronize: {
            fileEvents: workspace.createFileSystemWatcher('**/.rsx')
        }
    }

    client = new LanguageClient('rsx-vscode', 'rsx-vscode', serverOptions, clientOptions)

    client.start()
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined
    }
    return client.stop()
}
