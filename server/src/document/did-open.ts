import { NotificationMessage } from 'vscode-languageserver'
import { DocumentUri, updateDocuments } from '../workspace/documents'

type TextDocumentItem = {
    uri: DocumentUri
    languageId: string
    version: number
    text: string
}

interface DidOpenTextDocumentParams {
    textDocument: TextDocumentItem
}

export const didOpen = async (message: NotificationMessage) => {
    const params = message.params as DidOpenTextDocumentParams
    if (params.textDocument.uri) {
    }
}
