<template>
  <div class="v-data-footer">
    <v-menu :close-on-content-click="false" location="bottom" v-model="isMenuOpen">
      <template #activator="{ props }">
        <span v-bind="props" style="cursor: pointer;">{{ value }} of {{ total }}</span>
      </template>
      <v-card min-width="250" class="pa-4">
        <div class="title mb-2">Move Page</div>
        <v-text-field
          v-model="editedPage"
          :rules="rules"
          :label="$t('generic.edit')"
          single-line
          counter
          autofocus
          @keyup.enter="saveAndClose"
        />
        <v-card-actions class="justify-end pa-0 mt-2">
          <v-btn variant="text" @click="isMenuOpen = false">Cancel</v-btn>
          <v-btn color="primary" variant="text" @click="saveAndClose">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
    <v-btn
      :disabled="isFirstPage"
      text
      fab
      small
      @click="firstPage"
    >
      <v-icon>{{ mdiPageFirst }}</v-icon>
    </v-btn>
    <v-btn
      :disabled="isFirstPage"
      text
      fab
      small
      @click="prevPage"
    >
      <v-icon>{{ mdiChevronLeft }}</v-icon>
    </v-btn>
    <v-btn
      :disabled="isLastPage"
      text
      fab
      small
      @click="nextPage"
    >
      <v-icon>{{ mdiChevronRight }}</v-icon>
    </v-btn>
    <v-btn
      :disabled="isLastPage"
      text
      fab
      small
      @click="lastPage"
    >
      <v-icon>{{ mdiPageLast }}</v-icon>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { useEventListener } from "@vueuse/core";
import { mdiPageFirst, mdiPageLast, mdiChevronLeft, mdiChevronRight } from "@mdi/js";

const props = defineProps({
  value: {
    type: Number,
    default: 1,
    required: true,
  },
  total: {
    type: Number,
    default: 1,
    required: true,
  },
});

const emit = defineEmits(["click:prev", "click:next", "click:first", "click:last", "click:jump"]);

const isMenuOpen = ref(false);
const editedPage = ref("1");
const rules = [
  (v: string) =>
    (v && parseInt(v, 10) > 0 && parseInt(v, 10) <= props.total) || "Invalid page number!",
];

watch(isMenuOpen, (val) => {
  if (val) {
    editedPage.value = props.value.toString();
  }
});

function saveAndClose() {
  changePageNumber();
  isMenuOpen.value = false;
}

const isFirstPage = computed(() => props.value === 1);
const isLastPage = computed(() => props.value === props.total || props.total === 0);

function changePageNumber() {
  if (!editedPage.value) {
    return;
  }
  const page = parseInt(editedPage.value, 10);
  if (page < 0 || page > props.total) {
    return;
  }
  emit("click:jump", page);
}

function prevPage() {
  if (props.value === 1) {
    return;
  }
  emit("click:prev");
}

function nextPage() {
  if (props.value === props.total) {
    return;
  }
  emit("click:next");
}

function firstPage() {
  emit("click:first");
}

function lastPage() {
  emit("click:last");
}

function shouldIgnoreShortcut(event: KeyboardEvent): boolean {
  const target = event.target;
  return (
    event.repeat ||
    (target instanceof HTMLElement &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable))
  );
}

useEventListener("keydown", (event: KeyboardEvent) => {
  if (shouldIgnoreShortcut(event)) {
    return;
  }
  const key = event.key.toLowerCase();
  if (key === "arrowleft") {
    event.preventDefault();
    if (event.shiftKey) {
      firstPage();
    } else {
      prevPage();
    }
    return;
  }
  if (key === "arrowright") {
    event.preventDefault();
    if (event.shiftKey) {
      lastPage();
    } else {
      nextPage();
    }
  }
});
</script>
