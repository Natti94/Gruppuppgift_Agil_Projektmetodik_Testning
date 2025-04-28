import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "../demo_vecka_3/src/test/setup.js",
  },
  server: {
    proxy: {
      "/token-service": {
        target: "https://tokenservice-jwt-2025.fly.dev",
        changeOrigin: true,
        secure: false,
      },
      "/movies": {
        target: "https://tokenservice-jwt-2025.fly.dev",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
