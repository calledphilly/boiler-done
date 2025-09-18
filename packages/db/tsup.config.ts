import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/schema/index.ts', 'src/schema/auth.ts'],
  format: ['esm'],
  sourcemap: true,
  clean: true,
  dts: true,
  minify: true,
  external: [],
  outDir: 'dist',
});
