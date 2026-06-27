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
    <template #top>
      <v-text-field
        v-model="search"
        :prepend-inner-icon="mdiMagnify"
        :label="$t('generic.search') + ' (e.g. label:positive)'"
        single-line
        hide-details
        filled
      />
    </template>
    <template #[`item.isConfirmed`]="{ item }">
      <v-chip :color="item.isConfirmed ? 'success' : 'warning'" text small>
        {{ item.isConfirmed ? "Finished" : "In progress" }}
      </v-chip>
    </template>
    <template #[`item.url`]="{ item }">
      <v-img
        :src="item.url"
        aspect-ratio="1"
        height="150"
        max-height="150"
        width="150"
        class="grey lighten-2"
      />
    </template>
    <template #[`item.meta`]="{ item }">
      {{ JSON.stringify(item.meta, null, 4) }}
    </template>
    <template #[`item.assignee`]="{ item }">
      <v-combobox
        :value="toSelected(item)"
        :items="members"
        item-text="username"
        no-data-text="No one"
        multiple
        chips
        dense
        flat
        hide-selected
        hide-details
        small-chips
        solo
        style="width: 200px"
        @change="onAssignOrUnassign(item, $event)"
      >
        <template #selection="{ attrs, item, parent, selected }">
          <v-chip v-bind="attrs" :input-value="selected" small class="mt-1 mb-1">
            <span class="pr-1">{{ item.username }}</span>
            <v-icon small @click="parent.selectItem(item)"> $delete </v-icon>
          </v-chip>
        </template>
      </v-combobox>
    </template>
    <template #[`item.action`]="{ item }">
      <v-btn small color="primary text-capitalize" @click="toLabeling(item)">
        {{ $t("dataset.annotate") }}
      </v-btn>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { mdiMagnify } from "@mdi/js";
import type { PropType } from "vue";
import { computed, ref, watch } from "vue";
import { ExampleDTO } from "@/services/application/example/exampleData";
import { MemberItem } from "@/domain/models/member/member";

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
    required: true,
  },
  items: {
    type: Array as PropType<ExampleDTO[]>,
    default: () => [],
    required: true,
  },
  value: {
    type: Array as PropType<ExampleDTO[]>,
    default: () => [],
    required: true,
  },
  total: {
    type: Number,
    default: 0,
    required: true,
  },
  members: {
    type: Array as PropType<MemberItem[]>,
    default: () => [],
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  input: [value: ExampleDTO[]];
  "update:query": [payload: { query: Record<string, string> }];
  "click:labeling": [payload: { page: string; q: string }];
  unassign: [assignmentId: number];
  assign: [exampleId: number, assigneeId: number];
}>();

const route = useRoute();
const { t } = useI18n();

const search = ref(route.query.q as string);
const options = ref({} as DataOptions);

const headers = computed(() => {
  const headerList = [
    {
      text: "Status",
      value: "isConfirmed",
      sortable: false,
    },
    {
      text: "Image",
      value: "url",
      sortable: false,
    },
    {
      text: "Filename",
      value: "filename",
      sortable: false,
    },
    {
      text: t("dataset.metadata"),
      value: "meta",
      sortable: false,
    },
    {
      text: t("dataset.action"),
      value: "action",
      sortable: false,
    },
  ];
  if (props.isAdmin) {
    headerList.splice(4, 0, {
      text: "Assignee",
      value: "assignee",
      sortable: false,
    });
  }
  return headerList;
});

watch(
  options,
  () => {
    emit("update:query", {
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
  emit("update:query", {
    query: {
      limit: options.value.itemsPerPage.toString(),
      offset: "0",
      q: search.value,
    },
  });
  options.value.page = 1;
});

function toLabeling(item: ExampleDTO) {
  const index = props.items.indexOf(item);
  const offset = (options.value.page - 1) * options.value.itemsPerPage;
  const page = (offset + index + 1).toString();
  emit("click:labeling", { page, q: search.value });
}

function toSelected(item: ExampleDTO) {
  const assigneeIds = item.assignments.map((assignment) => assignment.assignee_id);
  return props.members.filter((member) => assigneeIds.includes(member.user));
}

function onAssignOrUnassign(item: ExampleDTO, newAssignees: MemberItem[]) {
  const newAssigneeIds = newAssignees.map((assignee) => assignee.user);
  const oldAssigneeIds = item.assignments.map((assignment) => assignment.assignee_id);
  if (oldAssigneeIds.length > newAssigneeIds.length) {
    for (const assignment of item.assignments) {
      if (!newAssigneeIds.includes(assignment.assignee_id)) {
        emit("unassign", assignment.id);
      }
    }
  } else {
    for (const newAssigneeId of newAssigneeIds) {
      if (!oldAssigneeIds.includes(newAssigneeId)) {
        emit("assign", item.id, newAssigneeId);
      }
    }
  }
}
</script>
