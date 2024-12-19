const components = ['Header', 'Footer', 'Login']

export const importSuggestions = (content: string): Record<string, string[]> => {
    const invalidWordsAndSuggestions: Record<string, string[]> = {}
    if (content.length > 2) {
        const words = content.split(/\s+/)
        for (const word of words) {
            if (components.includes(word)) {
                invalidWordsAndSuggestions[word] = components
            }
        }
    }
    return invalidWordsAndSuggestions
}
