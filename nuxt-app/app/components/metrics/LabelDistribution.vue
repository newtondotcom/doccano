<template>
    <v-card>
        <v-card-title v-text="title" />
        <v-divider />
        <v-tabs show-arrows>
            <v-tab
                v-for="(value, user) in chartJSFormat"
                :key="user"
                class="text-capitalize"
            >
                {{ user }}
            </v-tab>
            <v-tab-item v-for="(value, user) in chartJSFormat" :key="user">
                <v-card-text>
                    <bar-chart :chart-data="value" />
                </v-card-text>
            </v-tab-item>
        </v-tabs>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { PropType } from "vue";
import BarChart from "@/components/metrics/ChartBar.vue";
import { Distribution } from "@/domain/models/metrics/metrics";
import { LabelDTO } from "@/services/application/label/labelData";

const props = defineProps({
    title: {
        type: String,
        required: true,
        default: "Distribution",
    },
    distribution: {
        type: Object as PropType<Distribution>,
        required: true,
    },
    labelTypes: {
        type: Array as PropType<LabelDTO[]>,
        default: () => [],
        required: true,
    },
});

const colorMapping = computed(() =>
    Object.fromEntries(
        props.labelTypes.map((labelType) => [
            labelType.text,
            labelType.backgroundColor,
        ]),
    ),
);

const chartJSFormat = computed(() => {
    const data: {
        [user: string]: { labels: string[]; datasets: any[] };
    } = {};
    for (const user in props.distribution) {
        const labels = Object.keys(props.distribution[user]);
        labels.sort();
        const counts = labels.map((label) => props.distribution[user][label]);
        const colors = labels.map((label) =>
            label in colorMapping.value ? colorMapping.value[label] : "#00d1b2",
        );
        data[user] = {
            labels,
            datasets: [
                {
                    title: props.title,
                    backgroundColor: colors,
                    data: counts,
                },
            ],
        };
    }
    return data;
});
</script>
