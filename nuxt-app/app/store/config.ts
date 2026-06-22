import { defineStore } from "pinia";

export const useMainStore = defineStore("config", {
    state: () => ({
        rtl: false,
    }),
    actions: {
        changeRTLState(state) {
            state.rtl = !state.rtl;
        },

        toggleRTL({ commit }) {
            commit("changeRTLState");
        },
    },
    getters: {
        isRTL(state) {
            return state.rtl;
        },
    },
});
