import * as path from 'node:path'
import * as glob from 'glob'
import type { InitializeParams } from 'vscode-languageserver'
import type { Document } from './document'

export type Workspace = {
    root: string
    pages: Map<string, Document>
    components: Map<string, Document>
    reactFiles: Map<string, Document>
    vueFiles: Map<string, Document>
    svelteFiles: Map<string, Document>
    rsxFiles: Map<string, Document>
}

export const workspace: Workspace = {
    root: '',
    pages: new Map(),
    components: new Map(),
    reactFiles: new Map(),
    vueFiles: new Map(),
    svelteFiles: new Map(),
    rsxFiles: new Map()
}

export function initWorkspace(params: InitializeParams) {
    const root = params.workspaceFolders?.[0].uri || params.rootPath
    workspace.root = root!
    indexFiles()
}

export async function indexFiles(): Promise<{
    rsxFiles: string[]
    vueFiles: string[]
    svelteFiles: string[]
    tsxFiles: string[]
}> {
    if (!workspace.root) {
        console.warn('[workspace] Root path not initialized')
        return { rsxFiles: [], vueFiles: [], svelteFiles: [], tsxFiles: [] }
    }

    const rootPath = workspace.root.replace('file://', '')
    try {
        // 定义忽略模式
        const ignorePatterns = [
            '**/node_modules/**',
            '**/.git/**',
            '**/dist/**',
            '**/build/**',
            '**/.next/**',
            '**/.nuxt/**',
            '**/coverage/**',
            '**/.cache/**'
        ]

        // 并行查找所有文件类型
        const [rsxFiles, vueFiles, svelteFiles, tsxFiles] = await Promise.all([
            glob.glob('**/*.rsx', { cwd: rootPath, absolute: true, ignore: ignorePatterns }),
            glob.glob('**/*.vue', { cwd: rootPath, absolute: true, ignore: ignorePatterns }),
            glob.glob('**/*.svelte', { cwd: rootPath, absolute: true, ignore: ignorePatterns }),
            glob.glob('**/*.tsx', { cwd: rootPath, absolute: true, ignore: ignorePatterns })
        ])

        console.log(
            `[workspace] Found files: ${rsxFiles.length} .rsx, ${vueFiles.length} .vue, ${svelteFiles.length} .svelte, ${tsxFiles.length} .tsx`
        )

        // 清空现有的文件映射
        workspace.rsxFiles.clear()
        workspace.vueFiles.clear()
        workspace.svelteFiles.clear()
        workspace.reactFiles.clear()

        // 处理每种文件类型
        const processFiles = (files: string[], map: Map<string, Document>, languageId: string) => {
            for (const filePath of files) {
                const relativePath = path.relative(rootPath, filePath)
                // 这里可以添加Document的创建逻辑
                map.set(relativePath, {
                    uri: filePath,
                    languageId
                })
            }
        }

        processFiles(rsxFiles, workspace.rsxFiles, 'rsx')
        processFiles(vueFiles, workspace.vueFiles, 'vue')
        processFiles(svelteFiles, workspace.svelteFiles, 'svelte')
        processFiles(tsxFiles, workspace.reactFiles, 'react')

        return { rsxFiles, vueFiles, svelteFiles, tsxFiles }
    } catch (error) {
        console.error('[workspace] Error indexing files:', error)
        return { rsxFiles: [], vueFiles: [], svelteFiles: [], tsxFiles: [] }
    }
}
