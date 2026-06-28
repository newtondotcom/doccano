<template>
  <TasksLayoutText v-if="image.id">
    <template #header>
      <TasksToolbarLaptop
        :doc-id="image.id"
        :enable-auto-labeling.sync="enableAutoLabeling"
        :guideline-text="project.guideline"
        :is-reviewd="image.isConfirmed"
        :total="images.count"
        class="d-none d-sm-block"
        @click:clear-label="clear"
        @click:review="confirm"
      >
        <TasksToolbarButtonsButtonZoom class="ms-2" @zoom-in="zoomIn" @zoom-out="zoomOut" />
      </TasksToolbarLaptop>
      <TasksToolbarMobile :total="images.count" class="d-flex d-sm-none" />
    </template>
    <template #content>
      <v-card>
        <v-card-title>
          <v-chip-group v-model="selectedLabelIndex" column>
            <v-chip
              v-for="item in labels"
              :key="item.id"
              :color="item.backgroundColor"
              filter
              :text-color="$contrastColor(item.backgroundColor)"
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
        </v-card-title>
        <v-divider />
        <TasksBoundingBoxVBoundingBox
          :rectangles="filteredRegions"
          :highlight-id="highlightId"
          :image-url="image.url"
          :labels="bboxLabels"
          :selected-label="selectedLabel"
          :scale="scale"
          @add-rectangle="add"
          @update-rectangle="update"
          @delete-rectangle="remove"
          @update-scale="updateScale"
          @select-rectangle="selectRegion"
        />
      </v-card>
    </template>
    <template #sidebar>
      <TasksSidebarAnnotationProgress :progress="progress" />
      <TasksMetadataListMetadata :metadata="image.meta" class="mt-4" />
      <TasksImageRegionList
        v-if="annotations.length > 0"
        class="mt-4"
        :regions="regionList"
        @change-visibility="changeVisibility"
        @delete-region="remove"
        @hover-region="hoverRegion"
        @unhover-region="unhoverRegion"
      />
    </template>
  </TasksLayoutText>
</template>

<script setup>
import { useLabelList } from "@/composables/useLabelList";

definePageMeta({
  layout: "workspace",
  validate(route) {
    return /^\d+$/.test(route.params.id) && /^\d+$/.test(route.query.page);
  },
});

const route = useRoute();
const { $services, $repositories } = useNuxtApp();

const { state: labelState, getLabelList } = useLabelList($services.categoryType);
const { labels } = toRefs(labelState);

const annotations = ref([]);
const images = ref([]);
const project = ref({});
const enableAutoLabeling = ref(false);
const progress = ref({});
const highlightId = ref(null);
const selectedLabelIndex = ref(undefined);
const selectedRegion = ref(undefined);
const visibilities = ref({});
const scale = ref(1);

const projectId = computed(() => route.params.id);

const image = computed(() => {
  if (!images.value?.items?.length) {
    return {};
  }
  return images.value.items[0];
});

const bboxLabels = computed(() =>
  labels.value.map((label) => ({
    id: label.id,
    name: label.text,
    color: label.backgroundColor,
  })),
);

const selectedLabel = computed(() => {
  if (selectedLabelIndex.value !== undefined) {
    return labels.value[selectedLabelIndex.value];
  }
  return undefined;
});

const regionList = computed(() =>
  annotations.value.map((annotation) => ({
    id: annotation.uuid,
    category: labels.value.find((label) => annotation.label === label.id).text,
    color: labels.value.find((label) => annotation.label === label.id).backgroundColor,
    visibility: annotation.uuid in visibilities.value ? visibilities.value[annotation.uuid] : true,
  })),
);

const filteredRegions = computed(() =>
  annotations.value
    .filter((annotation) => visibilities.value[annotation.uuid] !== false)
    .map((a) => ({
      ...a,
      id: a.uuid,
    })),
);

async function load() {
  images.value = await $services.example.fetchOne(
    projectId.value,
    route.query.page,
    route.query.q,
    route.query.isChecked,
    route.query.ordering,
  );
  const currentImage = images.value.items[0];
  if (enableAutoLabeling.value) {
    await autoLabel(currentImage.id);
  }
  await list(currentImage.id);
}

watch(() => route.query, load, { immediate: true, deep: true });
watch(enableAutoLabeling, async (val) => {
  if (val && !image.value.isConfirmed) {
    await autoLabel(image.value.id);
    await list(image.value.id);
  }
});

watch(selectedLabel, async (newLabel) => {
  if (newLabel !== undefined && !!selectedRegion.value) {
    selectedRegion.value.label = newLabel.id;
    await $services.bbox.update(
      projectId.value,
      image.value.id,
      selectedRegion.value.id,
      selectedRegion.value,
    );
    await list(image.value.id);
  }
});

onMounted(async () => {
  getLabelList(projectId.value);
  project.value = await $services.project.findById(projectId.value);
  progress.value = await $repositories.metrics.fetchMyProgress(projectId.value);
});

async function list(imageId) {
  annotations.value = await $services.bbox.list(projectId.value, imageId);
}

async function remove(id) {
  delete visibilities.value[id];
  const bbox = annotations.value.find((a) => a.uuid === id);
  await $services.bbox.delete(projectId.value, image.value.id, bbox.id);
  await list(image.value.id);
}

async function add(region) {
  visibilities.value[region.id] = true;
  await $services.bbox.create(
    projectId.value,
    image.value.id,
    region.id,
    region.label,
    region.x,
    region.y,
    region.width,
    region.height,
  );
  await list(image.value.id);
}

async function update(region) {
  const bbox = annotations.value.find((a) => a.uuid === region.id);
  await $services.bbox.update(projectId.value, image.value.id, bbox.id, region);
  await list(image.value.id);
}

function changeVisibility(regionId, visibility) {
  visibilities.value[regionId] = visibility;
  visibilities.value = { ...visibilities.value };
}

async function clear() {
  await $services.bbox.clear(projectId.value, image.value.id);
  await list(image.value.id);
}

async function autoLabel(imageId) {
  try {
    await $services.bbox.autoLabel(projectId.value, imageId);
  } catch (e) {
    console.log(e.response.data.detail);
  }
}

async function updateProgress() {
  progress.value = await $repositories.metrics.fetchMyProgress(projectId.value);
}

async function confirm() {
  await $services.example.confirm(projectId.value, image.value.id);
  await load();
  updateProgress();
}

function hoverRegion(regionId) {
  highlightId.value = regionId;
}

function unhoverRegion() {
  highlightId.value = null;
}

function selectRegion(regionId) {
  if (regionId) {
    selectedRegion.value = annotations.value.find((r) => r.uuid === regionId);
    selectedLabelIndex.value = labels.value.findIndex((l) => l.id === selectedRegion.value.label);
  } else {
    selectedRegion.value = undefined;
    selectedLabelIndex.value = undefined;
  }
}

function updateScale(newScale) {
  scale.value = newScale;
}

function zoomOut() {
  scale.value -= 0.1;
}

function zoomIn() {
  scale.value += 0.1;
}
</script>

<style scoped>
.text-pre-wrap {
  white-space: pre-wrap !important;
}
</style>
