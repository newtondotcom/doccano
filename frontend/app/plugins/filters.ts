export function truncate(text: string, length = 30, clamp = '...'): string {
  const value = text || ''

  if (value.length <= length) {
    return value
  }

  return value.substring(0, length) + clamp
}

export default defineNuxtPlugin({
  name: 'doccano-filters',
  setup(nuxtApp) {
    nuxtApp.vueApp.config.globalProperties.$truncate = truncate

    return {
      provide: {
        truncate
      }
    }
  }
})
