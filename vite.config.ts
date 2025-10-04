import { defineConfig } from 'vite';
import copy from 'rollup-plugin-copy';

export default defineConfig({
    base: '/Pixijs-Arcade-Game/',
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
