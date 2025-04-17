import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      'process.env': env,
    },
    server: {
      host: true,
      port: 5173,
      proxy: {
        // Proxy all API requests
        '/api': {
          target: env.VITE_API_URL || 'http://164.52.223.86:3013',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              console.log('Proxying request to:', proxyReq.path);
            });
          },
        },
      },
    },
  };
});