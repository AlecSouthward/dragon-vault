import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  outDir: 'dist',
  format: ['esm'],
  splitting: true,
  dts: false,
  minify: true,
  sourcemap: true,
  clean: true,
  platform: 'node',
  target: 'node20',
  treeshake: true,
});
