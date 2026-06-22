<template>
    <v-card>
        <v-card-title v-if="isStaff">
            <v-btn
                class="text-capitalize"
                color="primary"
                @click.stop="$router.push('projects/create')"
            >
                {{ $t("generic.create") }}
            </v-btn>
            <v-btn
                class="text-capitalize ms-2"
                color="primary"
                :disabled="!canClone"
                @click.stop="clone"
            >
                Clone
            </v-btn>
            <v-btn
                class="text-capitalize ms-2"
                :disabled="!canDelete"
                outlined
                @click.stop="dialogDelete = true"
            >
                {{ $t("generic.delete") }}
            </v-btn>
            <v-dialog v-model="dialogDelete">
                <form-delete
                    :selected="selected"
                    @cancel="dialogDelete = false"
                    @remove="remove"
                />
            </v-dialog>
        </v-card-title>
        <project-list
            v-model="selected"
            :items="projects.items"
            :is-loading="isLoading"
            :total="projects.count"
            @update:query="updateQuery"
        />
    </v-card>
</template>

<script setup lang="ts">
import _ from "lodash";
import { computed, onMounted, ref, watch } from "vue";
import ProjectList from "@/components/project/ProjectList.vue";
import FormDelete from "@/components/project/FormDelete.vue";
import { Page } from "@/domain/models/page";
import { Project } from "@/domain/models/project/project";
import { SearchQueryData } from "@/services/application/project/projectApplicationService";
import { useMainStore as useAuthStore } from "@/store/auth";

definePageMeta({
    layout: "projects",
    middleware: ["check-auth", "auth"],
});

const dialogDelete = ref(false);
const projects = ref({} as Page<Project>);
const selected = ref<Project[]>([]);
const isLoading = ref(false);
const route = useRoute();
const router = useRouter();
const { $services } = useNuxtApp() as any;
const authStore = useAuthStore();

const isStaff = computed(() => authStore.isStaff);
const canDelete = computed(() => selected.value.length > 0);
const canClone = computed(() => selected.value.length === 1);

const fetchProjects = async () => {
    isLoading.value = true;
    projects.value = await $services.project.list(
        route.query as unknown as SearchQueryData,
    );
    isLoading.value = false;
};

const remove = async () => {
    await $services.project.bulkDelete(selected.value);
    await fetchProjects();
    dialogDelete.value = false;
    selected.value = [];
};

const clone = async () => {
    const project = await $services.project.clone(selected.value[0]);
    selected.value = [];
    router.push(`/projects/${project.id}/settings`);
};

const updateQuery = (query: object) => {
    router.push(query);
};

watch(
    () => route.query,
    _.debounce(() => {
        fetchProjects();
    }, 1000),
);

onMounted(fetchProjects);
</script>

<style scoped>
::v-deep .v-dialog {
    width: 800px;
}
</style>
