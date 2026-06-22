<template>
    <v-app>
        <the-header>
            <template #leftDrawerIcon>
                <v-app-bar-nav-icon @click="drawerLeft = !drawerLeft" />
            </template>
        </the-header>

        <v-navigation-drawer v-model="drawerLeft" app clipped>
            <the-side-bar
                :is-project-admin="isProjectAdmin"
                :project="currentProject"
            />
        </v-navigation-drawer>

        <v-main class="pb-0">
            <nuxt />
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import TheHeader from "@/components/layout/TheHeader";
import TheSideBar from "@/components/layout/TheSideBar";
import { useMainStore as useProjectStore } from "@/store/projects";

definePageMeta({
    middleware: ["check-auth", "auth", "set-project"],
});

const drawerLeft = ref(null);
const isProjectAdmin = ref(false);
const projectStore = useProjectStore();
const currentProject = computed(() => projectStore.currentProject);
const route = useRoute();
const { $repositories, $services } = useNuxtApp() as any;

watch(
    () => route.query,
    () => {
        $services.option.save(route.params.id, route.query);
    },
    { deep: true },
);

onMounted(async () => {
    const member = await $repositories.member.fetchMyRole(route.params.id);
    isProjectAdmin.value = member.isProjectAdmin;
});
</script>
