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
          <TasksSeq2seqBox
            :text="currentDoc.text"
            :annotations="currentDoc.annotations"
            @delete:annotation="_deleteAnnotation"
            @update:annotation="_updateAnnotation"
            @create:annotation="_createAnnotation"
          />
        </v-col>
        <v-col cols="12" md="3">
          <TasksMetadataListMetadata :metadata="currentDoc.meta" />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
definePageMeta({
  layout: "demo",
});

const currentDoc = ref({
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
});

function _deleteAnnotation(annotationId) {
  currentDoc.value.annotations = currentDoc.value.annotations.filter(
    (item) => item.id !== annotationId,
  );
}

function _updateAnnotation(annotationId, text) {
  const index = currentDoc.value.annotations.findIndex((item) => item.id === annotationId);
  currentDoc.value.annotations[index].text = text;
}

function _createAnnotation(text) {
  const payload = {
    id: Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER)),
    text,
  };
  currentDoc.value.annotations.push(payload);
}
</script>
