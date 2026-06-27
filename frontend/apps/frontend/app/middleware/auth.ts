import { useMainStore as useAuthStore } from "@/store/auth";

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    return navigateTo("/auth");
  }
});
