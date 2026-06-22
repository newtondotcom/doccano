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
                        <v-bounding-box
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
                    <list-metadata :metadata="meta" />
                    <region-list
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

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import VBoundingBox from "@/components/tasks/boundingBox/VBoundingBox.vue";
import ListMetadata from "@/components/tasks/metadata/ListMetadata";
import RegionList from "@/components/tasks/image/RegionList.vue";
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
const selectedRectangle = ref<any>(undefined);
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
    rectangles.value.map((rectangle) => ({
        id: rectangle.id,
        category: labels.value.find((label) => rectangle.label === label.id).text,
        color: labels.value.find((label) => rectangle.label === label.id).backgroundColor,
        visibility:
            rectangle.id in visibilities.value ? visibilities.value[rectangle.id] : true,
    })),
);

const filteredRectangles = computed(() =>
    rectangles.value.filter((rectangle) => visibilities.value[rectangle.id] !== false),
);

watch(selectedLabel, (newLabel) => {
    if (newLabel !== undefined && !!selectedRectangle.value) {
        const rect = rectangles.value.find(
            (item) => item.id === selectedRectangle.value.id,
        );
        if (rect) {
            rect.label = newLabel.id;
            updateRectangle(rect);
        }
    }
});

const addRectangle = (rectangle: any) => {
    console.log("addRectangle", rectangle);
    rectangles.value = [...rectangles.value, rectangle];
    visibilities.value = { ...visibilities.value, [rectangle.id]: true };
    selectedLabelIndex.value = undefined;
};

const updateRectangle = (rectangle: any) => {
    console.log("updateRectangle", rectangle);
    const index = rectangles.value.findIndex((item) => item.id === rectangle.id);
    if (index !== -1) {
        rectangles.value = [
            ...rectangles.value.slice(0, index),
            rectangle,
            ...rectangles.value.slice(index + 1),
        ];
    }
};

const deleteRectangle = (rectangleId: string) => {
    console.log("deleteRectangle", rectangleId);
    rectangles.value = rectangles.value.filter((item) => item.id !== rectangleId);
    const { [rectangleId]: removed, ...rest } = visibilities.value;
    visibilities.value = rest;
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

const selectRectangle = (rectangleId: string | null) => {
    console.log("selectRectangle", rectangleId);
    if (rectangleId) {
        selectedRectangle.value = rectangles.value.find(
            (item) => item.id === rectangleId,
        );
        if (selectedRectangle.value) {
            selectedLabelIndex.value = labels.value.findIndex(
                (item) => item.id === selectedRectangle.value.label,
            );
        }
    } else {
        selectedRectangle.value = undefined;
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
