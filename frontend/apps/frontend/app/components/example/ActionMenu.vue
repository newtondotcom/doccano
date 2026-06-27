<template>
  <UtilsActionMenu
    :items="items"
    :text="$t('dataset.actions')"
    @create="$emit('create')"
    @upload="$emit('upload')"
    @download="$emit('download')"
    @assign="$emit('assign')"
    @reset="$emit('reset')"
  />
</template>

<script setup lang="ts">
import { mdiAccountCheck, mdiUpload, mdiDownload, mdiUpdate } from "@mdi/js";
import { computed } from "vue";

defineEmits<{
  create: [];
  upload: [];
  download: [];
  assign: [];
  reset: [];
}>();

const { t } = useI18n();

const items = computed(() => [
  {
    title: t("dataset.importDataset"),
    icon: mdiUpload,
    event: "upload",
  },
  {
    title: t("dataset.exportDataset"),
    icon: mdiDownload,
    event: "download",
  },
  {
    title: "Assign to member",
    icon: mdiAccountCheck,
    event: "assign",
  },
  {
    title: "Reset Assignment",
    icon: mdiUpdate,
    event: "reset",
  },
]);
</script>
