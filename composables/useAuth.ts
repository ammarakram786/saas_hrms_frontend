import { useAuthStore } from '~/stores/auth'

export const useAuth = () => {
  const authStore = useAuthStore()

  return {
    user: computed(() => authStore.user),
    userFullName: computed(() => authStore.userFullName),
    userInitials: computed(() => authStore.userInitials),
  }
}
