// 파일: vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // /api로 시작하는 요청은 로컬 백엔드로 넘긴다
      "/api": "http://localhost:8080",
    },
  },
});
