import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// Completely separate administrator build; it is NEVER uploaded to GitHub Pages.
export default defineConfig({
 base:'./',
 plugins:[react()],
 build:{
   outDir:'admin-private-dist',
   emptyOutDir:true,
   rollupOptions:{
      input:resolve(__dirname,'admin.html'),
      output:{inlineDynamicImports:true}
   }
 }
});
