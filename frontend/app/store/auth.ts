import { defineStore } from "pinia";

export const useMainStore = defineStore("auth", {
    state: () => ({
        username: null,
        id: null,
        isAuthenticated: false,
        isStaff: false,
    }),
    getters: {
        getIsAuthenticated(state) {
            return state.isAuthenticated;
        },
        getUsername(state) {
            return state.username;
        },
        getUserId(state) {
            return state.id;
        },
        getIsStaff(state) {
            return state.isStaff;
        },
    },

    actions: {
        async authenticateUser(authData: { username: string; password: string }) {
            const { $repositories } = useNuxtApp();
            await $repositories.auth.login(authData.username, authData.password);
            this.isAuthenticated = true;
        },
        async fetchSocialLink() {
            const { $repositories } = useNuxtApp();
            return await $repositories.auth.socialLink();
        },
        async initAuth() {
            const { $repositories } = useNuxtApp();
            try {
                const user = await $repositories.user.getProfile();
                this.isAuthenticated = true;
                this.username = user.username;
                this.id = user.id;
                this.isStaff = user.isStaff;
            } catch {
                this.isAuthenticated = false;
                this.isStaff = false;
            }
        },
        async logout() {
            const { $repositories } = useNuxtApp();
            await $repositories.auth.logout();
            this.isAuthenticated = false;
            this.isStaff = false;
            this.username = null;
        },
    },
});
