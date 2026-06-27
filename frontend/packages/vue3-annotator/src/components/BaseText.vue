<template>
  <text v-if="snippet" ref="rootElement" v-text="snippet" fill="currentColor" style="white-space: pre" />
  <text v-else ref="rootElement" style="font-size: 6px" fill="currentColor">⮐</text>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { TextLine } from '../domain/models/Line/LineText'

const props = withDefaults(
  defineProps<{
    text: string
    textLine: TextLine
  }>(),
  {
    text: '',
  },
)

const snippet = computed(() => props.text.substring(props.textLine.startOffset, props.textLine.endOffset))
const rootElement = ref<SVGTextElement | null>(null)

watch(
  () => props.textLine,
  () => {
    nextTick(() => {
      if (!rootElement.value) {
        return
      }
      ;(rootElement.value as unknown as { annotatorElement: TextLine }).annotatorElement =
        props.textLine
    })
  },
  { immediate: true },
)
</script>

<style scoped>
text {
  white-space: pre;
}
</style>
