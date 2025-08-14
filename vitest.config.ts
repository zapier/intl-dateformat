import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      all: true,
      exclude: ['**/types.ts', '**/index.ts'],
      include: ['src/**'],
    },
    environment: 'node',
    mockReset: true,
  },
});
