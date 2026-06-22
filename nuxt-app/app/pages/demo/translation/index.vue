<template>
    <v-main>
        <v-container fluid>
            <v-row justify="center">
                <v-col cols="12" md="9">
                    <v-card class="title mb-5">
                        <v-card-text class="title">
                            {{ currentDoc.text }}
                        </v-card-text>
                    </v-card>
                    <seq2seq-box
                        :text="currentDoc.text"
                        :annotations="currentDoc.annotations"
                        @delete:annotation="_deleteAnnotation"
                        @update:annotation="_updateAnnotation"
                        @create:annotation="_createAnnotation"
                    />
                </v-col>
                <v-col cols="12" md="3">
                    <list-metadata :metadata="currentDoc.meta" />
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>

<script setup>
import ListMetadata from "@/components/tasks/metadata/ListMetadata";
import Seq2seqBox from "@/components/tasks/seq2seq/Seq2seqBox";

definePageMeta({
    layout: "demo",
});

const currentDoc = {
    id: 8,
    text: "If it had not been for his help, I would have failed.",
    annotations: [
        {
            id: 17,
            text: "S'il ne m'avait pas aidé, j'aurais échoué.",
            user: 1,
            document: 8,
        },
        {
            id: 18,
            text: "S'il ne m'avait pas aidée, j'aurais échoué.",
            user: 1,
            document: 8,
        },
    ],
    meta: { wikiPageId: 2 },
    annotation_approver: null,
};

const _deleteAnnotation = (annotationId) => {
    currentDoc.annotations = currentDoc.annotations.filter(
        (item) => item.id !== annotationId,
    );
};

const _updateAnnotation = (annotationId, text) => {
    const index = currentDoc.annotations.findIndex(
        (item) => item.id === annotationId,
    );
    currentDoc.annotations[index].text = text;
};

const _createAnnotation = (text) => {
    const payload = {
        id: Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER)),
        text,
    };
    currentDoc.annotations.push(payload);
};
</script>
