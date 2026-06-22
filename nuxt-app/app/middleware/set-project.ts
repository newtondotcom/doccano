import { useMainStore as useProjectsStore } from '@/store/projects'

export default defineNuxtRouteMiddleware(async (to) => {
  const projectsStore = useProjectsStore()
  const project = projectsStore.currentProject
  const isEmpty = Object.keys(project).length === 0 && project.constructor === Object
  const projectId = to.params.id as string

  if (isEmpty && projectId) {
    await projectsStore.setCurrentProject(projectId)
  }
})
