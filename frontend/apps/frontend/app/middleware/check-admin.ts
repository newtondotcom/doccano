import { useMainStore as useProjectsStore } from "@/store/projects";

export default defineNuxtRouteMiddleware(async (to) => {
  const { $repositories } = useNuxtApp();
  const { localePath } = useI18n();
  const projectsStore = useProjectsStore();
  const projectId = to.params.id as string;

  try {
    await projectsStore.setCurrentProject(projectId);
  } catch {
    return navigateTo("/projects");
  }

  const member = await $repositories.member.fetchMyRole(projectId);
  const projectRoot = localePath("/projects/" + projectId);
  const path = to.fullPath.replace(/\/$/g, "");

  if (member.isProjectAdmin || path === projectRoot || path.startsWith(projectRoot + "/dataset")) {
    return;
  }

  return navigateTo(projectRoot);
});
