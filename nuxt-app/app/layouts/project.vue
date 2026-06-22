<template>
  <v-app>
    <LayoutTheHeader>
      <template #leftDrawerIcon>
        <v-app-bar-nav-icon @click="drawerLeft = !drawerLeft" />
      </template>
    </LayoutTheHeader>

    <v-navigation-drawer v-model="drawerLeft" app clipped color="">
      <LayoutTheSideBar :is-project-admin="isProjectAdmin" :project="currentProject" />
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="fill-height">
        <v-row justify="center" class="fill-height">
          <v-col class="fill-height">
            <NuxtPage />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore as useProjectsStore } from '@/store/projects'

const route = useRoute()
const { $repositories } = useNuxtApp()

const projectsStore = useProjectsStore()
const { currentProject } = storeToRefs(projectsStore)

const drawerLeft = ref(null)
const isProjectAdmin = ref(false)

onBeforeMount(async () => {
  const member = await $repositories.member.fetchMyRole(route.params.id)
  isProjectAdmin.value = member.isProjectAdmin
})
</script>
