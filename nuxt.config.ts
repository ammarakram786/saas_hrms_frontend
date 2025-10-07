// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

   // Runtime config
   runtimeConfig: {
    public: {
        appName: 'HRMS',
        apiBase: 'http://localhost:8000'
    }
},
  modules: [
    '@pinia/nuxt',
    '@primevue/nuxt-module',
    '@nuxt/eslint',
    '@vueuse/nuxt',
  ],
  css: [
    '@/assets/styles.scss',
    '@/assets/tailwind.css',
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  devServer: {
    port: 3000,
    host: 'localhost',
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
