import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Doccano",
  description: "Doccano docs",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/favicon.ico',
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Home', link: '/' }
    ],

    sidebar: [
      {
        text: 'Get started',
        items: [
          { text: 'Get started', link: '/index' },
          { text: 'Install and upgrade doccano', link: '/install_and_upgrade_doccano' },
          { text: 'Tutorial', link: '/tutorial' },
          { text: 'Setup cloud storage', link: '/setup_cloud_storage' },
          { text: 'Developer guide', link: '/developer_guide' },
          { text: 'FAQ', link: '/faq' },
          { text: 'Code of conduct', link: '/CODE_OF_CONDUCT' },
          { text: 'Roadmap', link: '/ROADMAP' }
        ]
      },
      {
        text: 'Advanced',
        items: [
          { text: 'AWS HTTPS settings', link: '/advanced/aws_https_settings' },
          { text: 'OAuth2 settings', link: '/advanced/oauth2_settings' },
          { text: 'Auto labeling settings', link: '/advanced/auto_labelling_config' },
          { text: 'Internationalization (i18n)', link: '/advanced/internationalization' },
          { text: 'Running Doccano with Docker', link: '/advanced/compose_quickstart' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/newtondotcom/doccano' }
    ]
  }
})
