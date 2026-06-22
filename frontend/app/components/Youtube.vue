<template>
  <iframe
    :src="embedUrl"
    width="100%"
    height="100%"
    title="YouTube video"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  videoId: string
}>()

const embedUrl = computed(
  () => `https://www.youtube.com/embed/${props.videoId}?rel=0`
)
</script>
