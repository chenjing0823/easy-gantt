module.exports = {
  theme: '',
  title: 'Easy Gantt',
  description: 'Easy Gantt 甘特图组件说明',
  base: '/',
  port: '8080',
  themeConfig: { // 新增代码
    nav: [ // 配置顶部导航栏
      {
        text: '首页',
        link: '/'
      },
      {
        text: '组件',
        link: '/comps/'
      }
    ],
    sidebar: { // 配置侧边栏部分
      '/comps/': ['/comps/', '/comps/easygantt.md']
    }
  },
  head: [],
  plugins: ['demo-container'],
  markdown: {}
}
