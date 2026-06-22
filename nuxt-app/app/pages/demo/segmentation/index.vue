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
                                    :text-color="
                                        $contrastColor(item.backgroundColor)
                                    "
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
                        <v-segmentation
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
                    <list-metadata :metadata="meta" />
                    <region-list
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

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import VSegmentation from "@/components/tasks/segmentation/VSegmentation.vue";
import ListMetadata from "@/components/tasks/metadata/ListMetadata";
import RegionList from "@/components/tasks/image/RegionList.vue";

definePageMeta({
    layout: "demo",
});

const imageUrl = require("@/assets/images/demo/cat.jpeg");
const polygons = ref([
    {
        id: "uuid",
        label: 1,
        points: [372, 249, 284, 366, 450, 371],
    },
]);
const labels = ref([
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
]);
const meta = { wikiPageId: 2 };
const selectedLabelIndex = ref<number | undefined>(undefined);
const selectedPolygon = ref<any>(undefined);
const scale = ref(1);
const visibilities = ref<Record<string, boolean>>({});
const highlightId = ref<string | null>(null);

const bboxLabels = computed(() =>
    labels.value.map((label) => ({
        id: label.id,
        name: label.text,
        color: label.backgroundColor,
    })),
);

const selectedLabel = computed(() =>
    selectedLabelIndex.value !== undefined
        ? labels.value[selectedLabelIndex.value]
        : undefined,
);

const regionList = computed(() =>
    polygons.value.map((polygon) => ({
        id: polygon.id,
        category: labels.value.find((label) => polygon.label === label.id)
            .text,
        color: labels.value.find((label) => polygon.label === label.id)
            .backgroundColor,
        visibility:
            polygon.id in visibilities.value ? visibilities.value[polygon.id] : true,
    })),
);

const filteredRegions = computed(() =>
    polygons.value.filter((polygon) => visibilities.value[polygon.id] !== false),
);

watch(selectedLabel, (newLabel) => {
    if (newLabel !== undefined && !!selectedPolygon.value) {
        selectedPolygon.value.label = newLabel.id;
        updatePolygon(selectedPolygon.value);
    }
});

const addPolygon = (polygon: any) => {
    polygons.value = [...polygons.value, polygon];
    selectedLabelIndex.value = undefined;
};

const deletePolygon = (polygonId: string) => {
    polygons.value = polygons.value.filter((polygon) => polygon.id !== polygonId);
};

const updatePolygon = (polygon: any) => {
    console.log("updatePolygon", polygon);
    const index = polygons.value.findIndex((item) => item.id === polygon.id);
    if (index !== -1) {
        polygons.value = [
            ...polygons.value.slice(0, index),
            polygon,
            ...polygons.value.slice(index + 1),
        ];
        selectedPolygon.value = polygon;
    }
};

const changeVisibility = (regionId: string, visibility: boolean) => {
    console.log("changeVisibility", regionId, visibility);
    visibilities.value = {
        ...visibilities.value,
        [regionId]: visibility,
    };
};

const hoverRegion = (regionId: string) => {
    console.log("hoverRegion", regionId);
    highlightId.value = regionId;
};

const unhoverRegion = (regionId: string) => {
    console.log("unhoverRegion", regionId);
    highlightId.value = null;
};

const selectRegion = (regionId: string | null) => {
    console.log("selectRegion", regionId);
    if (regionId) {
        selectedPolygon.value = polygons.value.find((polygon) => polygon.id === regionId);
        selectedLabelIndex.value = labels.value.findIndex(
            (label) => label.id === selectedPolygon.value.label,
        );
    } else {
        selectedPolygon.value = undefined;
        selectedLabelIndex.value = undefined;
    }
};

const zoomOut = () => {
    scale.value -= 0.1;
};

const zoomIn = () => {
    scale.value += 0.1;
};

const updateScale = (newScale: number) => {
    scale.value = newScale;
};
</script>
