<template>
  <UtilsBaseCard
    :title="title"
    :agree-text="buttonTrueText"
    :cancel-text="buttonFalseText"
    @agree="ok"
    @cancel="cancel"
  >
    <template #content>
      {{ message }}
      <v-list dense>
        <v-list-item v-for="(item, i) in items" :key="i">
          <v-list-item-title>{{ item[itemKey] }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </UtilsBaseCard>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: '',
    required: true
  },
  message: {
    type: String,
    default: '',
    required: true
  },
  items: {
    type: Array,
    default: () => [],
    required: false
  },
  itemKey: {
    type: String,
    default: '',
    required: false
  },
  buttonTrueText: {
    type: String,
    default: 'Yes'
  },
  buttonFalseText: {
    type: String,
    default: 'Cancel'
  }
})

const emit = defineEmits(['ok', 'cancel'])

function ok() {
  emit('ok')
}

function cancel() {
  emit('cancel')
}
</script>
