   <template>
      <!-- 页面顶部导航区域 -->
      <div class="flex justify-between items-center w-full px-4">
        <!-- 返回问卷按钮 -->
        <button @click="goToSurvey" class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-200 transition-all duration-300 hover:scale-105 hover:text-white hover:shadow-xl active:scale-95 active:shadow-md">
          返回问卷
        </button>
        <!-- 跳转到Joker动漫社介绍页面的链接 -->
        <a @click="goToJokerClub" class="joker-club-link">
          关于纪念已经停止活动的姊妹社团桂平三中Joker动漫社
        </a>
      </div>
      <!-- 主要内容容器 -->
      <div class="container mx-auto p-4 text-center">    
        <!-- 页面标题和Logo -->
        <div class="flex items-center justify-center mb-4">
          <img src="/favicon.svg" alt="Logo" class="h-8 w-8 mr-2" />
          <h1 class="text-2xl font-bold">关于长歌动漫社</h1>
        </div>
        <!-- 社团介绍段落1 -->
        <p class="mb-4 text-indent-2em">桂平市第一中学长歌动漫社始创于2016年，曾用名千崎动漫社，由2010年代对ACG文化抱有浓厚兴趣的学生自发组建。作为桂平一中现存四大社团之一，我们历经近十年代际传承与成员迭代仍保持稳定发展，既彰显自身旺盛生命力，也印证了ACG文化在中国大陆的蓬勃发展态势，当前在该校学生活动中占据重要领导地位。</p>
        <!-- 社团介绍段落2 -->
        <p class="mb-4 text-indent-2em">我们为二次元爱好者搭建交流空间，组织研讨赏析优秀动漫作品，同时以推广普及动漫画文化、帮助成员建立正确艺术观为己任。在本社，你能找到意趣相投的同好伙伴，丰富课余生活，更能在此锻炼个人能力、实现自我提升。作为充满温暖与友善的集体，我们欢迎同为二次元爱好者的你加入！</p>

      </div>
      <!-- 部门展示标题 -->
      <h3 class="text-2xl font-bold mt-8">目前下设的社团部门</h3>
      <!-- 部门展示组件，通过dataUrl获取数据 -->
      <DepartmentDisplay dataUrl="/department-oc/setting.json" />
      <!-- 负责人展示标题 -->
      <h3 class="text-2xl font-bold mt-8">本届社团部门负责人</h3>
      <!-- 负责人展示组件，通过dataUrl获取数据 -->
      <LeaderDisplay dataUrl="/leader/2025-club-leader.json" />
      <!-- 关于系统标题 -->
      <h3 class="text-2xl font-bold mt-8">About System | 关于系统</h3>
      <!-- 系统相关链接徽章区域 -->
      <div class="flex flex-wrap justify-center gap-4 mt-4">
        <!-- Github链接 -->
        <a href="https://github.com/JayMuShui/Chouka-ACG-Club-Join-Survey-System" target="_blank" class="flex-shrink-0">
          <img alt="Static Badge" src="https://img.shields.io/badge/Github-black?style=for-the-badge&logo=github" class="h-8 hover:scale-105 transition-transform">
        </a>
        <!-- 作者个人主页链接 -->
        <a href="https://jaymushui.github.io" target="_blank" class="flex-shrink-0">
          <img alt="Static Badge" src="https://img.shields.io/badge/Author-JayMuShui-00E676?style=for-the-badge&logo=mit" class="h-8 hover:scale-105 transition-transform">
        </a>
        <!-- MIT许可证链接 -->
        <a href="https://opensource.org/licenses/MIT" target="_blank" class="flex-shrink-0">
          <img alt="Static Badge" src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&logo=mit" class="h-8 hover:scale-105 transition-transform">
        </a>
        <!-- Git官网链接 -->
        <a href="https://git-scm.com" target="_blank" class="flex-shrink-0">
          <img alt="Static Badge" src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" class="h-8 hover:scale-105 transition-transform">
        </a>
        <!-- Node.js官网链接 -->
        <a href="https://nodejs.org" target="_blank" class="flex-shrink-0">
          <img alt="Static Badge" src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" class="h-8 hover:scale-105 transition-transform">
        </a>
        <!-- Pnpm官网链接 -->
        <a href="https://pnpm.io" target="_blank" class="flex-shrink-0">
          <img alt="Static Badge" src="https://img.shields.io/badge/Pnpm-FF69B4?style=for-the-badge&logo=pnpm&logoColor=white" class="h-8 hover:scale-105 transition-transform">
        </a>
        <!-- TypeScript官网链接 -->
        <a href="https://www.typescriptlang.org" target="_blank" class="flex-shrink-0">
          <img alt="Static Badge" src="https://img.shields.io/badge/TypeScript-4EC5F1?style=for-the-badge&logo=typescript&logoColor=white" class="h-8 hover:scale-105 transition-transform">
        </a>
        <!-- PostCSS官网链接 -->
        <a href="https://postcss.org" target="_blank" class="flex-shrink-0">
          <img alt="Static Badge" src="https://img.shields.io/badge/PostCSS-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white" class="h-8 hover:scale-105 transition-transform">
        </a>
        <!-- TailwindCSS官网链接 -->
        <a href="https://tailwindcss.com" target="_blank" class="flex-shrink-0">
          <img alt="Static Badge" src="https://img.shields.io/badge/TailwindCSS-blue?style=for-the-badge&logo=tailwindcss&logoColor=white" class="h-8 hover:scale-105 transition-transform">
        </a>
        <!-- Vue3官网链接 -->
        <a href="https://vuejs.org" target="_blank" class="flex-shrink-0">
          <img alt="Static Badge" src="https://img.shields.io/badge/Vue3-00796b?style=for-the-badge&logo=vuedotjs" class="h-8 hover:scale-105 transition-transform">
        </a>
        <!-- Vite官网链接 -->
        <a href="https://vitejs.dev" target="_blank" class="flex-shrink-0">
          <img alt="Static Badge" src="https://img.shields.io/badge/Vite-20272F?style=for-the-badge&logo=vite" class="h-8 hover:scale-105 transition-transform">
        </a>
        <!-- Crypto.JS库链接 -->
        <a href="https://github.com/brix/crypto-js" target="_blank" class="flex-shrink-0">
          <img alt="Static Badge" src="https://img.shields.io/badge/PKG-Crypto.JS-00E676?style=for-the-badge" class="h-8 hover:scale-105 transition-transform">
        </a>
        <!-- GSAP库链接 -->
        <a href="https://github.com/greensock/GSAP" target="_blank" class="flex-shrink-0">
          <img alt="Static Badge" src="https://img.shields.io/badge/PKG-GSAP-FF69B4?style=for-the-badge" class="h-8 hover:scale-105 transition-transform">
        </a>
        <!-- ACG图片资源链接 -->
        <a href="https://t.alcy.cc" target="_blank" class="flex-shrink-0">
          <img alt="Static Badge" src="https://img.shields.io/badge/ACG_image-t.alcy.cc-pink?style=for-the-badge" class="h-8 hover:scale-105 transition-transform">
        </a>
        <!-- 长歌动漫社徽章 -->
        <a target="_blank" class="flex-shrink-0">
          <img alt="Static Badge" src="https://img.shields.io/badge/I_❤-长歌动漫社-F48FB1?style=for-the-badge" class="h-8 hover:scale-105 transition-transform">
        </a>
        
      </div>

      
    </template>

    <!-- 脚本部分 -->
    <script setup lang="ts">
    import { inject } from 'vue';
    // 导入Vue Router的useRouter函数
    import { useRouter } from 'vue-router';
    // 导入部门展示组件
    import DepartmentDisplay from '../components/DepartmentDisplay.vue';
    // 导入负责人展示组件
    import LeaderDisplay from '../components/LeaderDisplay.vue';


    // 获取路由实例
    const router = useRouter();
    // 注入triggerAnimation函数，用于触发页面切换动画
    const triggerAnimation = inject('triggerAnimation') as (callback: () => void) => void;
    // 注入triggerExpand函数，用于触发某些展开效果（例如侧边栏）
    const triggerExpand = inject('triggerExpand') as () => void;

    /**
     * @description 导航到问卷页面
     * 如果存在动画触发器，则先执行动画再跳转；否则直接跳转。
     */
    const goToSurvey = () => {
      if (triggerAnimation) {
        triggerAnimation(() => {
          router.push('/survey');
          triggerExpand();
        });
      } else {
        router.push('/survey');
      }
    };

    /**
     * @description 导航到Joker动漫社介绍页面
     * 如果存在动画触发器，则先执行动画再跳转；否则直接跳转。
     */
    const goToJokerClub = () => {
      if (triggerAnimation) {
        triggerAnimation(() => {
          router.push('/Good-Night-Joker-ACG-Club');
          triggerExpand();
        });
      } else {
        router.push('/Good-Night-Joker-ACG-Club');
      }
    };
    </script>

    <!-- 样式部分 -->
    <style scoped>
    /* Joker动漫社链接的样式 */
    .joker-club-link {
      color: #007bff; /* 蓝色 */
      text-decoration: underline; /* 下划线 */
      cursor: pointer; /* 鼠标指针样式 */
      font-size: 0.9em; /* 字体大小 */
      transition: color 0.3s ease; /* 颜色过渡效果 */
    }

    /* 鼠标悬停时的链接颜色 */
    .joker-club-link:hover {
      color: #0056b3; /* 深蓝色 */
    }

    /* 媒体查询：当屏幕宽度小于等于640px时 */
    @media (max-width: 640px) {
      /* 链接字体大小调整 */
      .joker-club-link {
        font-size: 0.75em; /* 更小的字体大小 */
      }
      /* 顶部flex布局调整 */
      .flex.justify-between.items-center.w-full.px-4 {
        flex-wrap: wrap; /* 允许换行 */
        justify-content: center; /* 居中对齐 */
        gap: 10px; /* 元素间距 */
      }
    }

    /* 文本首行缩进2em，左对齐 */
    .text-indent-2em {
      text-indent: 2em;
      text-align: left;
    }
    </style>