import { NotificationMessage } from 'vscode-languageserver/node'
import {
    VersionedTextDocumentIdentifier,
    TextDocumentContentChangeEvent,
    updateDocuments
} from '../workspace/documents'

interface DidChangeTextDocumentParams {
    textDocument: VersionedTextDocumentIdentifier
    contentChanges: TextDocumentContentChangeEvent[]
}

export const didChange = async (message: NotificationMessage) => {
    const params = message.params as DidChangeTextDocumentParams
    if (params.textDocument.uri) {
    }
}
