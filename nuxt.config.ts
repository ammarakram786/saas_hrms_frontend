// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // Performance optimizations
  experimental: {
    payloadExtraction: false, // Only extract critical CSS
    viewTransition: true, // Enable view transitions
  },

  // Build optimizations
  build: {
    transpile: ['primevue'],
    splitChunks: {
      layouts: true,
      pages: true,
      commons: true
    }
  },

  // CSS optimizations
  css: [
    'primevue/resources/themes/sakai/theme.css',
    'primevue/resources/primevue.min.css',
    'primeicons/primeicons.css',
    '~/assets/css/main.css'
  ],

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  // Runtime configuration
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL || 'http://localhost:8000/api/v1',
      appName: 'HRMS SaaS',
      appVersion: '1.0.0'
    }
  },

  // SPA mode for better API integration
  ssr: false,

  // Development proxy
  nitro: {
    devProxy: {
      '/api/v1': {
        target: process.env.API_URL || 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },

  // Performance optimizations
  vite: {
    build: {
      // Bundle analysis
      rollupOptions: {
        output: {
          manualChunks: {
            // Separate vendor chunks for better caching
            'primevue': ['primevue'],
            'primeicons': ['primeicons'],
            'axios': ['axios'],
            'jwt-decode': ['jwt-decode'],
            'chartjs': ['chart.js']
          }
        }
      },
      // Performance hints
      reportCompressedSize: true,
      chunkSizeWarningLimit: 1000
    }
  }
})
