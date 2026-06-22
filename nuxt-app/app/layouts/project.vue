<template>
    <v-app>
        <the-header>
            <template #leftDrawerIcon>
                <v-app-bar-nav-icon @click="drawerLeft = !drawerLeft" />
            </template>
        </the-header>

        <v-navigation-drawer v-model="drawerLeft" app clipped color="">
            <the-side-bar
                :is-project-admin="isProjectAdmin"
                :project="currentProject"
            />
        </v-navigation-drawer>

        <v-main>
            <v-container fluid fill-height>
                <v-layout justify-center>
                    <v-flex fill-height>
                        <nuxt />
                    </v-flex>
                </v-layout>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import TheHeader from "@/components/layout/TheHeader";
import TheSideBar from "@/components/layout/TheSideBar";
import { useMainStore as useProjectStore } from "@/store/projects";

const drawerLeft = ref(null);
const isProjectAdmin = ref(false);
const projectStore = useProjectStore();
const currentProject = computed(() => projectStore.currentProject);
const route = useRoute();
const { $repositories } = useNuxtApp() as any;

onMounted(async () => {
    const member = await $repositories.member.fetchMyRole(route.params.id);
    isProjectAdmin.value = member.isProjectAdmin;
});
</script>
