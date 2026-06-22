import { defineStore } from "pinia";

export const useMainStore = defineStore("projects", {
    state: () => ({
        current: {},
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
        setCurrent(payload) {
            this.current = payload;
        },
        async setCurrentProject(projectId: string | number) {
            const { $services } = useNuxtApp();
            const project = await $services.project.findById(String(projectId));
            this.current = project;
        },
    },
});
