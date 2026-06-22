<template>
  <v-menu open-on-hover offset-y z-index="200">
    <template #activator="{ props }">
      <v-btn text v-bind="props">
        {{ $i18n.locale }}
        <v-icon>{{ mdiMenuDown }}</v-icon>
      </v-btn>
    </template>
    <v-list v-for="locale in locales" :key="locale.name">
      <nuxt-link
        class="v-list-item v-list-item--link"
        :class="theme.global.name.value === 'dark' ? 'theme--dark' : 'theme--light'"
        @click="setLocale(locale.code)"
      >
        {{ locale.name }}
      </nuxt-link>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { mdiMenuDown } from '@mdi/js'
import { useTheme } from 'vuetify'

const theme = useTheme()

const { locales, setLocale } = useI18n()
</script>
