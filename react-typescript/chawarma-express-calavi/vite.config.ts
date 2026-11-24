import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    // Bibliothèques (React, React Router, Motion) dans un fichier à part : il reste en cache quand seul le site change.
    rolldownOptions: { output: { advancedChunks: { groups: [{ name: 'vendor', test: /node_modules/ }] } } },
  },
});
