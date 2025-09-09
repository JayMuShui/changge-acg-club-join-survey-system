<template>
  <SetBackground>
    <CommonLayout>
      <router-view />
    </CommonLayout>
  </SetBackground>
</template>

<script setup lang="ts">
// 导入 CommonLayout 组件，用于页面通用布局，包含一个控制所有DOM元素的毛玻璃容器和携带核心通知显示组件DisplayInfo
import CommonLayout from './layout/CommonLayout.vue';
// 导入 SetBackground 组件，用于设置应用背景
import SetBackground from './components/SetBackground.vue';
</script>

<style>
/* 全局样式 */
#app {
  /* 字体抗锯齿，使文本显示更平滑 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* 设置应用的主题颜色为黑色 */
  color: #000000;
  /* 确保应用占据整个视口高度 */
  min-height: 100vh;
  /* 移除默认的 margin 和 padding，使布局从边缘开始 */
  margin: 0;
  padding: 0;
}
</style>