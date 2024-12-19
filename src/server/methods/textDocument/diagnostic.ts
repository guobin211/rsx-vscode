import { RequestMessage } from '../../server'
import { Range } from '../../types'

import logger from '../../logger'

import { TextDocumentIdentifier, documents } from '../../documents'
import { importSuggestions } from '../../import-suggestions'

interface DocumentDiagnosticParams {
    textDocument: TextDocumentIdentifier
}

const DiagnosticSeverity = {
    Error: 1,
    Warning: 2,
    Information: 3,
    Hint: 4
} as const

type DiagnosticSeverityValue = 1 | 2 | 3 | 4

interface SpellingSuggestionData {
    wordSuggestions: string[]
    type: 'spelling-suggestion'
}

export interface Diagnostic {
    range: Range
    severity: DiagnosticSeverityValue
    source: 'LSP From Scratch'
    message: string
    data: SpellingSuggestionData
}

interface FullDocumentDiagnosticReport {
    kind: 'full'
    items: Diagnostic[]
}

/**
 * 代码诊断
 */
export const diagnostic = (message: RequestMessage): FullDocumentDiagnosticReport | null => {
    const params = message.params as DocumentDiagnosticParams
    const content = documents.get(params.textDocument.uri)

    if (!content) {
        return null
    }

    const invalidWordsAndSuggestions: Record<string, string[]> = importSuggestions(content)

    logger.write({ spellingSuggestions: invalidWordsAndSuggestions })

    const items: Diagnostic[] = []

    const contentLines = content.split('\n')

    for (const invalidWord of Object.keys(invalidWordsAndSuggestions)) {
        const regex = new RegExp(`\\b${invalidWord}\\b`, 'g')
        const wordSuggestions = invalidWordsAndSuggestions[invalidWord]

        const message = wordSuggestions.length
            ? `${invalidWord} isn't in rsx component. Did you mean: ${wordSuggestions.join(', ')}`
            : `${invalidWord} isn't in rsx component.`

        contentLines.forEach((line, lineNumber) => {
            let match: RegExpExecArray | null
            while ((match = regex.exec(line)) !== null) {
                items.push({
                    source: 'LSP From Scratch',
                    severity: DiagnosticSeverity.Error,
                    range: {
                        start: { line: lineNumber, character: match.index },
                        end: {
                            line: lineNumber,
                            character: match.index + invalidWord.length
                        }
                    },
                    message,
                    data: {
                        wordSuggestions,
                        type: 'spelling-suggestion'
                    }
                })
            }
        })
    }

    return {
        kind: 'full',
        items
    }
}
