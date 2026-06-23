// https://nuxt.com/docs/api/configuration/nuxt-config
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  ssr: false,
  modules: ["@pinia/nuxt", "@nuxtjs/i18n"],
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
  },

  devServer: {
    host: "0.0.0.0",
  },

  env: {
    baseUrl: "/v1",
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true,
  },

  proxy: {
    // Use a fake value for use at build-time
    "/v1/": {
      target: process.env.API_URL || "http://127.0.0.1:8000",
    },
    "/media": {
      target: process.env.API_URL || "http://127.0.0.1:8000",
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
          hid: "description",
          name: "description",
          content: process.env.npm_package_description || "",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  build: {
    transpile: ["vuetify"],
    /*
     ** You can extend webpack config here
     */
    // extend(config, _) {
    //   // config.module.rules.push({
    //   //   test: /\.(txt|csv|conll|jsonl)$/i,
    //   //   loader: 'file-loader',
    //   //   options: {
    //   //     name: '[path][name].[ext]'
    //   //   }
    //   // })
    //   config.module.rules.push({
    //     enforce: "pre",
    //     test: /\.(txt|csv|json|jsonl)$/,
    //     loader: "raw-loader",
    //     exclude: /(node_modules)/,
    //   });
    //   config.module.rules.push({
    //     test: /\.(ogg|mp3|wav|mpe?g)$/i,
    //     loader: "file-loader",
    //     options: {
    //       name: "[path][name].[ext]",
    //     },
    //   });
    // },
  },
});
