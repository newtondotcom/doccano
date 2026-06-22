<template>
  <v-tooltip bottom>
    <template #activator="{ props }">
      <v-btn icon v-bind="props" @click="$emit('click:guideline')">
        <v-icon>
          {{ mdiBookOpenOutline }}
        </v-icon>
      </v-btn>
    </template>
    <span>{{ $t('annotation.guidelineTooltip') }}</span>
  </v-tooltip>
</template>

<script setup>
import { mdiBookOpenOutline } from '@mdi/js'

defineEmits(['click:guideline'])
</script>
