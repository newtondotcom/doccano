// https://nuxt.com/docs/api/configuration/nuxt-config
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  ssr: false,
  modules: ["@pinia/nuxt", "@nuxtjs/i18n", "@nuxt/test-utils/module"],
  i18n: {
    restructureDir: join(rootDir, "app/i18n"),
    langDir: ".",
    defaultLocale: "en",
    locales: [
      { code: "en", name: "English", language: "en-CA", file: "en/index.ts" },
      { code: "zh", name: "中文", language: "zh-CN", file: "zh/index.ts" },
      { code: "fr", name: "Français", language: "fr-CA", file: "fr/index.ts" },
      { code: "de", name: "Deutsch", language: "de-DE", file: "de/index.ts" },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },

  vite: {
    plugins: [vuetify({ autoImport: true })],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    server: {
      proxy: {
        "/v1": {
          target: process.env.API_URL || "http://localhost:8000",
          changeOrigin: true,
        },
        "/media": {
          target: process.env.MEDIA_URL || "http://localhost:8000",
          changeOrigin: true,
        },
      },
    },
  },

  devServer: {
    host: "0.0.0.0",
  },

  runtimeConfig: {
    public: {
      baseUrl: "/v1",
    },
  },

  app: {
    cdnURL: process.env.PUBLIC_PATH || "/_nuxt/",
    /*
     ** Headers of the page
     */
    head: {
      titleTemplate: "%s - " + process.env.npm_package_name,
      title: process.env.npm_package_name || "",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: process.env.npm_package_description || "",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  build: {
    transpile: ["vuetify"],
  },
});
