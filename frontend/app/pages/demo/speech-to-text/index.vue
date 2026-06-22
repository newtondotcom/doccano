<template>
  <v-main>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" md="9">
          <audio controls :src="src" class="mt-2 mb-5" style="width: 100%">
            Your browser does not support the
            <code>audio</code> element.
          </audio>
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
  layout: 'demo'
})

const currentDoc = ref({
  id: 8,
  text: '',
  annotations: [
    {
      id: 17,
      text: 'Hi! Welcome to doccano!',
      user: 1,
      document: 8
    }
  ],
  meta: {
    url: 'https://github.com/doccano'
  },
  annotation_approver: null
})

const src = require('@/assets/examples/speech_1.mp3').default

function _deleteAnnotation(annotationId) {
  currentDoc.value.annotations = currentDoc.value.annotations.filter(
    (item) => item.id !== annotationId
  )
}

function _updateAnnotation(annotationId, text) {
  const index = currentDoc.value.annotations.findIndex((item) => item.id === annotationId)
  currentDoc.value.annotations[index].text = text
}

function _createAnnotation(text) {
  const payload = {
    id: Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER)),
    text
  }
  currentDoc.value.annotations.push(payload)
}
</script>
