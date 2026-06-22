<template>
  <v-data-table
    :value="value"
    :headers="headers"
    :items="items"
    :search="search"
    :loading="isLoading"
    :loading-text="$t('generic.loading')"
    :no-data-text="$t('vuetify.noDataAvailable')"
    :footer-props="{
      showFirstLastPage: true,
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
    <template #[`item.rolename`]="{ item }">
      {{ $translateRole(item.rolename, $t('members.roles')) }}
    </template>
    <template #[`item.actions`]="{ item }">
      <v-icon small @click="$emit('edit', item)">
        {{ mdiPencil }}
      </v-icon>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { mdiMagnify, mdiPencil } from '@mdi/js'
import { computed, ref } from 'vue'

defineProps({
  isLoading: {
    type: Boolean,
    default: false,
    required: true
  },
  items: {
    type: Array,
    default: () => [],
    required: true
  },
  value: {
    type: Array,
    default: () => [],
    required: true
  }
})

defineEmits<{
  input: [value: unknown[]]
  edit: [item: unknown]
}>()

const { t } = useI18n()

const search = ref('')

const headers = computed(() => [
  { text: t('generic.name'), value: 'username' },
  { text: t('members.role'), value: 'rolename' },
  { text: 'Actions', value: 'actions', sortable: false }
])
</script>
