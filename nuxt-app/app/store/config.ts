import { defineStore } from "pinia";

export const useMainStore = defineStore("config", {
    state: () => ({
        rtl: false,
    }),
    actions: {
        setRTL(value: boolean) {
            this.rtl = value;
        },
    },
    getters: {
        isRTL(state) {
            return state.rtl;
        },
    },
});
