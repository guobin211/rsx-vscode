import esbuild from 'esbuild';

async function build() {
    /**
     * @type {import('esbuild').BuildOptions}
     */
    const config = {
        entryPoints: {
            'dist/extension': './src/extension.ts'
        },
        outdir: '.',
        bundle: true,
        sourcemap: true,
        external: ['vscode'],  // 只排除 vscode,其他依赖全部打包
        format: 'cjs',
        platform: 'node',
        tsconfig: './tsconfig.json',
        define: { 'process.env.NODE_ENV': '"production"' },
        minify: process.argv.includes('--minify'),
        legalComments: 'none'
    };
    if (process.argv.includes('--watch')) {
        const ctx = await esbuild.context(config);
        console.log('watch rsx-vscode success');
        await ctx.watch();
    } else {
        await esbuild.build(config);
        console.log('build rsx-vscode success');
    }
}

await build();
