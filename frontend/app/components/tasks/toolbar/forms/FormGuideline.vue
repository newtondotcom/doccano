<template>
  <UtilsBaseCard
    :title="$t('annotation.guidelinePopupTitle')"
    :cancel-text="$t('generic.close')"
    @cancel="close"
  >
    <template #content>
      <viewer :initial-value="guidelineText" />
    </template>
  </UtilsBaseCard>
</template>

<script setup>
// import 'tui-editor/dist/tui-editor-contents.css'
// import 'highlight.js/styles/github.css'
import { Viewer } from '@toast-ui/vue-editor'
import '@/assets/style/editor.css'

defineProps({
  guidelineText: {
    type: String,
    default: '',
    required: true
  }
})

const emit = defineEmits(['click:close'])

function close() {
  emit('click:close')
}
</script>
