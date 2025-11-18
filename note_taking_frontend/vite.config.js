/// <reference types="vite/client" />

import { defineConfig } from 'vite'

/**
 * Vite config
 * - Use plain Vite without the Blits plugin because the plugin auto-injects
 *   optional modules (e.g., i18n/translations) not present in this project,
 *   causing "Failed to resolve import" errors during dev/preview.
 * - LightningJS core + Blits components run fine without the plugin for our use.
 */
export default defineConfig(() => {
  return {
    base: '/',
    resolve: {
      mainFields: ['browser', 'module', 'jsnext:main', 'jsnext'],
    },
    server: {
      host: '0.0.0.0',
      allowedHosts: ['.kavia.ai'],
      port: 3000,
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
      fs: {
        allow: ['..'],
      },
    },
    worker: {
      format: 'es',
    },
  }
})