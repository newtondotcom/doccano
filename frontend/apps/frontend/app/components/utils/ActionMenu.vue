<template>
  <v-menu offset-y open-on-hover>
    <template #activator="{ props }">
      <v-btn color="primary text-capitalize" v-bind="props">
        {{ text }}
        <v-icon>{{ mdiMenuDown }}</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(item, index) in items" :key="index" @click="emit(item.event)">
        <template #prepend>
          <v-icon>{{ item.icon }}</v-icon>
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { mdiMenuDown } from "@mdi/js";

defineProps({
  text: {
    type: String,
    default: "Actions",
  },
  items: {
    type: Array,
    default: () => [],
    required: true,
  },
});

const emit = defineEmits<{
  [event: string]: [];
}>();
</script>
