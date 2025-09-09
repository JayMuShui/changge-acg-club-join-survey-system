<template>
  <!-- 应用程序背景容器，id 为 app-background，动态绑定背景图片和透明度 -->
  <div 
    id="app-background" 
    :style="{ backgroundImage: `url(${currentImage})`, opacity: opacity }"
  >
    <!-- 插槽，用于插入其他内容，确保背景在最底层 -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
/**
 * @file SetBackground.vue
 * @description 这是一个 Vue 组件，用于动态设置应用程序的背景图片。
 *              它根据路由元信息和设备类型选择背景图片，并处理图片的加载和显示。
 */

// 导入 Vue 相关的响应式和生命周期钩子函数
import { ref, onMounted, onUnmounted, watch } from 'vue';
// 导入 Vue Router 的 useRoute 钩子，用于获取当前路由信息
import { useRoute } from 'vue-router';   
// 导入自定义组合式函数 useRandomImage，用于获取随机图片
import { useRandomImage } from '../composables/useRandomImage.ts';

// 定义响应式变量 currentImage，用于存储当前显示的背景图片 URL
const currentImage = ref('');
// 获取当前路由实例
const route = useRoute();
// 从 useRandomImage 组合式函数中解构出 randomImage，用于获取随机背景图片
const { currentImage: randomImage } = useRandomImage();

/**
 * @description 更新背景图片。
 *              根据路由元信息判断是否使用特殊背景，并根据设备类型选择合适的图片。
 *              如果不是特殊背景，则使用随机图片。
 */
const updateBackgroundImage = () => {
  // 从路由元信息中解构出 isSpecialBackground、pcBackground 和 mobileBackground
  const { isSpecialBackground, pcBackground, mobileBackground } = route.meta;
  // 如果是特殊背景
  if (isSpecialBackground) {
    // 判断是否为移动设备（屏幕宽度小于等于 768 像素）
    const isMobile = window.innerWidth <= 768;
    // 根据设备类型设置背景图片 URL
    currentImage.value = isMobile ? `/${mobileBackground}` : `/${pcBackground}`;
  } else {
    // 如果不是特殊背景，则使用随机图片
    currentImage.value = randomImage.value;
  }
};

// 定义响应式变量 opacity，用于控制背景的透明度，默认为 1（完全不透明）
const opacity = ref(1);

// 组件挂载后执行的生命周期钩子
onMounted(() => {
  // 初始加载背景图片
  updateBackgroundImage(); 
  // 添加窗口大小变化事件监听器，以便在窗口大小改变时更新背景图片
  window.addEventListener('resize', updateBackgroundImage);
});

// 组件卸载前执行的生命周期钩子
onUnmounted(() => {
  // 移除窗口大小变化事件监听器，防止内存泄漏
  window.removeEventListener('resize', updateBackgroundImage);
});

// 监听路由路径的变化，当路由路径改变时更新背景图片
watch(() => route.path, () => {
  updateBackgroundImage();
});

</script>

<style>
/* 全局样式，作用于 id 为 app-background 的元素 */
#app-background {
  /* 字体抗锯齿优化 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* 字体颜色 */
  color: #000000;
  /* 最小高度为视口高度的 100% */
  min-height: 100vh;
  /* 背景图片固定，不随滚动条滚动 */
  background-attachment: fixed;
  /* 移除外边距和内边距 */
  margin: 0;
  padding: 0;
  /* 背景图片铺满整个容器 */
  background-size: cover; 
  /* 背景图片居中显示 */
  background-position: center; 
  /* 背景图片不重复 */
  background-repeat: no-repeat; 
  /* 背景图片加载失败时的底色 */
  background-color: #f0f2f5; 

  /* opacity: 1; */
}
</style>