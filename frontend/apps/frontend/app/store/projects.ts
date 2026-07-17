import { defineStore } from "pinia";
import type { Project } from "@/domain/models/project/project";

export const useMainStore = defineStore("projects", {
  state: () => ({
    current: null as Project | null,
  }),
  getters: {
    currentProject(state) {
      return state.current;
    },

    project(state) {
      return state.current;
    },
  },

  actions: {
    setCurrent(payload: Project | null) {
      this.current = payload;
    },
    async setCurrentProject(projectId: string | number) {
      const { $services } = useNuxtApp();
      const project = await $services.project.findById(String(projectId));
      this.current = project;
    },
  },
});
