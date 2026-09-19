import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'pure-svg-charts': path.resolve(__dirname, '../src/index.ts')
    }
  },
  server: {
    port: 5174
  }
});
