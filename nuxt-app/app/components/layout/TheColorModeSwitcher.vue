<template>
  <v-btn icon fab @click="isDark = !isDark">
    <v-icon v-if="isDark">
      {{ mdiMoonWaxingCrescent }}
    </v-icon>
    <v-icon v-else>
      {{ mdiWhiteBalanceSunny }}
    </v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { mdiMoonWaxingCrescent, mdiWhiteBalanceSunny } from '@mdi/js'

const isDark = ref(false)
const { $vuetify } = useNuxtApp() as any

watch(isDark, (value) => {
  $vuetify.theme.dark = value
  localStorage.setItem('dark', JSON.stringify(value))
})

onMounted(() => {
  const dark = localStorage.getItem('dark')
  isDark.value = dark ? JSON.parse(dark) : false
})
</script>
