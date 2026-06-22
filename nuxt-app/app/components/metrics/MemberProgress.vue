<template>
    <v-card>
        <v-card-title>Member's Progress</v-card-title>
        <v-divider />
        <v-card-text>
            <div
                v-for="(item, index) in stats.progress"
                :key="index"
                class="mb-2"
            >
                <span class="font-weight-medium">{{ item.user }}</span>
                <span class="font-weight-medium"
                    >{{ item.done }} / {{ stats.total }}</span
                >
                <v-progress-linear :value="rate(item.done, stats.total)" />
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Progress } from "@/domain/models/metrics/metrics";

const stats = ref({} as Progress);
const route = useRoute();
const { $repositories } = useNuxtApp() as any;

const rate = (done: number, total: number) => {
    return (done / total) * 100;
};

onMounted(async () => {
    stats.value = await $repositories.metrics.fetchMemberProgress(route.params.id);
});
</script>
