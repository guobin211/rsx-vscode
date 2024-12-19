import { NotificationMessage } from '../../server'
import { documents, VersionedTextDocumentIdentifier, TextDocumentContentChangeEvent } from '../../documents'

interface DidChangeTextDocumentParams {
    textDocument: VersionedTextDocumentIdentifier
    contentChanges: TextDocumentContentChangeEvent[]
}

export const didChange = (message: NotificationMessage): void => {
    const params = message.params as DidChangeTextDocumentParams
}
