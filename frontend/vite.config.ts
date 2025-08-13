import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isWebMode = mode === "web";

  const plugins = [react()];

  // Electron 플러그인은 웹 모드가 아닐 때만 추가
  if (!isWebMode) {
    plugins.push(
      electron([
        {
          // Main-Process entry file of the Electron App.
          entry: "electron/main.ts",
          onstart(options) {
            if (process.env.VSCODE_DEBUG) {
              // Start Electron App when debugging in VSCode
              console.log("[startup] Electron App");
            } else {
              options.startup();
            }
          },
          vite: {
            build: {
              sourcemap: false,
              minify: false,
              outDir: "dist-electron",
              rollupOptions: {
                external: ["electron"],
              },
            },
          },
        },
        {
          entry: "electron/preload.ts",
          onstart(options) {
            // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
            // instead of restarting the entire Electron App.
            options.reload();
          },
          vite: {
            build: {
              sourcemap: "inline",
              minify: false,
              outDir: "dist-electron",
              rollupOptions: {
                external: ["electron"],
              },
            },
          },
        },
      ]),
      renderer()
    );
  }

  return {
    plugins,
    base: isWebMode ? "/" : "", // Electron에서는 빈 문자열 사용
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    optimizeDeps: {
      include: ["lightweight-charts"],
    },
    server: {
      port: 5173,
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
    define: {
      // 전역 환경변수 정의
      __API_BASE_URL__: JSON.stringify("http://localhost:7777"),
    },
  };
});
