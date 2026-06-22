<template>
  <v-tooltip bottom>
    <template #activator="{ props }">
      <v-btn icon v-bind="props" @click="$emit('click:auto')">
        <v-icon>
          {{ mdiAutoFix }}
        </v-icon>
      </v-btn>
    </template>
    <span>Auto Labeling</span>
  </v-tooltip>
</template>

<script setup lang="ts">
import { mdiAutoFix } from "@mdi/js";

defineEmits(["click:auto"]);
</script>
