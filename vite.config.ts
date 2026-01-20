import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    base: './', // Critical for APK: ensures assets are loaded relatively
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    define: {
      // Polyfill process.env for the Google GenAI SDK to work in the browser/webview
      'process.env': {
        API_KEY: JSON.stringify(env.API_KEY)
      }
    }
  };
});