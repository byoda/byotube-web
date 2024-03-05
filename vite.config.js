import { defineConfig } from "vite";
import vuetify from "vite-plugin-vuetify";
// vite.config.js
import vue from "@vitejs/plugin-vue";
import path from "path";
import { fileURLToPath, URL } from "node:url";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vuetify()],

  resolve: {
    alias: {
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@components": fileURLToPath(
        new URL("./src/components", import.meta.url)
      ),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
});
