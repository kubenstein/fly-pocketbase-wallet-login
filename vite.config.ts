import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import { Buffer } from 'buffer'

export default defineConfig({
	plugins: [
		sveltekit()
	],
	define: {
		global: {
			Buffer: Buffer,
		},
	},
	server: {
		port: 5173,
		host: '0.0.0.0'
	}
})
