import type { InitializeParams } from 'vscode-languageserver'
import type { Document } from './document'

export type Workspace = {
    root: string
    pages: Map<string, Document>
    components: Map<string, Document>
    reactFiles: Map<string, Document>
    vueFiles: Map<string, Document>
    svelteFiles: Map<string, Document>
}

export const workspace: Workspace = {
    root: '',
    pages: new Map(),
    components: new Map(),
    reactFiles: new Map(),
    vueFiles: new Map(),
    svelteFiles: new Map()
}

export function initWorkspace(params: InitializeParams) {
    const root = params.workspaceFolders?.[0].uri || params.rootPath
    workspace.root = root!
}
