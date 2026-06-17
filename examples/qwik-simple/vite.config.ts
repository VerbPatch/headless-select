import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import path from 'path';

export default defineConfig({
  plugins: [qwikVite({ csr: true })],
  resolve: {
    alias: {
      '@verbpatch/qwik-select': path.resolve(__dirname, '../../packages/qwik-select/src/index.ts'),
    },
  },
});
