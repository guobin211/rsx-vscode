import esbuild from 'esbuild'
import fs from 'fs'

const json = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
const { dependencies } = json
const external = [
    ...Object.keys(dependencies),
    'typescript',
    'vscode',
    'vscode-languageserver',
    'vscode-languageclient'
]

async function build() {
    /**
     * @type {import('esbuild').BuildOptions}
     */
    const config = {
        entryPoints: {
            'dist/server': './src/server.ts'
        },
        outdir: '.',
        bundle: true,
        sourcemap: true,
        external: external,
        format: 'cjs',
        platform: 'node',
        tsconfig: './tsconfig.json',
        define: { 'process.env.NODE_ENV': '"production"' },
        minify: process.argv.includes('--minify'),
        legalComments: 'none'
    }
    if (process.argv.includes('--watch')) {
        const ctx = await esbuild.context(config)
        console.log('watch rsx-vscode success')
        await ctx.watch()
    } else {
        await esbuild.build(config)
        console.log('build rsx-vscode success')
    }
}

await build()
