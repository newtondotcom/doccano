<template>
  <UtilsBaseCard
    :title="$t('overview.deleteProjectTitle')"
    :agree-text="$t('generic.yes')"
    :cancel-text="$t('generic.cancel')"
    @agree="$emit('remove')"
    @cancel="$emit('cancel')"
  >
    <template #content>
      {{ $t("overview.deleteProjectMessage") }}
      <v-list dense>
        <v-list-item v-for="(item, i) in selected" :key="i">
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </UtilsBaseCard>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { Project } from "@/domain/models/project/project";

defineProps({
  selected: {
    type: Array as PropType<Project[]>,
    default: () => [],
  },
});

defineEmits<{
  remove: [];
  cancel: [];
}>();
</script>
