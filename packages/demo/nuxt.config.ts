export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  ssr: false,
  css: [
    '@for-the-people-initiative/design-system/css',
    '@for-the-people-initiative/design-system/css/theme-dark.css',
  ],
  app: {
    head: {
      title: 'FTP Feedback — Widget Demo',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      script: [
        {
          src: '/widget.js',
          type: 'text/javascript',
          defer: true,
          'data-app-id': 'app_mhj_default',
          'data-api-url': 'https://ftp-feedback-api.onrender.com',
          'data-position': 'bottom-right',
          'data-theme': 'light',
          'data-categories': 'bug,suggestion,question',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
      ],
    },
  },
  nitro: {
    preset: 'static',
  },
})
