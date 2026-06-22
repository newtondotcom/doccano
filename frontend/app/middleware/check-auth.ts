import { useMainStore as useAuthStore } from '@/store/auth'

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated || !authStore.getUsername) {
    await authStore.initAuth()
  }
})
