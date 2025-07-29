import type { CodeMapping, LanguagePlugin, Mapping, VirtualCode } from '@volar/language-core'
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
        console.log(
            `Updating virtual code for ${uri} with language ID ${languageCode.languageId} snapshot ${snapshot}`
        )
        return languageCode
    }
} satisfies LanguagePlugin<URI>

class RsxCode implements VirtualCode {
    id = 'root'
    languageId = 'rsx'
    embeddedCodes: VirtualCode[] = []
    mappings: CodeMapping[]
    associatedScriptMappings?: Map<unknown, CodeMapping[]> | undefined
    linkedCodeMappings?: Mapping<unknown>[] | undefined

    constructor(
        public uri: URI,
        public snapshot: ts.IScriptSnapshot
    ) {
        this.onSnapshotUpdated()
        this.mappings = []
    }

    public update(newSnapshot: ts.IScriptSnapshot) {
        this.snapshot = newSnapshot
        this.onSnapshotUpdated()
    }

    public onSnapshotUpdated() {}
}
