import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative assets support the real React app on GitHub Pages /Nbd/ and normal hosting.
// Legacy learning pages are copied into dist by the deployment workflow.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
