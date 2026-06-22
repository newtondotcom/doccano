<template>
    <v-main>
        <v-container fluid>
            <div class="mb-2">
                <v-btn
                    text
                    outlined
                    class="text-capitalize mr-2"
                    @click="allowOverlapping = !allowOverlapping"
                >
                    Overlapping({{ allowOverlapping }})
                </v-btn>
                <v-btn text outlined @click="rtl = !rtl">
                    RTL(<span class="text-capitalize">{{ rtl }}</span
                    >)
                </v-btn>
            </div>
            <v-row justify="center">
                <v-col cols="12" md="9">
                    <v-card>
                        <div class="annotation-text pa-4">
                            <entity-editor
                                :dark="$vuetify.theme.dark"
                                :rtl="rtl"
                                :text="currentDoc.text"
                                :entities="currentDoc.annotations"
                                :entity-labels="entityLabels"
                                :relations="relations"
                                :relation-labels="relationLabels"
                                :allow-overlapping="allowOverlapping"
                                @addEntity="addEntity"
                                @click:entity="updateEntity"
                                @contextmenu:entity="deleteEntity"
                                @contextmenu:relation="deleteRelation"
                            />
                        </div>
                    </v-card>
                </v-col>
                <v-col cols="12" md="3">
                    <list-metadata :metadata="currentDoc.meta" />
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>
<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import EntityEditor from "@/components/tasks/sequenceLabeling/EntityEditor.vue";
import ListMetadata from "@/components/tasks/metadata/ListMetadata";
definePageMeta({
    layout: "demo",
});

const allowOverlapping = ref(false);
const rtl = ref(false);
const entityLabels = ref([
    {
        id: 4,
        text: "LOC",
        prefixKey: null,
        suffixKey: "l",
        color: "#7c20e0",
        textColor: "#ffffff",
    },
    {
        id: 5,
        text: "MISC",
        prefixKey: null,
        suffixKey: "m",
        color: "#fbb028",
        textColor: "#000000",
    },
    {
        id: 6,
        text: "ORG",
        prefixKey: null,
        suffixKey: "o",
        color: "#e6d176",
        textColor: "#000000",
    },
    {
        id: 7,
        text: "PER",
        prefixKey: null,
        suffixKey: "p",
        color: "#6a74b9",
        textColor: "#ffffff",
    },
]);
const relations = ref([{ id: 0, fromId: 16, toId: 17, labelId: 0 }]);
const relationLabels = ref([{ id: 0, text: "isLorem", color: "#ffffff" }]);
const currentDoc = ref({
    id: 8,
    text: "After bowling Somerset out for 83 on the opening morning at Grace Road, Leicestershire extended their first innings by 94 runs before being bowled out for 296 with England discard Andy Caddick taking three for 83.",
    annotations: [
        { id: 17, prob: 0.0, label: 4, startOffset: 60, endOffset: 70, user: 1 },
        { id: 19, prob: 0.0, label: 4, startOffset: 164, endOffset: 171, user: 1 },
        { id: 16, prob: 0.0, label: 6, startOffset: 14, endOffset: 22, user: 1 },
        { id: 18, prob: 0.0, label: 6, startOffset: 72, endOffset: 86, user: 1 },
        { id: 20, prob: 0.0, label: 7, startOffset: 180, endOffset: 192, user: 1 },
    ],
    meta: { wikiPageId: 2 },
    annotation_approver: null,
});

const resetDoc = () => {
    relations.value = [];
    currentDoc.value.annotations = [];
    if (rtl.value) {
        currentDoc.value.text = "داستان SVG Tiny 1.2 طولا ني است.";
    } else {
        currentDoc.value.text =
            "After bowling Somerset out for 83 on the opening morning at Grace Road, Leicestershire extended their first innings by 94 runs before being bowled out for 296 with England discard Andy Caddick taking three for 83.";
    }
};

watch(rtl, resetDoc);

const deleteEntity = (annotationId: number) => {
    currentDoc.value.annotations = currentDoc.value.annotations.filter(
        (item) => item.id !== annotationId,
    );
    relations.value.forEach((relation) => {
        if (relation.fromId === annotationId || relation.toId === annotationId) {
            deleteRelation(relation.id);
        }
    });
};

const updateEntity = (annotationId: number, labelId: number) => {
    const index = currentDoc.value.annotations.findIndex(
        (item) => item.id === annotationId,
    );
    currentDoc.value.annotations[index].label = labelId;
    currentDoc.value.annotations = [...currentDoc.value.annotations];
};

const addEntity = (startOffset: number, endOffset: number, labelId: number) => {
    console.log(startOffset, endOffset, labelId);
    const payload = {
        id: Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER)),
        startOffset,
        endOffset,
        label: labelId,
    };
    currentDoc.value.annotations = [...currentDoc.value.annotations, payload];
};

const deleteRelation = (relationId: number) => {
    relations.value = relations.value.filter((item) => item.id !== relationId);
};
</script>
<style scoped>
.annotation-text {
    font-size: 1.25rem !important;
    font-weight: 500;
    line-height: 2rem;
    font-family: "Roboto", sans-serif !important;
    opacity: 0.8;
}
</style>
