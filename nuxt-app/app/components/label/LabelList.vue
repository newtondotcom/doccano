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
                :label="$t('generic.search')"
                single-line
                hide-details
                filled
            />
        </template>
        <template #[`item.backgroundColor`]="props">
            <v-chip
                :color="props.item.backgroundColor"
                :text-color="$contrastColor(props.item.backgroundColor)"
            >
                {{ props.item.backgroundColor }}
            </v-chip>
        </template>
        <template #[`item.actions`]="{ item }">
            <v-icon small @click="$emit('edit', item)">
                {{ mdiPencil }}
            </v-icon>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { mdiMagnify, mdiPencil } from "@mdi/js";
import type { PropType } from "vue";
import { LabelDTO } from "@/services/application/label/labelData";

const props = defineProps({
    isLoading: {
        type: Boolean,
        default: false,
        required: true,
    },
    items: {
        type: Array as PropType<LabelDTO[]>,
        default: () => [],
        required: true,
    },
    value: {
        type: Array as PropType<LabelDTO[]>,
        default: () => [],
        required: true,
    },
    disableEdit: {
        type: Boolean,
        default: false,
    },
});

const search = ref("");

const headers = computed(() => {
    const baseHeaders = [
        {
            text: $t("generic.name"),
            value: "text",
            sortable: true,
        },
        {
            text: $t("labels.shortkey"),
            value: "suffixKey",
            sortable: true,
        },
        {
            text: $t("labels.color"),
            value: "backgroundColor",
            sortable: true,
        },
    ];
    if (!props.disableEdit) {
        baseHeaders.push({
            text: "Actions",
            value: "actions",
            sortable: false,
        });
    }
    return baseHeaders;
});
</script>
