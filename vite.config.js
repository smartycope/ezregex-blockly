import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(
    {
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes("-"),
          whitespace: "preserve",
        },
      },
    }
  )],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
  },
  publicDir: 'public',

});
