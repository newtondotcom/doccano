declare module 'vue3-annotator' {
  import type { DefineComponent } from 'vue'

  export const VAnnotator: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>

  const plugin: { install: (app: unknown) => void }
  export default plugin
}

declare module 'vue3-annotator/dist/vue3-annotator.css'
