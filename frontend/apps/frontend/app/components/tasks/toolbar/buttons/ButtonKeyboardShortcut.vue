<template>
  <v-tooltip bottom>
    <template #activator="{ props }">
      <v-btn icon v-bind="props" @click="$emit('click:open')">
        <v-icon>
          {{ mdiKeyboardOutline }}
        </v-icon>
      </v-btn>
    </template>
    <span>Keyboard Shortcut</span>
  </v-tooltip>
</template>

<script setup>
import { mdiKeyboardOutline } from "@mdi/js";

defineEmits(["click:open"]);
</script>
