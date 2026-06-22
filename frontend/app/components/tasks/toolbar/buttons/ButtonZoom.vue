<template>
  <v-btn-toggle mandatory>
    <v-tooltip bottom>
      <template #activator="{ props }">
        <v-btn icon v-bind="props" @click="$emit('zoom-out')">
          <v-icon>{{ mdiMagnifyMinusOutline }}</v-icon>
        </v-btn>
      </template>
      <span>Zoom Out</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template #activator="{ props }">
        <v-btn icon v-bind="props" @click="$emit('zoom-in')">
          <v-icon>{{ mdiMagnifyPlusOutline }}</v-icon>
        </v-btn>
      </template>
      <span>Zoom In</span>
    </v-tooltip>
  </v-btn-toggle>
</template>

<script setup lang="ts">
import { mdiMagnifyPlusOutline, mdiMagnifyMinusOutline } from '@mdi/js'

defineEmits(['zoom-out', 'zoom-in'])
</script>
