<template>
  <v-tooltip bottom>
    <template #activator="{ props }">
      <v-btn
        icon
        v-bind="props"
        @click="$emit('click:review')"
      >
        <v-icon v-if="isReviewd">
          {{ mdiCheck }}
        </v-icon>
        <v-icon v-else>
          {{ mdiClose }}
        </v-icon>
      </v-btn>
    </template>
    <span v-if="isReviewd">{{ $t("annotation.checkedTooltip") }}</span>
    <span v-else>{{ $t("annotation.notCheckedTooltip") }}</span>
  </v-tooltip>
</template>

<script setup lang="ts">
import { useEventListener } from "@vueuse/core";
import { mdiClose, mdiCheck } from "@mdi/js";

defineProps({
  isReviewd: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const emit = defineEmits(["click:review"]);

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
  if (event.key.toLowerCase() === "enter") {
    event.preventDefault();
    emit("click:review");
  }
});
</script>
