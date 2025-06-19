import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Quest-Board-Docs",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: '要件定義', link: '/requirements' },
      { text: 'スタイルガイド', link: '/style-guide' }
    ],

    sidebar: [
      {
        text: 'ドキュメント',
        items: [
          { text: '要件定義', link: '/requirements' },
          { text: 'スタイルガイド', link: '/style-guide' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
