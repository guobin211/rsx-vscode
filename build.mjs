import esbuild from 'esbuild'

async function build() {
    /**
     * @type {import('esbuild').BuildOptions}
     */
    const config = {
        entryPoints: {
            'dist/client': './src/client/client.ts',
            'dist/server': './src/server/server.ts'
        },
        outdir: '.',
        bundle: true,
        sourcemap: true,
        external: ['typescript', 'vscode', 'vscode-test', 'vscode-languageserver', 'vscode-languageclient'],
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
