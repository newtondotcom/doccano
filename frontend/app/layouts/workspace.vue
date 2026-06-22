<template>
  <v-app>
    <LayoutTheHeader>
      <template #leftDrawerIcon>
        <v-app-bar-nav-icon @click="drawerLeft = !drawerLeft" />
      </template>
    </LayoutTheHeader>

    <v-navigation-drawer v-model="drawerLeft" app clipped>
      <LayoutTheSideBar :is-project-admin="isProjectAdmin" :project="currentProject" />
    </v-navigation-drawer>

    <v-main class="pb-0">
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, watch, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore as useProjectsStore } from '@/store/projects'

const route = useRoute()
const { $repositories, $services } = useNuxtApp()

const projectsStore = useProjectsStore()
const { currentProject } = storeToRefs(projectsStore)
const { setCurrentProject } = projectsStore

const drawerLeft = ref(null)
const isProjectAdmin = ref(false)

watch(
  () => route.query,
  () => {
    $services.option.save(route.params.id, route.query)
  }
)

onBeforeMount(async () => {
  const project = currentProject.value
  const isEmpty = Object.keys(project).length === 0 && project.constructor === Object
  if (isEmpty) {
    await setCurrentProject(route.params.id)
  }

  const member = await $repositories.member.fetchMyRole(route.params.id)
  isProjectAdmin.value = member.isProjectAdmin
})
</script>
