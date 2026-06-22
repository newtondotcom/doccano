import { useMainStore as useProjectsStore } from '@/store/projects'

export default defineNuxtRouteMiddleware(async (to) => {
  const projectId = to.params.id as string
  if (!projectId) {
    return
  }

  const projectsStore = useProjectsStore()
  const current = projectsStore.currentProject

  if (String(current?.id) !== projectId) {
    try {
      await projectsStore.setCurrentProject(projectId)
    } catch {
      return navigateTo('/projects')
    }
  }
})
