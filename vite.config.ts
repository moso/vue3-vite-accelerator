import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import fs from 'fs-extra';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import Inspect from 'vite-plugin-inspect';
import Markdown from 'unplugin-vue-markdown/vite';
import Matter from 'gray-matter';
import Pages from 'vite-plugin-pages';
import SvgLoader from 'vite-svg-loader';
import Vue from '@vitejs/plugin-vue';

const promises: Promise<any>[] = [];

const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
    optimizeDeps: {
        include: [
            'vue',
            'vue-router',
            '@vueuse/core',
        ],
    },

    plugins: [
        Vue({
            include: [/\.vue$/, /\.md$/],
            script: {
                defineModel: true,
            },
        }),

        Pages({
            extensions: ['vue', 'md'],
            dirs: 'pages',
            extendRoute(route) {
                const path = resolve(__dirname, route.component.slice(1));

                if (path.endsWith('.md')) {
                    const md = fs.readFileSync(path, 'utf-8');
                    const { data } = Matter(md);
                    route.meta = Object.assign(route.meta || {}, { frontmatter: data });
                }

                return route;
            },
        }),

        Markdown({
            wrapperComponent: 'page',
            wrapperClasses: 'page',
            headEnabled: true,
            exportFrontmatter: false,
            exposeFrontmatter: false,
            exposeExcerpt: false,
            markdownItOptions: {
                quotes: '""\'\'',
            },
        }),

        AutoImport({
            imports: [
                'vue',
                'vue-router',
                '@vueuse/core',
                '@vueuse/head',
            ],
        }),

        Components({
            extensions: ['vue', 'md'],
            dts: true,
            include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        }),

        Inspect({
            enabled: !isDev,
        }),

        SvgLoader(),

        {
            name: 'await',
            async closeBundle() {
                await Promise.all(promises);
            },
        },
    ],

    server: {
        fs: {
            strict: true,
        },
    },

    ssgOptions: {
        script: 'async',
        formatting: 'minify',
    },
});
