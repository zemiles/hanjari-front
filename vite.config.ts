// 파일: vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // /api로 시작하는 요청은 로컬 백엔드로 넘긴다 (목업이 켜져 있으면 MSW가 먼저 가로챈다)
      "/api": "http://localhost:8080",
    },
  },
});
