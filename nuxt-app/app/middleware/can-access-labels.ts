import { useMainStore as useProjectsStore } from '@/store/projects'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!/^\d+$/.test(to.params.id as string)) {
    return abortNavigation()
  }

  const projectsStore = useProjectsStore()
  if (!projectsStore.project?.canDefineLabel) {
    return abortNavigation()
  }

  const { $repositories } = useNuxtApp()
  const member = await $repositories.member.fetchMyRole(to.params.id as string)

  if (member.isProjectAdmin) {
    return
  }

  if (!projectsStore.project.allowMemberToCreateLabelType) {
    return abortNavigation()
  }
})
