import type { CodeMapping, LanguagePlugin, Mapping, VirtualCode } from '@volar/language-core'
import RSXParser, { ParsedSection, TemplateSection } from 'tree-sitter-rsx'
import type ts from 'typescript'
import type { URI } from 'vscode-uri'

export const plugin = {
    getLanguageId(uri) {
        if (uri.path.endsWith('.rsx')) {
            return 'rsx'
        }
        return undefined
    },
    createVirtualCode(uri, languageId, snapshot) {
        if (languageId === 'rsx') {
            return new RsxCode(uri, snapshot)
        }
        return undefined
    },
    updateVirtualCode(uri, languageCode, snapshot) {
        console.log(`Updating virtual code for ${uri} with language ID ${languageCode.languageId} snapshot ${snapshot}`)
        return languageCode
    }
} satisfies LanguagePlugin<URI>

function createSnapshot(snapshot: ts.IScriptSnapshot, section: ParsedSection | TemplateSection): ts.IScriptSnapshot {
    return {
        getText: function (start: number, end: number): string {
            return snapshot.getText(start + section.start, end + section.start)
        },
        getLength: function (): number {
            return snapshot.getLength() - section.start
        },
        getChangeRange: function (oldSnapshot: ts.IScriptSnapshot): ts.TextChangeRange | undefined {
            return oldSnapshot.getChangeRange(createSnapshot(oldSnapshot, section))
        }
    }
}

class RsxCode implements VirtualCode {
    languageId = 'rsx'
    id: string
    embeddedCodes: VirtualCode[] = []
    mappings: CodeMapping[]
    associatedScriptMappings?: Map<unknown, CodeMapping[]> | undefined
    linkedCodeMappings?: Mapping<unknown>[] | undefined
    rsxParser: RSXParser

    constructor(
        public uri: URI,
        public snapshot: ts.IScriptSnapshot
    ) {
        this.id = this.uri.toString()
        this.mappings = []
        this.rsxParser = new RSXParser()
        this.onSnapshotUpdated()
    }

    public update(newSnapshot: ts.IScriptSnapshot) {
        this.snapshot = newSnapshot
        this.onSnapshotUpdated()
    }

    public onSnapshotUpdated() {
        const code = this.snapshot.getText(0, this.snapshot.getLength())
        try {
            const res = this.rsxParser.parse(code)
            if (res.errors) {
                console.error(`Parsing error: ${JSON.stringify(res.errors)}`)
            } else {
                for (const section of res.sections) {
                    if (section.type === 'rust_section') {
                    }
                    if (section.type === 'script_section') {
                        const script: VirtualCode = {
                            id: `${this.id}_${section.type}`,
                            languageId: 'tsx',
                            snapshot: createSnapshot(this.snapshot, section),
                            mappings: [
                                {
                                    sourceOffsets: [section.start, section.end],
                                    generatedOffsets: [0, section.end - section.start],
                                    data: {
                                        verification: true,
                                        completion: true,
                                        semantic: true,
                                        navigation: true,
                                        structure: true,
                                        format: true
                                    },
                                    lengths: [section.end - section.start]
                                }
                            ]
                        }
                        this.embeddedCodes.push(script)
                        this.mappings.push({
                            sourceOffsets: [section.start, section.end],
                            generatedOffsets: [section.start, section.end],
                            data: {
                                verification: true,
                                completion: true,
                                semantic: true
                            },
                            lengths: [section.end - section.start]
                        })
                    }
                    if (section.type === 'template_section') {
                        this.mappings.push({
                            sourceOffsets: [section.start, section.end],
                            generatedOffsets: [section.start, section.end],
                            data: {
                                completion: true,
                                navigation: true
                            },
                            lengths: [section.end - section.start]
                        })
                    }
                    if (section.type === 'style_section') {
                        this.mappings.push({
                            sourceOffsets: [section.start, section.end],
                            generatedOffsets: [section.start, section.end],
                            data: {
                                verification: true,
                                format: true
                            },
                            lengths: [section.end - section.start]
                        })
                    }
                }
            }
        } catch (err) {
            console.error(`Error parsing RSX: ${err}`)
        }
    }
}
