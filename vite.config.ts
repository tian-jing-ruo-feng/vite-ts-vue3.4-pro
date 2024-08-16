import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// need @types/node npm package
import path from 'path'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { plugin as mdPlugin, PluginOptions, Mode } from 'vite-plugin-markdown'

// https://vitejs.dev/config/
export default defineConfig({
	base: '/vite-ts-vue3.4-pro/',
	build: {
		outDir: 'docs'
	},
	plugins: [
		vue(),

		AutoImport({
			// Auto import [vue, vue-router, pinia] functions related
			// example: functions from vue, ref, reactive, toRef
			imports: ['vue', 'vue-router', 'pinia'],
			include: [/\.[tj]sx?$/, /\.vue$/, /\.md$/],
			resolvers: [
				ElementPlusResolver(),
				// Auto import icon components
				IconsResolver({
					prefix: 'Icon' // default prefix is 'i'
				})
			],
			dts: path.resolve(__dirname, 'auto-imports.d.ts')
		}),

		Components({
			resolvers: [
				ElementPlusResolver(),
				// Auto register icon components
				// 自动注册图标组件
				IconsResolver({
					prefix: false,
					enabledCollections: ['ep', 'fa']
				})
			],

			dts: path.resolve(__dirname, 'components.d.ts')
		}),

		Icons({
			autoInstall: true
		}),

		mdPlugin({
			mode: [Mode.HTML, Mode.TOC, Mode.VUE]
		} as PluginOptions)
	],

	resolve: {
		alias: {
			'@': path.join(__dirname, 'src')
		},

		extensions: ['.mjs', '.js', '.ts', '.vue', '.jsx', '.tsx', '.json']
	},

	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import "./src/style/variables.scss";`
			}
		}
	},

	server: {
		host: '0.0.0.0',
		port: 5173,
		open: true
	}
})
