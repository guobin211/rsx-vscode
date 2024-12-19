import { DocumentUri, wordUnderCursor } from '../../documents'
import { RequestMessage } from '../../server'
import { Position, Range } from '../../types'

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

    const currentWord = wordUnderCursor(params.textDocument.uri, params.position)

    if (!currentWord) {
        return null
    }

    const value = `(rsx) ${currentWord.text}
props: {}
import ${currentWord.text}
`

    return {
        contents: {
            kind: 'markdown',
            value
        },
        range: currentWord.range
    }
}
