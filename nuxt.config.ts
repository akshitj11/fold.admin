// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  ui: {
    colorMode: false,
  },
  app: {
    head: {
      title: 'Fold Admin',
      meta: [{ name: 'robots', content: 'noindex, nofollow' }],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'https://backend.fold.taohq.org'
    }
  },
  css: ['~/assets/css/main.css']
})
