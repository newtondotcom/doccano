<template>
  <TasksLayoutText v-if="doc.id" v-shortkey="shortKeys" @shortkey="changeSelectedLabel">
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
      <v-card>
        <div class="annotation-text pa-4">
          <TasksSequenceLabelingEntityEditor
            :dark="$vuetify.theme.dark"
            :rtl="isRTL"
            :text="doc.text"
            :entities="annotations"
            :entity-labels="spanTypes"
            :relations="relations"
            :relation-labels="relationTypes"
            :allow-overlapping="project.allowOverlappingSpans"
            :grapheme-mode="project.enableGraphemeMode"
            :selected-label="selectedLabel"
            :relation-mode="relationMode"
            @addEntity="addSpan"
            @addRelation="addRelation"
            @click:entity="updateSpan"
            @click:relation="updateRelation"
            @contextmenu:entity="deleteSpan"
            @contextmenu:relation="deleteRelation"
          />
        </div>
      </v-card>
    </template>
    <template #sidebar>
      <TasksSidebarAnnotationProgress :progress="progress" />
      <v-card class="mt-4">
        <v-card-title>
          Label Types
          <v-spacer />
          <v-btn icon @click="showLabelTypes = !showLabelTypes">
            <v-icon>{{ showLabelTypes ? mdiChevronUp : mdiChevronDown }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-expand-transition>
          <v-card-text v-show="showLabelTypes">
            <v-switch v-if="useRelationLabeling" v-model="relationMode">
              <template #label>
                <span v-if="relationMode">Relation</span>
                <span v-else>Span</span>
              </template>
            </v-switch>
            <v-chip-group v-model="selectedLabelIndex" column>
              <v-chip
                v-for="(item, index) in labelTypes"
                :key="item.id"
                v-shortkey="[item.suffixKey]"
                :color="item.backgroundColor"
                filter
                :text-color="$contrastColor(item.backgroundColor)"
                @shortkey="selectedLabelIndex = index"
              >
                {{ item.text }}
                <v-avatar
                  v-if="item.suffixKey"
                  right
                  color="white"
                  class="black--text font-weight-bold"
                >
                  {{ item.suffixKey }}
                </v-avatar>
              </v-chip>
            </v-chip-group>
          </v-card-text>
        </v-expand-transition>
      </v-card>
      <TasksMetadataListMetadata :metadata="doc.meta" class="mt-4" />
    </template>
  </TasksLayoutText>
</template>

<script setup>
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import _ from "lodash";
import { useMainStore as useConfigStore } from "@/store/config";

definePageMeta({
  layout: "workspace",
  validate(route) {
    return /^\d+$/.test(route.params.id) && /^\d+$/.test(route.query.page);
  },
});

const route = useRoute();
const { $services, $repositories } = useNuxtApp();
const configStore = useConfigStore();

const annotations = ref([]);
const docs = ref([]);
const spanTypes = ref([]);
const relations = ref([]);
const relationTypes = ref([]);
const project = ref({});
const enableAutoLabeling = ref(false);
const selectedLabelIndex = ref(null);
const progress = ref({});
const relationMode = ref(false);
const showLabelTypes = ref(true);

const isRTL = computed(() => configStore.isRTL);
const projectId = computed(() => route.params.id);

const shortKeys = computed(() =>
  Object.fromEntries(spanTypes.value.map((item) => [item.id, [item.suffixKey]])),
);

const doc = computed(() => {
  if (_.isEmpty(docs.value) || docs.value.items.length === 0) {
    return {};
  }
  return docs.value.items[0];
});

const selectedLabel = computed(() => {
  if (Number.isInteger(selectedLabelIndex.value)) {
    if (relationMode.value) {
      return relationTypes.value[selectedLabelIndex.value];
    }
    return spanTypes.value[selectedLabelIndex.value];
  }
  return null;
});

const useRelationLabeling = computed(() => !!project.value.useRelation);

const labelTypes = computed(() => {
  if (relationMode.value) {
    return relationTypes.value;
  }
  return spanTypes.value;
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
  await list(currentDoc.id);
}

watch(() => route.query, load, { immediate: true, deep: true });
watch(enableAutoLabeling, async (val) => {
  if (val && !doc.value.isConfirmed) {
    await autoLabel(doc.value.id);
    await list(doc.value.id);
  }
});

onMounted(async () => {
  spanTypes.value = await $services.spanType.list(projectId.value);
  relationTypes.value = await $services.relationType.list(projectId.value);
  project.value = await $services.project.findById(projectId.value);
  progress.value = await $repositories.metrics.fetchMyProgress(projectId.value);
});

async function maybeFetchSpanTypes(annotationList) {
  const labelIds = new Set(spanTypes.value.map((label) => label.id));
  if (annotationList.some((item) => !labelIds.has(item.label))) {
    spanTypes.value = await $services.spanType.list(projectId.value);
  }
}

async function list(docId) {
  const annotationList = await $services.sequenceLabeling.list(projectId.value, docId);
  const relationList = await $services.sequenceLabeling.listRelations(projectId.value, docId);
  await maybeFetchSpanTypes(annotationList);
  annotations.value = annotationList;
  relations.value = relationList;
}

async function deleteSpan(id) {
  await $services.sequenceLabeling.delete(projectId.value, doc.value.id, id);
  await list(doc.value.id);
}

async function addSpan(startOffset, endOffset, labelId) {
  await $services.sequenceLabeling.create(
    projectId.value,
    doc.value.id,
    labelId,
    startOffset,
    endOffset,
  );
  await list(doc.value.id);
}

async function updateSpan(annotationId, labelId) {
  await $services.sequenceLabeling.changeLabel(
    projectId.value,
    doc.value.id,
    annotationId,
    labelId,
  );
  await list(doc.value.id);
}

async function addRelation(fromId, toId, typeId) {
  await $services.sequenceLabeling.createRelation(
    projectId.value,
    doc.value.id,
    fromId,
    toId,
    typeId,
  );
  await list(doc.value.id);
}

async function updateRelation(relationId, typeId) {
  await $services.sequenceLabeling.updateRelation(
    projectId.value,
    doc.value.id,
    relationId,
    typeId,
  );
  await list(doc.value.id);
}

async function deleteRelation(relationId) {
  await $services.sequenceLabeling.deleteRelation(projectId.value, doc.value.id, relationId);
  await list(doc.value.id);
}

async function clear() {
  await $services.sequenceLabeling.clear(projectId.value, doc.value.id);
  await list(doc.value.id);
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

function changeSelectedLabel(event) {
  selectedLabelIndex.value = spanTypes.value.findIndex((item) => item.suffixKey === event.srcKey);
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
