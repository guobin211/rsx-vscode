type ServerCapabilities = Record<string, unknown>

interface InitializeResult {
    capabilities: ServerCapabilities

    serverInfo?: {
        name: string
        version?: string
    }
}

export const initialize = (): InitializeResult => {
    return {
        capabilities: {
            completionProvider: {},
            textDocumentSync: 1,
            diagnosticProvider: {
                interFileDependencies: false,
                workspaceDiagnostics: false
            },
            codeActionProvider: true,
            hoverProvider: true
        },
        serverInfo: {
            name: 'rsx-analyzer',
            version: '0.2.3'
        }
    }
}
