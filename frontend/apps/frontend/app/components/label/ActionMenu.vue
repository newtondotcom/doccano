<template>
  <UtilsActionMenu
    :items="items"
    :text="$t('dataset.actions')"
    @create="$emit('create')"
    @upload="$emit('upload')"
    @download="$emit('download')"
  />
</template>

<script setup lang="ts">
import { mdiPencil, mdiUpload, mdiDownload } from "@mdi/js";
import { computed } from "vue";

const props = defineProps({
  addOnly: {
    type: Boolean,
    default: false,
  },
});

defineEmits<{
  create: [];
  upload: [];
  download: [];
}>();

const { t } = useI18n();

const items = computed(() => {
  const menuItems = [
    {
      title: t("labels.createLabel"),
      icon: mdiPencil,
      event: "create",
    },
  ];
  if (props.addOnly) {
    return menuItems;
  } else {
    return menuItems.concat([
      {
        title: t("labels.importLabels"),
        icon: mdiUpload,
        event: "upload",
      },
      {
        title: t("labels.exportLabels"),
        icon: mdiDownload,
        event: "download",
      },
    ]);
  }
});
</script>
