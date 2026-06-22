<template>
    <action-menu
        :items="items"
        :text="$t('dataset.actions')"
        @create="$emit('create')"
        @upload="$emit('upload')"
        @download="$emit('download')"
    />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { mdiPencil, mdiUpload, mdiDownload } from "@mdi/js";
import ActionMenu from "@/components/utils/ActionMenu.vue";

const props = defineProps({
    addOnly: {
        type: Boolean,
        default: false,
    },
});

const items = computed(() => {
    const baseItems = [
        {
            title: $t("labels.createLabel"),
            icon: mdiPencil,
            event: "create",
        },
    ];
    if (props.addOnly) {
        return baseItems;
    }
    return baseItems.concat([
        {
            title: $t("labels.importLabels"),
            icon: mdiUpload,
            event: "upload",
        },
        {
            title: $t("labels.exportLabels"),
            icon: mdiDownload,
            event: "download",
        },
    ]);
});
</script>
