<template>
  <TasksLayoutText v-if="example.id">
    <template #header>
      <TasksToolbarLaptop
        :doc-id="example.id"
        :enable-auto-labeling.sync="enableAutoLabeling"
        :guideline-text="project.guideline"
        :is-reviewd="example.isConfirmed"
        :total="totalExample"
        class="d-none d-sm-block"
        @click:clear-label="clear(example.id)"
        @click:review="confirm(projectId)"
      />
      <TasksToolbarMobile :total="totalExample" class="d-flex d-sm-none" />
    </template>
    <template #content>
      <v-snackbar :value="!!error" color="error" timeout="2000">
        {{ error }}
      </v-snackbar>
      <v-card>
        <v-img contain :src="example.url" :max-height="imageSize.height" class="grey lighten-2" />
        <TasksSeq2seqBox
          :annotations="labels"
          @delete:annotation="(labelId) => remove(example.id, labelId)"
          @update:annotation="(labelId, text) => update(example.id, labelId, text)"
          @create:annotation="(text) => add(example.id, text)"
        />
      </v-card>
    </template>
    <template #sidebar>
      <TasksSidebarAnnotationProgress :progress="progress" />
      <TasksMetadataListMetadata :metadata="example.meta" class="mt-4" />
    </template>
  </TasksLayoutText>
</template>

<script setup>
import { useExampleItem } from "@/composables/useExampleItem";
import { useProjectItem } from "@/composables/useProjectItem";
import { useTextLabel } from "@/composables/useTextLabel";

definePageMeta({
  layout: "workspace",
  validate(route) {
    return /^\d+$/.test(route.params.id) && /^\d+$/.test(route.query.page);
  },
});

const route = useRoute();
const { $repositories } = useNuxtApp();
const projectId = route.params.id;

const { state: projectState, getProjectById } = useProjectItem();
const { project } = toRefs(projectState);
const {
  state: labelState,
  autoLabel,
  list,
  clear,
  remove,
  add,
  update,
} = useTextLabel($repositories.textLabel, projectId);
const { labels, error } = toRefs(labelState);
const { state: exampleState, confirm, getExample, updateProgress } = useExampleItem();
const { example, totalExample, progress } = toRefs(exampleState);
const enableAutoLabeling = ref(false);
const imageSize = reactive({
  height: 0,
  width: 0,
});

getProjectById(projectId);
updateProgress(projectId);

function setImageSize(val) {
  const img = new Image();
  img.onload = function () {
    imageSize.height = this.height;
    imageSize.width = this.width;
  };
  img.src = val.url;
}

async function load() {
  await getExample(projectId, route.query);
  setImageSize(exampleState.example);
  if (enableAutoLabeling.value) {
    try {
      await autoLabel(projectId, exampleState.example.id);
    } catch (e) {
      enableAutoLabeling.value = false;
    }
  } else {
    await list(exampleState.example.id);
  }
}

watch(() => route.query, load, { immediate: true, deep: true });
watch(enableAutoLabeling, async (val) => {
  if (val && !exampleState.example.isConfirmed) {
    await autoLabel(exampleState.example.id);
  }
});
</script>
