export default defineNuxtRouteMiddleware(async (to) => {
  const { $repositories } = useNuxtApp();
  const { localePath } = useI18n();
  const projectId = to.params.id as string;

  const member = await $repositories.member.fetchMyRole(projectId);

  if (!member.isProjectAdmin) {
    return navigateTo(localePath("/projects/" + projectId));
  }
});
