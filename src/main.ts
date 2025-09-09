import { createApp } from 'vue' // 从 'vue' 库中导入 createApp 函数，用于创建 Vue 应用实例
import App from './App.vue' // 导入根组件 App.vue
import router from './router/index.ts' // 导入路由配置
import './styles/_index.css' // 导入全局样式文件

const app = createApp(App) // 创建 Vue 应用实例，并将根组件 App 传入
app.use(router) // 为应用实例安装路由插件，使其能够使用路由功能
app.mount('#app') // 将应用实例挂载到 index.html 中 id 为 'app' 的 DOM 元素上，使 Vue 应用生效