import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Change '.' to process.cwd() for better reliability in CI
    const env = loadEnv(mode, process.cwd(), ''); 

    return {
      base: '/NidhiSahay/', 

      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      
      build: {
        // Change outDir to 'dist' to follow standard Action workflows
        outDir: 'dist', 
        emptyOutDir: true,
      },

      define: {
        // Updated to use 'API_KEY' as you set it in GitHub Secrets
        'process.env.API_KEY': JSON.stringify(env.API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
