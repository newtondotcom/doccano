import { useMainStore as useProjectsStore } from "@/store/projects";

export default defineNuxtRouteMiddleware(async (to) => {
  const projectsStore = useProjectsStore();
  const project = projectsStore.currentProject;
  const projectId = to.params.id as string;

  if (!project && projectId) {
    await projectsStore.setCurrentProject(projectId);
  }
});
