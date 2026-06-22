<template>
  <v-card max-height="500" style="overflow-y: scroll">
    <v-card-title class="pb-0">Regions</v-card-title>
    <v-list density="compact">
      <v-list-item
        v-for="(item, i) in regions"
        :key="`item-${i}`"
        :style="{ opacity: item.visibility ? 1 : 0.5 }"
        @mouseenter="$emit('hover-region', item.id)"
        @mouseleave="$emit('unhover-region', item.id)"
      >
        <v-list-item-title>
          <v-chip :color="item.color" class="text-white" size="small" v-text="item.category" />
        </v-list-item-title>
        <template #append>
          <v-checkbox
            :model-value="item.visibility"
            :true-icon="mdiEyeOutline"
            :false-icon="mdiEyeOffOutline"
            hide-details
            @update:model-value="$emit('change-visibility', item.id, $event)"
          />
          <v-btn icon variant="text" @click="$emit('delete-region', item.id)">
            <v-icon>{{ mdiDelete }}</v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
import { mdiEyeOutline, mdiEyeOffOutline, mdiDelete } from '@mdi/js'

defineProps({
  regions: {
    type: Array,
    default: () => []
  }
})

defineEmits(['hover-region', 'unhover-region', 'change-visibility', 'delete-region'])
</script>
