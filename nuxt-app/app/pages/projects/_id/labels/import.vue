<template>
    <form-import
        :error-message="errorMessage"
        @clear="clearErrorMessage"
        @upload="upload"
    />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import FormImport from "@/components/label/FormImport.vue";
import { useMainStore as useProjectStore } from "@/store/projects";

definePageMeta({
    layout: "project",
    middleware: ["check-auth", "auth", "setCurrentProject", "isProjectAdmin"],
    validate({ params, query, store }) {
        if (!["category", "span", "relation"].includes(query.type as string)) {
            return false;
        }
        if (/^\d+$/.test(params.id)) {
            const project = store.getters["projects/project"];
            return project.canDefineLabel;
        }
        return false;
    },
});

const errorMessage = ref("");
const route = useRoute();
const router = useRouter();
const { $services } = useNuxtApp() as any;
const projectStore = useProjectStore();

const projectId = computed(() => route.params.id as string);

const service = computed(() => {
    const type = route.query.type;
    if (type === "category") {
        return $services.categoryType;
    } else if (type === "span") {
        return $services.spanType;
    } else {
        return $services.relationType;
    }
});

const upload = async (file: File) => {
    try {
        await service.value.upload(projectId.value, file);
        router.push(`/projects/${projectId.value}/labels`);
    } catch (e: any) {
        errorMessage.value = e.message;
    }
};

const clearErrorMessage = () => {
    errorMessage.value = "";
};
</script>
