// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({

  modules: [
    '@pinia/nuxt',
    '@primevue/nuxt-module',
    '@nuxt/eslint',
    '@vueuse/nuxt',
  ],
  devtools: { enabled: true },
  css: [
    '@/assets/styles.scss',
    '@/assets/tailwind.css',
  ],

  // Runtime config
  runtimeConfig: {
    public: {
      appName: 'HRMS',
      apiBase: process.env.API_URL,
    },
  },
  devServer: {
    port: 3000,
    host: 'localhost',
  }, compatibilityDate: '2025-07-15',
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
      },
    },
  },
  primevue: {
    autoImport: false,
    components: {
      include: '*',
      exclude: ['Form', 'FormField'],
    },
    directives: {
      include: '*',
    },
    importTheme: { from: '@/theme/app-theme.ts' },
  },
})
