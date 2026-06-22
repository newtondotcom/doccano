<template>
    <v-item-group
        v-model="selected"
        mandatory
        @change="$emit('input', allProjectTypes[selected])"
    >
        <v-row no-gutters>
            <v-col v-for="(item, i) in allProjectTypes" :key="i">
                <v-item v-slot="{ active, toggle }">
                    <v-card class="mb-6 me-6" max-width="350" outlined>
                        <v-img
                            :src="require(`@/assets/images/tasks/${images[i]}`)"
                            height="200"
                            contain
                            @click="toggle"
                        />
                        <v-card-title>
                            <v-icon v-if="active">
                                {{ mdiCheckBold }}
                            </v-icon>
                            {{
                                translateTypeName(
                                    item,
                                    $t("overview.projectTypes"),
                                )
                            }}
                        </v-card-title>
                    </v-card>
                </v-item>
            </v-col>
        </v-row>
    </v-item-group>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { mdiCheckBold } from "@mdi/js";
import {
    allProjectTypes,
    DocumentClassification,
    ProjectType,
} from "@/domain/models/project/project";

const props = defineProps({
    value: {
        type: String,
        default: DocumentClassification,
        required: true,
    },
});

const selected = ref(0);

watch(
    () => props.value,
    (value) => {
        selected.value = allProjectTypes.indexOf(value as ProjectType);
    },
    { immediate: true },
);

const images = [
    "text_classification.png",
    "sequence_labeling.png",
    "seq2seq.png",
    "intent_detection.png",
    "image_classification.png",
    "image_captioning.jpg",
    "object_detection.jpg",
    "segmentation.jpg",
    "speech_to_text.png",
];

const translateTypeName = (type: ProjectType, types: any): string => {
    const index = allProjectTypes.indexOf(type);
    return types[index];
};
</script>
