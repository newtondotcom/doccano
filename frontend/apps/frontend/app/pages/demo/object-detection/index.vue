<template>
  <v-main>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" md="9">
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
              :rectangles="filteredRectangles"
              :highlight-id="highlightId"
              :image-url="imageUrl"
              :labels="bboxLabels"
              :selected-label="selectedLabel"
              :scale="scale"
              @add-rectangle="addRectangle"
              @update-rectangle="updateRectangle"
              @delete-rectangle="deleteRectangle"
              @update-scale="updateScale"
              @select-rectangle="selectRectangle"
            />
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <TasksMetadataListMetadata :metadata="meta" />
          <TasksImageRegionList
            class="mt-4"
            :regions="regionList"
            @change-visibility="changeVisibility"
            @delete-region="deleteRectangle"
            @hover-region="hoverRegion"
            @unhover-region="unhoverRegion"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
definePageMeta({
  layout: "demo",
});

const imageUrl = require("@/assets/images/demo/cat.jpeg");
const rectangles = ref([
  {
    id: "uuid",
    label: 1,
    x: 10,
    y: 10,
    width: 100,
    height: 100,
  },
]);
const labels = [
  {
    id: 1,
    text: "Cat",
    prefixKey: null,
    suffixKey: "c",
    backgroundColor: "#7c20e0",
    textColor: "#ffffff",
  },
  {
    id: 2,
    text: "Dog",
    prefixKey: null,
    suffixKey: "d",
    backgroundColor: "#fbb028",
    textColor: "#000000",
  },
];
const meta = { wikiPageId: 2 };
const selectedLabelIndex = ref(undefined);
const selectedRectangle = ref(undefined);
const scale = ref(1);
const visibilities = ref({});
const highlightId = ref(null);

const bboxLabels = computed(() =>
  labels.map((label) => ({
    id: label.id,
    name: label.text,
    color: label.backgroundColor,
  })),
);

const selectedLabel = computed(() => {
  if (selectedLabelIndex.value !== undefined) {
    return labels[selectedLabelIndex.value];
  }
  return undefined;
});

const regionList = computed(() =>
  rectangles.value.map((rectangle) => ({
    id: rectangle.id,
    category: labels.find((label) => rectangle.label === label.id).text,
    color: labels.find((label) => rectangle.label === label.id).backgroundColor,
    visibility: rectangle.id in visibilities.value ? visibilities.value[rectangle.id] : true,
  })),
);

const filteredRectangles = computed(() =>
  rectangles.value.filter((rectangle) => visibilities.value[rectangle.id] !== false),
);

watch(selectedLabel, (newLabel) => {
  if (newLabel !== undefined && !!selectedRectangle.value) {
    const rect = rectangles.value.find((r) => r.id === selectedRectangle.value.id);
    rect.label = newLabel.id;
    updateRectangle(rect);
  }
});

function addRectangle(rectangle) {
  console.log("addRectangle", rectangle);
  rectangles.value.push(rectangle);
  visibilities.value[rectangle.id] = true;
  selectedLabelIndex.value = undefined;
}

function updateRectangle(rectangle) {
  console.log("updateRectangle", rectangle);
  const index = rectangles.value.findIndex((r) => r.id === rectangle.id);
  if (index !== -1) {
    rectangles.value[index] = rectangle;
  }
}

function deleteRectangle(rectangleId) {
  console.log("deleteRectangle", rectangleId);
  rectangles.value = rectangles.value.filter((r) => r.id !== rectangleId);
  delete visibilities.value[rectangleId];
}

function changeVisibility(regionId, visibility) {
  console.log("changeVisibility", regionId, visibility);
  visibilities.value[regionId] = visibility;
  visibilities.value = { ...visibilities.value };
}

function hoverRegion(regionId) {
  console.log("hoverRegion", regionId);
  highlightId.value = regionId;
}

function unhoverRegion(regionId) {
  console.log("unhoverRegion", regionId);
  highlightId.value = null;
}

function selectRectangle(rectangleId) {
  console.log("selectRectangle", rectangleId);
  if (rectangleId) {
    selectedRectangle.value = rectangles.value.find((r) => r.id === rectangleId);
    selectedLabelIndex.value = labels.findIndex((l) => l.id === selectedRectangle.value.label);
  } else {
    selectedRectangle.value = undefined;
    selectedLabelIndex.value = undefined;
  }
}

function updateScale(newScale) {
  scale.value = newScale;
}
</script>
