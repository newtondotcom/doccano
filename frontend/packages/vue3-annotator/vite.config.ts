import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/wrapper.ts", import.meta.url)),
      name: "Vue3Annotator",
      formats: ["es"],
      fileName: () => "vue3-annotator.js",
      cssFileName: "vue3-annotator",
    },
    rollupOptions: {
      external: ["vue"],
    },
  },
});
