// https://nuxt.com/docs/api/configuration/nuxt-config
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

const rootDir = dirname(fileURLToPath(import.meta.url))

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
    build: {
        transpile: ['vuetify'],
      },
      vite: {
        plugins: [
          vuetify({ autoImport: true }),
        ],
        vue: {
          template: {
            transformAssetUrls,
          },
        },
      }
});