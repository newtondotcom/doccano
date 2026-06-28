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
      @input="update"
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
        <v-menu :close-on-content-click="false" location="bottom">
          <template #activator="{ props }">
            <span class="title" style="font-weight: 400; cursor: pointer" v-bind="props">
              {{ item.text }}
            </span>
          </template>
          <template #default="{ isActive }">
            <v-card min-width="300" class="pa-4">
              <v-textarea
                :model-value="item.text"
                :label="$t('generic.edit')"
                autofocus
                @change="update(item.id, $event.target.value); isActive.value = false"
              />
            </v-card>
          </template>
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
