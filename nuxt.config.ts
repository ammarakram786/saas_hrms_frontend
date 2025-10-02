// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-10-02',

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
    'primeicons/primeicons.css',
    '~/assets/css/main.css'
  ],

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@primevue/nuxt-module'
  ],

  // PrimeVue configuration with Aura theme
  primevue: {
    options: {
      ripple: true,
      inputVariant: 'outlined',
      theme: {
        preset: 'Aura',
        options: {
          prefix: '',
          darkModeSelector: 'system',
          cssLayer: false
        },
        rules: {
          primary: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7c3aed',
            800: '#6b21a8',
            900: '#581c87',
            950: '#3b0764'
          }
        }
      }
    },
    components: {
      include: [
        'Button', 'InputText', 'Password', 'Dialog', 'DataTable', 'Column',
        'Dropdown', 'Calendar', 'Card', 'Menu', 'MenuBar', 'Toast',
        'ConfirmDialog', 'Sidebar', 'Avatar', 'Badge', 'Chip', 'ProgressBar',
        'Textarea', 'MultiSelect', 'Checkbox', 'RadioButton', 'TabView',
        'TabPanel', 'TieredMenu', 'OverlayPanel', 'Tag', 'Divider',
        'Splitter', 'SplitterPanel', 'Panel', 'Accordion', 'AccordionTab',
        'FileUpload', 'InputNumber', 'InputSwitch', 'Slider', 'Rating',
        'Knob', 'Chart', 'Tree', 'TreeTable', 'OrganizationChart',
        'Timeline', 'Galleria', 'Image', 'Carousel', 'PickList', 'OrderList',
        'DataView', 'DataViewLayoutOptions', 'Paginator', 'VirtualScroller',
        'Skeleton', 'ProgressSpinner', 'InlineMessage', 'Message', 'BlockUI',
        'DeferredContent',
      ]
    }
  },

  // Runtime configuration
  runtimeConfig: {
    public: {
      apiBase: process.env.API_URL || 'http://localhost:8005/api/v1',
      appName: 'HRMS',
      appVersion: '1.0.0'
    }
  },

  // SPA mode for better API integration
  ssr: false,

  // Development proxy
  nitro: {
    devProxy: {
      '/api/v1': {
        target: process.env.API_URL || 'http://localhost:8005',
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
