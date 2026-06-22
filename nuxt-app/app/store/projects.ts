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
        setCurrent(state, payload) {
            state.current = payload;
        },
        async setCurrentProject({ commit }, projectId) {
            try {
                const project =
                    await this.$services.project.findById(projectId);
                commit("setCurrent", project);
            } catch (error) {
                throw new Error(error);
            }
        },
    },
});
