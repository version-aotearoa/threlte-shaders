import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    https: false,
    host: true
  },
  ssr: {
    noExternal: ['three']
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
})
