import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config
export default defineConfig({
  build: {
    lib: {
      entry: ['src/main/main.ts'],
      formats: ['es'],
    },
    rollupOptions: {
      external: ['file-icon'],
    },
  },
  plugins: [
    {
      // @electron-forge/plugin-vite defaults the main process to
      // `formats: ['cjs']` and Vite's mergeConfig CONCATENATES that with the
      // `['es']` above, producing ['cjs', 'es'] — two builds that both write
      // `main.js`. Whichever finishes last wins, so dev starts randomly crash
      // with "require is not defined in ES module scope" (package.json has
      // "type": "module"). This hook runs after the merge and forces a single,
      // deterministic ESM build.
      config(config) {
        if (config.build?.lib && typeof config.build.lib === 'object') {
          config.build.lib.formats = ['es']
        }
      },
      name: 'force-esm-main',
    },
  ],
  publicDir: path.join(__dirname, 'src', 'shared', 'static'),
  resolve: {
    mainFields: ['module', 'jsnext:main', 'jsnext'],
  },
})
