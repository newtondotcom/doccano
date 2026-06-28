<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="annotations"
      item-key="id"
      hide-default-header
      hide-default-footer
      disable-pagination
      class="elevation-1"
    >
      <template #top>
        <v-text-field
          v-model="newText"
          :prepend-inner-icon="mdiPencil"
          :label="$t('annotation.newText')"
          autofocus
          single-line
          hide-details
          filled
          @keyup.enter="create"
          @compositionstart="compositionStart"
          @compositionend="compositionEnd"
        />
      </template>
      <template #[`item.text`]="{ item }">
        <v-menu
          v-model="openMenus[item.id]"
          :close-on-content-click="false"
          location="bottom"
          @update:model-value="(v) => { if (v) onMenuOpen(item) }"
        >
          <template #activator="{ props }">
            <span class="title" style="font-weight: 400; cursor: pointer" v-bind="props">
              {{ item.text }}
            </span>
          </template>
          <v-card min-width="300" class="pa-4">
            <v-textarea
              v-model="editingText"
              :label="$t('generic.edit')"
              autofocus
            />
            <v-card-actions class="justify-end pa-0 mt-2">
              <v-btn variant="text" @click="openMenus[item.id] = false">{{ $t('generic.cancel') }}</v-btn>
              <v-btn color="primary" variant="text" @click="saveEdit(item.id); openMenus[item.id] = false">{{ $t('generic.save') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </template>
      <template #[`item.action`]="{ item }">
        <v-icon small @click="remove(item.id)">
          {{ mdiDeleteOutline }}
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { mdiPencil, mdiDeleteOutline } from "@mdi/js";

defineProps({
  annotations: {
    type: Array,
    default: () => [],
    required: true,
  },
});

const emit = defineEmits(["update:annotation", "create:annotation", "delete:annotation"]);

const newText = ref("");
const editingText = ref("");
const openMenus = ref<Record<number, boolean>>({});
const headers = [
  {
    text: "Text",
    align: "left",
    value: "text",
  },
  {
    text: "Actions",
    align: "right",
    value: "action",
  },
];
const isComposing = ref(false);
const hasCompositionJustEnded = ref(false);

function onMenuOpen(item: any) {
  editingText.value = item.text;
}

function saveEdit(annotationId: number) {
  update(annotationId, editingText.value);
}

function update(annotationId: number, text: string) {
  if (text.length > 0) {
    emit("update:annotation", annotationId, text);
  } else {
    remove(annotationId);
  }
}

function create() {
  if (isComposing.value || hasCompositionJustEnded.value) {
    hasCompositionJustEnded.value = false;
    return;
  }
  if (newText.value.length > 0) {
    emit("create:annotation", newText.value);
    newText.value = "";
  }
}

function remove(annotationId: number) {
  emit("delete:annotation", annotationId);
}

function compositionStart() {
  isComposing.value = true;
}

function compositionEnd() {
  isComposing.value = false;
  hasCompositionJustEnded.value = true;
}
</script>
