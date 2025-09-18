import type { UseFetchOptions } from 'nuxt/app'

export const useApi = <T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {}
) => {
  const config = useRuntimeConfig()
  const { tokens } = useAuthStore()

  return $fetch<T>(url, {
    baseURL: config.public.apiUrl,
    ...options,
    headers: {
      ...options.headers,
      ...(tokens?.access_token && {
        Authorization: `Bearer ${tokens.access_token}`
      })
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        // Token expired, try to refresh or logout
        const authStore = useAuthStore()
        if (tokens?.refresh_token) {
          authStore.refreshToken().catch(() => {
            authStore.logout()
          })
        } else {
          authStore.logout()
        }
      }
    }
  })
}

export default useApi
