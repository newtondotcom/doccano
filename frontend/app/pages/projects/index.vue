<template>
  <v-card>
    <v-card-title v-if="isStaff">
      <v-btn class="text-capitalize" color="primary" @click.stop="$router.push('projects/create')">
        {{ $t("generic.create") }}
      </v-btn>
      <v-btn class="text-capitalize ms-2" color="primary" :disabled="!canClone" @click.stop="clone">
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
        <ProjectFormDelete :selected="selected" @cancel="dialogDelete = false" @remove="remove" />
      </v-dialog>
    </v-card-title>
    <ProjectList
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
import { useMainStore as useAuthStore } from "@/store/auth";
import { Page } from "@/domain/models/page";
import { Project } from "@/domain/models/project/project";
import { SearchQueryData } from "@/services/application/project/projectApplicationService";

definePageMeta({
  layout: "projects",
  middleware: ["check-auth", "auth"],
});

const route = useRoute();
const router = useRouter();
const { $services } = useNuxtApp();
const authStore = useAuthStore();

const dialogDelete = ref(false);
const projects = ref({} as Page<Project>);
const selected = ref([] as Project[]);
const isLoading = ref(false);

const isStaff = computed(() => authStore.isStaff);
const canDelete = computed(() => selected.value.length > 0);
const canClone = computed(() => selected.value.length === 1);

async function load() {
  isLoading.value = true;
  projects.value = await $services.project.list(route.query as unknown as SearchQueryData);
  isLoading.value = false;
}

watch(
  () => route.query,
  _.debounce(() => {
    load();
  }, 1000),
  { immediate: true, deep: true },
);

async function remove() {
  await $services.project.bulkDelete(selected.value);
  await load();
  dialogDelete.value = false;
  selected.value = [];
}

async function clone() {
  const project = await $services.project.clone(selected.value[0]);
  selected.value = [];
  router.push(`/projects/${project.id}/settings`);
}

function updateQuery(query: object) {
  router.push(query);
}
</script>

<style scoped>
::v-deep .v-dialog {
  width: 800px;
}
</style>
