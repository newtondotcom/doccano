<template>
    <base-card
        :title="$t('overview.deleteProjectTitle')"
        :agree-text="$t('generic.yes')"
        :cancel-text="$t('generic.cancel')"
        @agree="$emit('remove')"
        @cancel="$emit('cancel')"
    >
        <template #content>
            {{ $t("overview.deleteProjectMessage") }}
            <v-list dense>
                <v-list-item v-for="(item, i) in selected" :key="i">
                    <v-list-item-content>
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </template>
    </base-card>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import BaseCard from "@/components/utils/BaseCard.vue";
import { Project } from "@/domain/models/project/project";

defineProps({
    selected: {
        type: Array as PropType<Project[]>,
        default: () => [],
    },
});
</script>
