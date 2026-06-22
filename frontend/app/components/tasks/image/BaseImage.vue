<template>
  <v-image
    :config="{
      image: image
    }"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  imageUrl: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['loaded'])

const image = ref(new Image())

watch(
  () => props.imageUrl,
  () => {
    image.value.src = props.imageUrl
    image.value.onload = () => {
      emit('loaded', image.value.width, image.value.height)
    }
  },
  { immediate: true }
)
</script>
