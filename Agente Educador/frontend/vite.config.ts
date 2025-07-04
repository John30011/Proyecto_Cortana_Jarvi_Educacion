/// <reference types="vite/client" />
/// <reference types="@emotion/react/types/css-prop" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { createHtmlPlugin } from 'vite-plugin-html';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3001,
    strictPort: true,
    host: '0.0.0.0',
    open: true
  },
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(process.env.npm_package_version),
  },
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-proposal-class-properties', { loose: true }],
          ['@babel/plugin-transform-react-jsx', {
            runtime: 'automatic',
            importSource: 'react',
            throwIfNamespace: true,
          }],
        ],
      },
    }),
    tsconfigPaths(),
    createHtmlPlugin({
      inject: {
        data: {
          csp: `
            <meta http-equiv="Content-Security-Policy" 
                  content="default-src 'self';
                          script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.youtube.com https://s.ytimg.com;
                          style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
                          img-src 'self' data: https: https://*.google.com https://*.googleapis.com https://*.gstatic.com https://*.youtube.com https://*.ytimg.com https://*.googlevideo.com;
                          font-src 'self' https://fonts.gstatic.com;
                          connect-src 'self' https://*.google.com https://*.googleapis.com https://*.gstatic.com https://*.youtube.com https://*.ytimg.com https://*.googlevideo.com https://rr*.googlevideo.com https://*.sn-*.googlevideo.com;
                          frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://*.youtube.com https://*.googlevideo.com;
                          media-src 'self' blob: https://*.googlevideo.com;
                          worker-src 'self' blob:;
                          object-src 'none';"
            />
          `
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
    }
  }
});