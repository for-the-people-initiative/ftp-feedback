export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  ssr: false,
  css: [
    '@for-the-people-initiative/design-system/css',
    '@for-the-people-initiative/design-system/css/theme-dark.css',
  ],
  modules: ['@nuxtjs/google-fonts'],
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
    },
  },
  app: {
    head: {
      title: 'FTP Feedback — Widget Demo',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
  nitro: {
    preset: 'static',
  },
})
