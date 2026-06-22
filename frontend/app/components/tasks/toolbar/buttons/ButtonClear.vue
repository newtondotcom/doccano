<template>
  <v-tooltip bottom>
    <template #activator="{ props }">
      <v-btn icon v-bind="props" @click="$emit('click:clear')">
        <v-icon>
          {{ mdiDeleteOutline }}
        </v-icon>
      </v-btn>
    </template>
    <span>Clear labels</span>
  </v-tooltip>
</template>

<script setup>
import { mdiDeleteOutline } from "@mdi/js";

defineEmits(["click:clear"]);
</script>
