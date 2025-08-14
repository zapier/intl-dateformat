import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  outDir: 'lib',
  tsconfig: 'tsconfig.release.json',
});
