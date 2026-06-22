<template>
  <v-tooltip bottom>
    <template #activator="{ props }">
      <v-btn icon v-bind="props" @click="$emit('click:comment')">
        <v-icon>
          {{ mdiMessageText }}
        </v-icon>
      </v-btn>
    </template>
    <span>{{ $t('annotation.commentTooltip') }}</span>
  </v-tooltip>
</template>

<script setup lang="ts">
import { mdiMessageText } from '@mdi/js'

defineEmits(['click:comment'])
</script>
