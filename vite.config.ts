import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // 1. Add base path: Use '/your-repo-name/'
      // This prefixes all scripts with the repo name so GitHub Pages finds them
      base: '/NidhiSahay/', 

      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      
      // 2. Add build configuration
      build: {
        outDir: 'docs', // Automatically sends build files to 'docs' folder
        emptyOutDir: true, // Clears 'docs' before every build
      },

      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
