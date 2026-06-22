<template>
  <v-tooltip bottom>
    <template #activator="{ on }">
      <v-btn icon v-on="on" @click="$emit('click:auto')">
        <v-icon>
          {{ mdiAutoFix }}
        </v-icon>
      </v-btn>
    </template>
    <span>Auto Labeling</span>
  </v-tooltip>
</template>

<script setup lang="ts">
import { mdiAutoFix } from '@mdi/js'
</script>
