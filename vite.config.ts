import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// need @types/node npm package
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    },
    extensions: ['.mjs', '.js', '.ts', '.vue', '.jsx', '.tsx', '.json']
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: true
  }
})
