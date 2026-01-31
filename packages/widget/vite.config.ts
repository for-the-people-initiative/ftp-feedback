import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FTPFeedback',
      formats: ['es', 'umd', 'iife'],
      fileName: (format) => format === 'iife' ? 'widget.js' : `ftp-feedback.${format === 'es' ? 'js' : 'umd.cjs'}`,
    },
    minify: 'esbuild',
    cssCodeSplit: false,
  },
});
