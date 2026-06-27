import { useMainStore as useProjectsStore } from "@/store/projects";

export default defineNuxtRouteMiddleware(() => {
  const projectsStore = useProjectsStore();

  if (!projectsStore.project?.isTextProject) {
    return abortNavigation();
  }
});
