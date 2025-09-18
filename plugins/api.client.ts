export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const $api = $fetch.create({
    baseURL: config.public.apiUrl,
    onRequest({ request, options }) {
      // Add auth token if available
      if (process.client) {
        const tokens = localStorage.getItem('auth_tokens')
        if (tokens) {
          const { access_token } = JSON.parse(tokens)
          if (access_token) {
            options.headers = {
              ...options.headers,
              Authorization: `Bearer ${access_token}`
            }
          }
        }
      }
    },
    onResponseError({ response }) {
      // Handle 401 responses
      if (response.status === 401 && process.client) {
        const authStore = useAuthStore()
        authStore.logout()
      }
    }
  })
  
  return {
    provide: {
      api: $api
    }
  }
})
