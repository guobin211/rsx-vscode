import { CompletionItemKind } from '@volar/language-server'
import type { LanguageServiceContext, LanguageServicePluginInstance } from '@volar/language-service'

export const service = {
    name: 'rsx-service',
    create(context: LanguageServiceContext): LanguageServicePluginInstance {
        console.log('[rsx-service] create context:', context)
        return {
            provideCompletionItems(document, position, token) {
                console.log('[rsx-service] provideCompletionItems called:', {
                    document,
                    position,
                    token
                })
                return {
                    isIncomplete: true,
                    items: [
                        {
                            label: 'RsxExample',
                            kind: CompletionItemKind.Text,
                            isIncomplete: false
                        }
                    ]
                }
            }
        }
    }
}
