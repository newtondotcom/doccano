import { Project } from "@/domain/models/project/project";

export const useProjectItem = () => {
  const state = reactive({
    project: {} as Project,
  });

  const { $services } = useNuxtApp();

  const getProjectById = async (projectId: string) => {
    state.project = await $services.project.findById(projectId);
  };

  return {
    state,
    getProjectById,
  };
};
