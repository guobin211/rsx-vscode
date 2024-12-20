import { DocumentUri } from '../workspace/documents'
import { Position, Range } from '../types'
import { RequestMessage } from 'vscode-languageserver'

type HoverParams = {
    textDocument: { uri: DocumentUri }
    position: Position
}

type Hover = {
    contents: {
        kind: 'markdown'
        value: string
    }
    range: Range
}

/**
 * hover效果
 */
export const hover = (message: RequestMessage): Hover | null => {
    const params = message.params as HoverParams
    return null
}
