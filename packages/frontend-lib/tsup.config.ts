import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/root.ts', 'src/methods.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  external: ['react'],
})
