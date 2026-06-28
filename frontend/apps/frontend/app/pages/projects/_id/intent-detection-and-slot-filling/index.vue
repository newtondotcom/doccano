<template>
  <TasksLayoutText v-if="doc.id">
    <template #header>
      <TasksToolbarLaptop
        :doc-id="doc.id"
        :enable-auto-labeling.sync="enableAutoLabeling"
        :guideline-text="project.guideline"
        :is-reviewd="doc.isConfirmed"
        :total="docs.count"
        class="d-none d-sm-block"
        @click:clear-label="clear"
        @click:review="confirm"
      />
      <TasksToolbarMobile :total="docs.count" class="d-flex d-sm-none" />
    </template>
    <template #content>
      <v-card v-shortkey="shortKeys" @shortkey="addOrRemoveCategory">
        <v-card-title>
          <TasksTextClassificationLabelGroup
            :labels="categoryTypes"
            :annotations="categories"
            :single-label="exclusive"
            @add="addCategory"
            @remove="removeCategory"
          />
        </v-card-title>
        <v-divider />
        <div class="annotation-text pa-4">
          <TasksSequenceLabelingEntityEditor
            :dark="$vuetify.theme.dark"
            :rtl="isRTL"
            :text="doc.text"
            :entities="spans"
            :entity-labels="spanTypes"
            @addEntity="addSpan"
            @click:entity="updateSpan"
            @contextmenu:entity="deleteSpan"
          />
        </div>
      </v-card>
    </template>
    <template #sidebar>
      <TasksSidebarAnnotationProgress :progress="progress" />
      <TasksMetadataListMetadata :metadata="doc.meta" class="mt-4" />
    </template>
  </TasksLayoutText>
</template>

<script setup>
import { useMainStore as useConfigStore } from "@/store/config";
import { Category } from "@/domain/models/tasks/category";

definePageMeta({
  layout: "workspace",
  validate(route) {
    return /^\d+$/.test(route.params.id) && /^\d+$/.test(route.query.page);
  },
});

const route = useRoute();
const { $services, $repositories } = useNuxtApp();
const configStore = useConfigStore();

const docs = ref([]);
const spans = ref([]);
const categories = ref([]);
const spanTypes = ref([]);
const categoryTypes = ref([]);
const project = ref({});
const exclusive = ref(false);
const enableAutoLabeling = ref(false);
const progress = ref({});

const isRTL = computed(() => configStore.isRTL);
const projectId = computed(() => route.params.id);

const shortKeys = computed(() =>
  Object.fromEntries(categoryTypes.value.map((item) => [item.id, [item.suffixKey]])),
);

const doc = computed(() => {
  if (!docs.value?.items?.length) {
    return {};
  }
  return docs.value.items[0];
});

async function load() {
  docs.value = await $services.example.fetchOne(
    projectId.value,
    route.query.page,
    route.query.q,
    route.query.isChecked,
    route.query.ordering,
  );
  const currentDoc = docs.value.items[0];
  if (enableAutoLabeling.value && !currentDoc.isConfirmed) {
    await autoLabel(currentDoc.id);
  }
  await listSpan(currentDoc.id);
  await listCategory(currentDoc.id);
}

watch(() => route.query, load, { immediate: true, deep: true });
watch(enableAutoLabeling, async (val) => {
  if (val && !doc.value.isConfirmed) {
    await autoLabel(doc.value.id);
    await listSpan(doc.value.id);
    await listCategory(doc.value.id);
  }
});

onMounted(async () => {
  spanTypes.value = await $services.spanType.list(projectId.value);
  categoryTypes.value = await $services.categoryType.list(projectId.value);
  project.value = await $services.project.findById(projectId.value);
  progress.value = await $repositories.metrics.fetchMyProgress(projectId.value);
});

async function listSpan(docId) {
  spans.value = await $services.sequenceLabeling.list(projectId.value, docId);
}

async function deleteSpan(id) {
  await $services.sequenceLabeling.delete(projectId.value, doc.value.id, id);
  await listSpan(doc.value.id);
}

async function addSpan(startOffset, endOffset, labelId) {
  await $services.sequenceLabeling.create(
    projectId.value,
    doc.value.id,
    labelId,
    startOffset,
    endOffset,
  );
  await listSpan(doc.value.id);
}

async function updateSpan(annotationId, labelId) {
  await $services.sequenceLabeling.changeLabel(
    projectId.value,
    doc.value.id,
    annotationId,
    labelId,
  );
  await listSpan(doc.value.id);
}

async function listCategory(id) {
  categories.value = await $repositories.category.list(projectId.value, id);
}

async function removeCategory(id) {
  await $repositories.category.delete(projectId.value, doc.value.id, id);
  await listCategory(doc.value.id);
}

async function addCategory(labelId) {
  const category = Category.create(labelId);
  await $repositories.category.create(projectId.value, doc.value.id, category);
  await listCategory(doc.value.id);
}

async function addOrRemoveCategory(event) {
  const labelId = parseInt(event.srcKey, 10);
  const category = categories.value.find((item) => item.label === labelId);
  if (category) {
    await removeCategory(category.id);
  } else {
    await addCategory(labelId);
  }
}

async function clear() {
  await $repositories.category.clear(projectId.value, doc.value.id);
  await $services.sequenceLabeling.clear(projectId.value, doc.value.id);
  await listSpan(doc.value.id);
  await listCategory(doc.value.id);
}

async function autoLabel(docId) {
  try {
    await $services.sequenceLabeling.autoLabel(projectId.value, docId);
  } catch (e) {
    console.log(e.response.data.detail);
  }
}

async function updateProgress() {
  progress.value = await $repositories.metrics.fetchMyProgress(projectId.value);
}

async function confirm() {
  await $services.example.confirm(projectId.value, doc.value.id);
  await load();
  updateProgress();
}
</script>

<style scoped>
.annotation-text {
  font-size: 1.25rem !important;
  font-weight: 500;
  line-height: 2rem;
  font-family: "Roboto", sans-serif !important;
  opacity: 0.6;
}
</style>
