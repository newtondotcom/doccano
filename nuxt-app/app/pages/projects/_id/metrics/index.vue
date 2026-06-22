<template>
    <v-row>
        <v-col cols="12">
            <member-progress />
        </v-col>
        <v-col v-if="!!project.canDefineCategory" cols="12">
            <label-distribution
                title="Category Distribution"
                :distribution="categoryDistribution"
                :label-types="categoryTypes"
            />
        </v-col>
        <v-col v-if="!!project.canDefineSpan" cols="12">
            <label-distribution
                title="Span Distribution"
                :distribution="spanDistribution"
                :label-types="spanTypes"
            />
        </v-col>
        <v-col v-if="!!project.canDefineRelation" cols="12">
            <label-distribution
                title="Relation Distribution"
                :distribution="relationDistribution"
                :label-types="relationTypes"
            />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import LabelDistribution from "@/components/metrics/LabelDistribution";
import MemberProgress from "@/components/metrics/MemberProgress";
import { useMainStore as useProjectStore } from "@/store/projects";

definePageMeta({
    layout: "project",
    middleware: ["check-auth", "auth", "setCurrentProject", "isProjectAdmin"],
    validate({ params }) {
        return /^\d+$/.test(params.id);
    },
});

const categoryTypes = ref([]);
const categoryDistribution = ref({});
const relationTypes = ref([]);
const relationDistribution = ref({});
const spanTypes = ref([]);
const spanDistribution = ref({});
const route = useRoute();
const { $services, $repositories } = useNuxtApp() as any;
const projectStore = useProjectStore();

const project = computed(() => projectStore.project as any);
const projectId = computed(() => route.params.id as string);

const loadMetrics = async () => {
    if (project.value.canDefineCategory) {
        categoryTypes.value = await $services.categoryType.list(projectId.value);
        categoryDistribution.value =
            await $repositories.metrics.fetchCategoryDistribution(projectId.value);
    }
    if (project.value.canDefineSpan) {
        spanTypes.value = await $services.spanType.list(projectId.value);
        spanDistribution.value = await $repositories.metrics.fetchSpanDistribution(projectId.value);
    }
    if (project.value.canDefineRelation) {
        relationTypes.value = await $services.relationType.list(projectId.value);
        relationDistribution.value =
            await $repositories.metrics.fetchRelationDistribution(projectId.value);
    }
};

onMounted(loadMetrics);
</script>
