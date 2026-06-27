import { useMainStore as useProjectsStore } from "@/store/projects";

export default defineNuxtRouteMiddleware((to) => {
  if (!["category", "span", "relation"].includes(to.query.type as string)) {
    return abortNavigation();
  }

  const projectsStore = useProjectsStore();
  if (!projectsStore.project?.canDefineLabel) {
    return abortNavigation();
  }
});
