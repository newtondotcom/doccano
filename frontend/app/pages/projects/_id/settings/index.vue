<template>
  <v-card>
    <v-tabs v-model="tab">
      <v-tab value="tab-project" class="text-capitalize"> Project </v-tab>
      <v-tab value="tab-auto-labeling" class="text-capitalize"> Auto Labeling </v-tab>
    </v-tabs>
    <v-divider />

    <v-window v-model="tab">
      <v-window-item value="tab-project">
        <ProjectFormUpdate />
      </v-window-item>
      <v-window-item value="tab-auto-labeling">
        <ConfigAutoLabelingConfigList />
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "project",
  middleware: ["check-auth", "auth", "setCurrentProject", "isProjectAdmin"],
  validate(route) {
    return /^\d+$/.test(route.params.id);
  },
});

const tab = ref("tab-project");
</script>
