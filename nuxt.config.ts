// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  css: [
    'primevue/resources/themes/aura-light-green/theme.css',
    'primevue/resources/primevue.min.css',
    'primeicons/primeicons.css',
    '~/assets/css/main.css'
  ],
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
      appName: 'HRMS SaaS',
      appVersion: '1.0.0'
    }
  },
  ssr: false, // SPA mode for better API integration
  nitro: {
    devProxy: {
      '/api/v1': {
        target: process.env.API_URL,
        changeOrigin: true
      }
    }
  }
})
