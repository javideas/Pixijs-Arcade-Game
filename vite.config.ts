import { defineConfig } from 'vite';
import copy from 'rollup-plugin-copy';

export default defineConfig({
    base: './',
    build: {
        outDir: 'dist-js',
    },
    plugins: [
        copy({
            targets: [
                { src: 'src/electron/preload.js', dest: 'dist' }
            ]
        })
    ]
})
