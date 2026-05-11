import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@verbpatch/headless-select': path.resolve(__dirname, '../../packages/headless-select/src/index.ts'),
      '@verbpatch/react-select': path.resolve(__dirname, '../../packages/react-select/src/index.tsx'),
    },
  },
  server: {
    port: 5174,
    open: true,
  },
});
