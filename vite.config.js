import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'public',
  server: {
    port: 3000,
  },
  build: {
    outDir: '../dist',
  }
});