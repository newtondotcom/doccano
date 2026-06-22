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
            <TasksSegmentationVSegmentation
              :highlight-id="highlightId"
              :image-url="imageUrl"
              :labels="bboxLabels"
              :polygons="filteredRegions"
              :selected-label="selectedLabel"
              :scale="scale"
              @add-polygon="addPolygon"
              @delete-polygon="deletePolygon"
              @select-polygon="selectRegion"
              @update-polygon="updatePolygon"
              @update-scale="updateScale"
            />
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <TasksMetadataListMetadata :metadata="meta" />
          <TasksImageRegionList
            class="mt-4"
            :regions="regionList"
            @change-visibility="changeVisibility"
            @delete-region="deletePolygon"
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
  layout: 'demo'
})

const imageUrl = require('@/assets/images/demo/cat.jpeg')
const polygons = ref([
  {
    id: 'uuid',
    label: 1,
    points: [372, 249, 284, 366, 450, 371]
  }
])
const labels = [
  {
    id: 1,
    text: 'Cat',
    prefixKey: null,
    suffixKey: 'c',
    backgroundColor: '#7c20e0',
    textColor: '#ffffff'
  },
  {
    id: 2,
    text: 'Dog',
    prefixKey: null,
    suffixKey: 'd',
    backgroundColor: '#fbb028',
    textColor: '#000000'
  }
]
const meta = { wikiPageId: 2 }
const selectedLabelIndex = ref(undefined)
const selectedPolygon = ref(undefined)
const scale = ref(1)
const visibilities = ref({})
const highlightId = ref(null)

const bboxLabels = computed(() =>
  labels.map((label) => ({
    id: label.id,
    name: label.text,
    color: label.backgroundColor
  }))
)

const selectedLabel = computed(() => {
  if (selectedLabelIndex.value !== undefined) {
    return labels[selectedLabelIndex.value]
  }
  return undefined
})

const regionList = computed(() =>
  polygons.value.map((polygon) => ({
    id: polygon.id,
    category: labels.find((label) => polygon.label === label.id).text,
    color: labels.find((label) => polygon.label === label.id).backgroundColor,
    visibility: polygon.id in visibilities.value ? visibilities.value[polygon.id] : true
  }))
)

const filteredRegions = computed(() =>
  polygons.value.filter((polygon) => visibilities.value[polygon.id] !== false)
)

watch(selectedLabel, (newLabel) => {
  if (newLabel !== undefined && !!selectedPolygon.value) {
    selectedPolygon.value.label = newLabel.id
    updatePolygon(selectedPolygon.value)
  }
})

function addPolygon(polygon) {
  polygons.value.push(polygon)
  selectedLabelIndex.value = undefined
}

function deletePolygon(polygonId) {
  polygons.value = polygons.value.filter((p) => p.id !== polygonId)
}

function updatePolygon(polygon) {
  console.log('updatePolygon', polygon)
  const index = polygons.value.findIndex((p) => p.id === polygon.id)
  if (index !== -1) {
    polygons.value[index] = polygon
    selectedPolygon.value = polygon
  }
}

function changeVisibility(regionId, visibility) {
  console.log('changeVisibility', regionId, visibility)
  visibilities.value[regionId] = visibility
  visibilities.value = { ...visibilities.value }
}

function hoverRegion(regionId) {
  console.log('hoverRegion', regionId)
  highlightId.value = regionId
}

function unhoverRegion(regionId) {
  console.log('unhoverRegion', regionId)
  highlightId.value = null
}

function selectRegion(regionId) {
  console.log('selectRegion', regionId)
  if (regionId) {
    selectedPolygon.value = polygons.value.find((r) => r.id === regionId)
    selectedLabelIndex.value = labels.findIndex((l) => l.id === selectedPolygon.value.label)
  } else {
    selectedPolygon.value = undefined
    selectedLabelIndex.value = undefined
  }
}

function updateScale(newScale) {
  scale.value = newScale
}
</script>
