<template>
  <v-tooltip bottom>
    <template #activator="{ props }">
      <v-btn
        v-shortkey.once="['enter']"
        icon
        v-bind="props"
        @shortkey="$emit('click:review')"
        @click="$emit('click:review')"
      >
        <v-icon v-if="isReviewd">
          {{ mdiCheck }}
        </v-icon>
        <v-icon v-else>
          {{ mdiClose }}
        </v-icon>
      </v-btn>
    </template>
    <span v-if="isReviewd">{{ $t('annotation.checkedTooltip') }}</span>
    <span v-else>{{ $t('annotation.notCheckedTooltip') }}</span>
  </v-tooltip>
</template>

<script setup lang="ts">
import { mdiClose, mdiCheck } from '@mdi/js'

defineProps({
  isReviewd: {
    type: Boolean,
    default: false,
    required: true
  }
})

defineEmits(['click:review'])
</script>
