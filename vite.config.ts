import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

/**
 * GitHub Pages serves a project site from a subpath, so the build is based at
 * `/aura-store/` while dev stays at `/`. Anything reading the base should use
 * `import.meta.env.BASE_URL` rather than hardcoding either.
 *
 * A host that serves from the root — Vercel, Netlify, a custom domain — wants
 * `BASE_PATH=/` at build time instead.
 */
const BASE = process.env.BASE_PATH ?? '/aura-store/'

/**
 * Pages has no SPA rewrite. It serves 404.html for any path it cannot find on
 * disk, so a copy of the shell there lets /shop and /product/:slug survive a
 * direct hit or a refresh — the router picks them up from the same bundle.
 */
function spaFallback() {
  return {
    name: 'spa-fallback-404',
    closeBundle() {
      copyFileSync('dist/index.html', 'dist/404.html')
    },
  }
}

export default defineConfig(({ mode }) => ({
  /* Keyed on mode, not command: `vite preview` serves the built output but
     its command is 'serve', so keying on command left preview looking for
     assets at / that the build had written under /aura-store/. */
  base: mode === 'production' ? BASE : '/',
  plugins: [react(), tailwindcss(), spaFallback()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
