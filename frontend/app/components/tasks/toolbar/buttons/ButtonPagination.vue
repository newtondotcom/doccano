<template>
  <div class="v-data-footer">
    <v-edit-dialog large persistent @save="changePageNumber">
      <span>{{ value }} of {{ total }}</span>
      <template #input>
        <div class="mt-4 title">Move Page</div>
        <v-text-field
          v-model="editedPage"
          :rules="rules"
          :label="$t('generic.edit')"
          single-line
          counter
          autofocus
        />
      </template>
    </v-edit-dialog>
    <v-btn
      v-shortkey.once="['shift', 'arrowleft']"
      :disabled="isFirstPage"
      text
      fab
      small
      @shortkey="firstPage"
      @click="firstPage"
    >
      <v-icon>{{ mdiPageFirst }}</v-icon>
    </v-btn>
    <v-btn
      v-shortkey.once="['arrowleft']"
      :disabled="isFirstPage"
      text
      fab
      small
      @shortkey="prevPage"
      @click="prevPage"
    >
      <v-icon>{{ mdiChevronLeft }}</v-icon>
    </v-btn>
    <v-btn
      v-shortkey.once="['arrowright']"
      :disabled="isLastPage"
      text
      fab
      small
      @shortkey="nextPage"
      @click="nextPage"
    >
      <v-icon>{{ mdiChevronRight }}</v-icon>
    </v-btn>
    <v-btn
      v-shortkey.once="['shift', 'arrowright']"
      :disabled="isLastPage"
      text
      fab
      small
      @shortkey="lastPage"
      @click="lastPage"
    >
      <v-icon>{{ mdiPageLast }}</v-icon>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { mdiPageFirst, mdiPageLast, mdiChevronLeft, mdiChevronRight } from '@mdi/js'

const props = defineProps({
  value: {
    type: Number,
    default: 1,
    required: true
  },
  total: {
    type: Number,
    default: 1,
    required: true
  }
})

const emit = defineEmits(['click:prev', 'click:next', 'click:first', 'click:last', 'click:jump'])

const editedPage = ref('1')
const rules = [
  (v: string) =>
    (v && parseInt(v, 10) > 0 && parseInt(v, 10) <= props.total) || 'Invalid page number!'
]

const isFirstPage = computed(() => props.value === 1)
const isLastPage = computed(() => props.value === props.total || props.total === 0)

function changePageNumber() {
  if (!editedPage.value) {
    return
  }
  const page = parseInt(editedPage.value, 10)
  if (page < 0 || page > props.total) {
    return
  }
  emit('click:jump', page)
}

function prevPage() {
  if (props.value === 1) {
    return
  }
  emit('click:prev')
}

function nextPage() {
  if (props.value === props.total) {
    return
  }
  emit('click:next')
}

function firstPage() {
  emit('click:first')
}

function lastPage() {
  emit('click:last')
}
</script>
