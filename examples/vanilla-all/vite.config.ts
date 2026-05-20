import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../packages/headless-select/src'),
      '@verbpatch/headless-select': path.resolve(
        __dirname,
        '../../packages/headless-select/src/index.ts',
      ),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
