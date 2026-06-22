<template>
  <v-btn icon fab>
    <v-icon v-if="theme.global.name.value === 'dark'" @click="theme.change('light')">
      {{ mdiMoonWaxingCrescent }}
    </v-icon>
    <v-icon v-if="theme.global.name.value === 'light'" @click="theme.change('dark')"">
      {{ mdiWhiteBalanceSunny }}
    </v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { mdiMoonWaxingCrescent, mdiWhiteBalanceSunny } from '@mdi/js'
import { useTheme } from 'vuetify'

const theme = useTheme()
</script>