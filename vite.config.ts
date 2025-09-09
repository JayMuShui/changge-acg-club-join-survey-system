import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite' // 引入 Tailwind CSS Vite 插件
import VueDevTools from 'vite-plugin-vue-devtools' // 引入 Vue DevTools 插件
import vue from '@vitejs/plugin-vue' // 引入 Vue 支持插件

export default defineConfig({
    base: '/', // 部署应用包时的基本路径，'/' 表示根路径
    plugins: [
      vue(), // 启用 Vue 单文件组件支持
      VueDevTools(), // 启用 Vue DevTools 插件，便于开发调试
      tailwindcss(), // 启用 Tailwind CSS 插件，支持原子化 CSS
    ],
    server: {
      host: '0.0.0.0', // 允许外部访问本地开发服务器
      port: 5173, // 开发服务器端口
      open: false, // 启动时不自动打开浏览器
      cors: true, // 启用 CORS 跨域
      strictPort: true, // 端口被占用时直接退出，不尝试其他端口
    },
    build: {
      outDir: 'dist', // 构建输出目录
      assetsDir: 'assets', // 静态资源目录
      sourcemap: false, // 不生成 source map
      target: 'es2015', // 构建目标 JS 版本
    },
    preview: { 
      host: '0.0.0.0', // 预览服务器允许外部访问
      port: 5000, // 预览服务器端口
      open: true // 启动预览时自动打开浏览器
    },
  })

