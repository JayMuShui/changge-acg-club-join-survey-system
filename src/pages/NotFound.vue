<!-- 404页面模板 -->
<template>
    <!-- 页面容器，居中显示 -->
    <div class="container mx-auto p-4 text-center">
    <!-- 404标题，大号黄色字体 -->
    <h1 class="text-8xl font-bold text-yellow-500">404</h1>
    <h2>页面未找到</h2>
    <p>估计是你访问了一个不存在的子网页吧？</p>
    <p class="text-lg text-red-500" >正在为你重定向~ ({{ countdown }}s)</p>
  </div>
  <Copyright />
</template>


<script setup lang="ts">
import { ref, onMounted , inject } from 'vue'
import { useRouter } from 'vue-router'
import Copyright from '../components/Copyright.vue'
const triggerAnimation = inject('triggerAnimation') as (callback: () => void) => void;
const triggerExpand = inject('triggerExpand') as () => void;

// 倒计时变量，初始5秒
const countdown = ref(5)
// 获取路由实例
const router = useRouter()

// 组件挂载后执行
onMounted(() => {
  // 设置1秒间隔的定时器
  const timer = setInterval(() => {
    // 每次减少倒计时
    countdown.value--
    // 当倒计时结束时
    if (countdown.value <= 0) {
      // 清除定时器
      clearInterval(timer)
      // 触发动画效果后跳转到调查问卷页面
      triggerAnimation(() => {
        router.push('/survey')
        // 触发展开动画
        triggerExpand()
      })
    }
  }, 1000)
})
</script>
