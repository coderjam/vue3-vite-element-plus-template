import path from 'path'
import { loadEnv } from 'vite'
import type { ConfigEnv, UserConfig } from 'vite'

import { visualizer } from 'rollup-plugin-visualizer'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import vueJsx from '@vitejs/plugin-vue-jsx'

import autoprefixer from 'autoprefixer'
import mock from './build/mock/createMockServer'

export default ({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, root)

  return {
    base: env.VITE_APP_PUBLIC_PATH,

    define: {
      'process.env.VITE_APP_BASE_URL': JSON.stringify(env.VITE_APP_BASE_URL),
      'process.env.VITE_APP_BASE_API': JSON.stringify(env.VITE_APP_BASE_API),
      'process.env.VITE_APP_BASE_API_ENV_2': JSON.stringify(env.VITE_APP_BASE_API_ENV_2),
      'process.env.VUE_APP_PUBLIC_PATH': JSON.stringify(env.VITE_APP_PUBLIC_PATH),
      'process.env.VITE_APP_TITLE': JSON.stringify(env.VITE_APP_TITLE),
    },

    plugins: [
      vue(),
      vueJsx(),
      visualizer(),

      legacy({
        targets: ['defaults', 'not IE 11'],
      }),

      Components({
        dts: true,
        resolvers: [ElementPlusResolver()],
        types: [],
      }),

      AutoImport({
        include: [
          /\.[tj]sx?$/,
          /\.vue$/,
          /\.vue\?vue/,
        ],
        imports: [
          'vue',
          'vue-router',
          'vitest',
        ],
        dts: true,
        resolvers: [ElementPlusResolver()],
      }),
      mock({
        watch: true,
        mockUrlList: [/api/],
        cwd: process.cwd(),
        enable: env.VITE_HTTP_MOCK === 'true' && process.env.NODE_ENV !== 'production',
      }),
    ],

    css: {
      postcss: {
        plugins: [
          autoprefixer(),

        ],
      },
    },

    build: {
      cssCodeSplit: false,
      chunkSizeWarningLimit: 2048,
    },

    resolve: {
      alias: {
        '~@': path.join(__dirname, './src'),
        '@': path.join(__dirname, './src'),
        '~': path.join(__dirname, './src/assets'),
      },
    },
    server: {
      host: true,
      port: 5173, // vite3已改为默认5173
      proxy: {
        '/cloud': {
          target: env.VITE_APP_BASE_API,
          changeOrigin: true, // 是否允许不同源
          secure: false, // 支持https
          rewrite: path => path.replace(/^\//, ''),
        },
        '/api': {
          target: env.VITE_APP_BASE_API_ENV_2,
          changeOrigin: true, // 是否允许不同源
          secure: false, // 支持https
          rewrite: path => path.replace(/^\//, ''),
        },
      },
    },
  }
}
