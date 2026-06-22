<template>
  <v-data-table
    :value="value"
    :headers="headers"
    :items="items"
    :options.sync="options"
    :server-items-length="total"
    :search="search"
    :loading="isLoading"
    :loading-text="$t('generic.loading')"
    :no-data-text="$t('vuetify.noDataAvailable')"
    :footer-props="{
      showFirstLastPage: true,
      'items-per-page-options': [10, 50, 100],
      'items-per-page-text': $t('vuetify.itemsPerPageText'),
      'page-text': $t('dataset.pageText')
    }"
    item-key="id"
    show-select
    @input="$emit('input', $event)"
  >
    <template #top>
      <v-text-field
        v-model="search"
        :prepend-inner-icon="mdiMagnify"
        :label="$t('generic.search')"
        single-line
        hide-details
        filled
      />
    </template>
    <template #[`item.name`]="{ item }">
      <nuxt-link :to="localePath(`/projects/${item.id}`)">
        <span>{{ item.name }}</span>
      </nuxt-link>
    </template>
    <template #[`item.createdAt`]="{ item }">
      <span>{{ formatApiDateTime(item.createdAt, PROJECT_DATETIME_FORMAT) }}</span>
    </template>
    <template #[`item.tags`]="{ item }">
      <v-chip v-for="tag in item.tags" :key="tag.id" outlined v-text="tag.text" />
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { mdiMagnify } from '@mdi/js'
import type { PropType } from 'vue'
import { computed, ref, watch } from 'vue'
import { Project } from '@/domain/models/project/project'
import { PROJECT_DATETIME_FORMAT, formatApiDateTime } from '@/utils/date'

defineProps({
  isLoading: {
    type: Boolean,
    default: false,
    required: true
  },
  items: {
    type: Array as PropType<Project[]>,
    default: () => [],
    required: true
  },
  value: {
    type: Array as PropType<Project[]>,
    default: () => [],
    required: true
  },
  total: {
    type: Number,
    default: 0,
    required: true
  }
})

const emit = defineEmits<{
  input: [value: Project[]]
  'update:query': [payload: any]
}>()

const route = useRoute()
const { t, localePath } = useI18n()

const search = ref((route.query.q as string) || '')
const options = ref({} as DataOptions)

const headers = computed((): { text: any; value: string; sortable?: boolean }[] => [
  { text: t('generic.name'), value: 'name' },
  { text: t('generic.description'), value: 'description', sortable: false },
  { text: t('generic.type'), value: 'projectType' },
  { text: 'Created', value: 'createdAt' },
  { text: 'Author', value: 'author' },
  { text: 'Tags', value: 'tags', sortable: false }
])

function updateQuery(payload: any) {
  const { sortBy, sortDesc } = options.value
  if (sortBy.length === 1 && sortDesc.length === 1) {
    payload.query.sortBy = sortBy[0]
    payload.query.sortDesc = sortDesc[0]
  } else {
    payload.query.sortBy = 'createdAt'
    payload.query.sortDesc = true
  }
  emit('update:query', payload)
}

watch(
  options,
  () => {
    updateQuery({
      query: {
        limit: options.value.itemsPerPage.toString(),
        offset: ((options.value.page - 1) * options.value.itemsPerPage).toString(),
        q: search.value
      }
    })
  },
  { deep: true }
)

watch(search, () => {
  updateQuery({
    query: {
      limit: options.value.itemsPerPage.toString(),
      offset: '0',
      q: search.value
    }
  })
  options.value.page = 1
})
</script>
