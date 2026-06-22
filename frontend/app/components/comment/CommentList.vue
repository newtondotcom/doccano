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
      'page-text': $t('dataset.pageText'),
    }"
    item-key="id"
    show-select
    @input="$emit('input', $event)"
  >
    <template #[`item.createdAt`]="{ item }">
      <span>{{ formatDate(item.createdAt) }}</span>
    </template>
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
    <!--
    Tempolary removing due to the performance
    <template #[`item.action`]="{ item }">
      <v-btn
        small
        color="primary text-capitalize"
        @click="toLabeling(item)"
      >
        {{ $t('dataset.annotate') }}
      </v-btn>
    </template> -->
  </v-data-table>
</template>

<script setup lang="ts">
import { mdiMagnify } from "@mdi/js";
import type { PropType } from "vue";
import { ref, watch } from "vue";
import { CommentItem } from "@/domain/models/comment/comment";
import { COMMENT_DATETIME_FORMAT, formatApiDateTime } from "@/utils/date";

defineProps({
  isLoading: {
    type: Boolean,
    default: false,
    required: true,
  },
  items: {
    type: Array as PropType<CommentItem[]>,
    default: () => [],
    required: true,
  },
  value: {
    type: Array as PropType<CommentItem[]>,
    default: () => [],
    required: true,
  },
  total: {
    type: Number,
    default: 0,
    required: true,
  },
});

const emit = defineEmits<{
  input: [value: CommentItem[]];
  "update:query": [payload: any];
}>();

const { t } = useI18n();

const search = ref("");
const options = ref({} as DataOptions);
const headers = [
  { text: t("dataset.text"), value: "text", sortable: false },
  { text: t("user.username"), value: "username", sortable: false },
  { text: t("comments.created_at"), value: "createdAt", sortable: false },
  { text: t("dataset.action"), value: "action", sortable: false },
  { text: t("comments.document"), value: "example" },
];

function formatDate(date: string) {
  return formatApiDateTime(date, COMMENT_DATETIME_FORMAT);
}

function updateQuery(payload: any) {
  const { sortBy, sortDesc } = options.value;
  if (sortBy.length === 1 && sortDesc.length === 1) {
    payload.query.sortBy = sortBy[0];
    payload.query.sortDesc = sortDesc[0];
  } else {
    payload.query.sortBy = "createdAt";
    payload.query.sortDesc = true;
  }
  emit("update:query", payload);
}

watch(
  options,
  () => {
    updateQuery({
      query: {
        limit: options.value.itemsPerPage.toString(),
        offset: ((options.value.page - 1) * options.value.itemsPerPage).toString(),
        q: search.value,
      },
    });
  },
  { deep: true },
);

watch(search, () => {
  updateQuery({
    query: {
      limit: options.value.itemsPerPage.toString(),
      offset: "0",
      q: search.value,
    },
  });
  options.value.page = 1;
});
</script>
