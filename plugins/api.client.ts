interface ApiError {
  error: {
    message: string
    code?: string
    status_code?: number
    field_errors?: Record<string, string>
  }
}

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
      // Enhanced error handling
      const errorHandler = useErrorHandler()

      if (process.client) {
        // Handle different error types
        switch (response.status) {
          case 400:
            errorHandler.handleValidationError(response._data as ApiError)
            break
          case 401:
            errorHandler.handleUnauthorized()
            break
          case 403:
            errorHandler.handleForbidden(response._data as ApiError)
            break
          case 404:
            errorHandler.handleNotFound(response._data as ApiError)
            break
          case 423:
            errorHandler.handleLocked(response._data as ApiError)
            break
          case 429:
            errorHandler.handleRateLimit(response._data as ApiError)
            break
          case 500:
          case 502:
          case 503:
          case 504:
            errorHandler.handleServerError(response._data as ApiError)
            break
          default:
            errorHandler.handleGenericError(response._data as ApiError)
        }
      }

      // Re-throw to allow individual components to handle if needed
      throw response._data
    }
  })

  return {
    provide: {
      api: $api
    }
  }
})
