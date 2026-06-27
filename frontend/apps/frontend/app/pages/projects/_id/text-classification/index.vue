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
        @click:clear-label="clearTeacherList(project.id, example.id)"
        @click:review="confirm(project.id)"
      >
        <TasksToolbarButtonsButtonLabelSwitch class="ms-2" @change="labelComponent = $event" />
      </TasksToolbarLaptop>
      <TasksToolbarMobile :total="totalExample" class="d-flex d-sm-none" />
    </template>
    <template #content>
      <v-card
        v-shortkey="shortKeys"
        @shortkey="annotateOrRemoveLabel(project.id, example.id, $event.srcKey)"
      >
        <v-card-title>
          <component
            :is="labelComponent"
            :labels="labels"
            :annotations="teacherList"
            :single-label="project.singleClassClassification"
            @add="annotateLabel(project.id, example.id, $event)"
            @remove="removeTeacher(project.id, example.id, $event)"
          />
        </v-card-title>
        <v-divider />
        <v-card-text class="title highlight" style="white-space: pre-wrap" v-text="example.text" />
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
import { useLabelList } from "@/composables/useLabelList";
import { useProjectItem } from "@/composables/useProjectItem";
import { useTeacherList } from "@/composables/useTeacherList";

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
const { state: exampleState, confirm, getExample, updateProgress } = useExampleItem();
const { example, totalExample, progress } = toRefs(exampleState);
const {
  state: teacherState,
  annotateLabel,
  annotateOrRemoveLabel,
  autoLabel,
  clearTeacherList,
  getTeacherList,
  removeTeacher,
} = useTeacherList($repositories.category);
const { teacherList } = toRefs(teacherState);
const enableAutoLabeling = ref(false);
const {
  state: labelState,
  getLabelList,
  shortKeys,
} = useLabelList(useNuxtApp().$services.categoryType);
const { labels } = toRefs(labelState);
const labelComponent = ref("TasksTextClassificationLabelGroup");

getLabelList(projectId);
getProjectById(projectId);
updateProgress(projectId);

async function load() {
  await getExample(projectId, route.query);
  if (enableAutoLabeling.value) {
    try {
      await autoLabel(projectId, exampleState.example.id);
    } catch (e) {
      enableAutoLabeling.value = false;
      alert(e.response.data.detail);
    }
  } else {
    await getTeacherList(projectId, exampleState.example.id);
  }
}

watch(() => route.query, load, { immediate: true, deep: true });
watch(enableAutoLabeling, async (val) => {
  if (val && !exampleState.example.isConfirmed) {
    await autoLabel(exampleState.example.id);
    await getTeacherList(exampleState.example.id);
  }
});
</script>
