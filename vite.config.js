import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  esbuild: { jsx: 'automatic' },
  resolve: {
    alias: [
      {
        find: /^@designcodeio\/threeui\/style\.css$/,
        replacement: fileURLToPath(new URL('./src/shaders/threeui.css', import.meta.url)),
      },
      {
        find: /^@designcodeio\/threeui$/,
        replacement: fileURLToPath(new URL('./src/threeui.tsx', import.meta.url)),
      },
    ],
  },
});
