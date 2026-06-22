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
  layout: 'demo'
})

const currentDoc = ref({
  id: 8,
  text: 'SELECT count(*) FROM head WHERE age  >  56',
  annotations: [
    {
      id: 17,
      text: 'How many heads of the departments are older than 56 ?',
      user: 1,
      document: 8
    }
  ],
  meta: {
    'department.department_id': 'INT',
    'department.name': 'CHAR',
    'department.num_employee': 'INT',
    'head.head_id': 'INT',
    'head.name': 'INT',
    'head.age': 'INT',
    'management.department_id': 'INT',
    'management.head_id': 'INT',
    'management.temporary_acting': 'VARCHAR'
  },
  annotation_approver: null
})

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
