import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import * as esbuild from 'esbuild';

const minifyPlugin = () => ({
  name: 'minify-bundles',
  renderChunk(code: string) {
    return esbuild.transformSync(code, { minify: true });
  }
});

export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      plugins: [react(), minifyPlugin()],
      esbuild: {
        minifyWhitespace: true,
        minifyIdentifiers: true,
        minifySyntax: true
      },
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'PureSvgCharts',
          fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
          formats: ['es', 'cjs']
        },
        minify: 'esbuild',
        rollupOptions: {
          external: ['react', 'react-dom', 'react/jsx-runtime'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM'
            }
          }
        }
      }
    };
  }

  return {
    plugins: [react()]
  };
});
