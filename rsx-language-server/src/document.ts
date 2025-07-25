import type { RSXFile } from 'tree-sitter-rsx'

export interface Document {
    uri: string
    languageId: string
    rsx?: RSXFile
}
