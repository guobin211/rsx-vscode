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
        external: ['typescript', 'vscode', 'vscode-languageserver', 'vscode-languageclient'],
        format: 'cjs',
        platform: 'node',
        tsconfig: './tsconfig.json',
        define: { 'process.env.NODE_ENV': '"production"' },
        minify: process.argv.includes('--minify'),
        legalComments: 'none'
    }
    await esbuild.build(config)
    console.log('build rsx-vscode success')
}

await build()
