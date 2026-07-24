import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 2000,
  },
  plugins: [react()],
  resolve: {
    alias: {
      'components': path.resolve('./src/components'),
      'pages': path.resolve('./src/pages'),
      'context': path.resolve('./src/context'),
      'contexts': path.resolve('./src/contexts'),
      'lib': path.resolve('./src/lib'),
      'utils': path.resolve('./src/utils'),
    }
  },
  server: {
    port: 5173,
    host: "0.0.0.0",
  }
});
