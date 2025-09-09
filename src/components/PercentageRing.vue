<template>
  <!-- 百分比环形容器，根据 size 属性设置宽度和高度 -->
  <div class="percentage-ring-container" :style="{ width: size + 'px', height: size + 'px' }">
    <!-- SVG 元素，用于绘制环形进度条 -->
    <svg class="ring-svg" :width="size" :height="size" viewBox="0 0 100 100">
      <!-- 背景圆环，表示总进度 -->
      <circle
        class="ring-background"
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke-width="8"
      />
      
      <!-- 进度圆环，表示当前进度，通过 stroke-dasharray 和 stroke-dashoffset 控制显示比例 -->
      <circle
        class="ring-progress"
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke-width="8"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashoffset"
        transform="rotate(-90 50 50)" 
      />
      <!-- 旋转 -90 度，使进度条从顶部开始 -->
    </svg>
    
    <!-- 中心显示的百分比数字，保留 0 位小数 -->
    <div class="percentage-text">{{ animatedPercentage.toFixed(0) }}</div>
  </div>
</template>

<script setup>
/**
 * @file PercentageRing.vue
 * @description 这是一个 Vue 组件，用于显示一个带有动画效果的百分比环形进度条。
 *              它根据传入的百分比动态更新进度，并根据百分比值改变颜色。
 */

// 导入 Vue 相关的响应式和计算属性函数
import { computed, defineProps, ref, watch } from 'vue';
// 导入 GSAP 动画库，用于实现平滑的数字和进度条动画
import gsap from 'gsap';

// 定义组件属性 (props)
const props = defineProps({
  /**
   * @property {number} percentage - 当前的百分比值，范围 0-100。
   * @description 必填项，且必须在 0 到 100 之间。
   */
  percentage: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100,
  },
  /**
   * @property {number} size - 环形进度条的尺寸（宽度和高度），单位 px。
   * @description 默认为 200。
   */
  size: {
    type: Number,
    default: 200,
  },
  /**
   * @property {string} bgColor - 背景圆环的颜色。
   * @description 默认为 #e0e0e0。
   */
  bgColor: {
    type: String,
    default: '#e0e0e0',
  },
  /**
   * @property {string} progressColor - 进度圆环的颜色。
   * @description 默认为 #42b983。
   */
  progressColor: {
    type: String,
    default: '#42b983',
  },
  /**
   * @property {string} textColor - 中心百分比文本的颜色。
   * @description 默认为 #333。
   */
  textColor: {
    type: String,
    default: '#333',
  },
});

// 定义响应式变量 animatedPercentage，用于存储动画过程中的百分比值，初始为 0
const animatedPercentage = ref(0);
// 定义响应式变量 animatedDashoffset，用于存储动画过程中的 stroke-dashoffset 值，初始为 0
const animatedDashoffset = ref(0);

// 计算属性：圆环的周长。r 为 45，所以直径为 90，周长为 2 * PI * r
const circumference = computed(() => 2 * Math.PI * 45);

// 监听 props.percentage 的变化，并执行动画
watch(() => props.percentage, (newPercentage) => {
  // 使用 GSAP 动画库，将 animatedPercentage 从当前值动画到新的百分比值，持续 1 秒
  gsap.to(animatedPercentage, { duration: 1, value: newPercentage });
  // 使用 GSAP 动画库，将 animatedDashoffset 从当前值动画到新的 dashoffset 值，持续 1 秒
  // dashoffset 的计算方式是：周长 * (百分比 / 100)
  gsap.to(animatedDashoffset, {
    duration: 1,
    value: circumference.value * (newPercentage / 100),
  });
}, { immediate: true }); // immediate: true 表示组件初始化时立即执行一次 watch 回调

  // 计算属性：根据 animatedPercentage 的值动态返回进度条和文本的颜色
  const computedProgressColor = computed(() => {
    if (animatedPercentage.value === 0) return '#cccccc'; // 百分比为 0 时显示灰色
    if (animatedPercentage.value < 60) return '#ff0000'; // 百分比小于 60 时显示红色
    if (animatedPercentage.value >= 60 && animatedPercentage.value < 100) return '#42b983'; // 百分比在 60 到 99 之间时显示绿色
    if (animatedPercentage.value === 100) return '#ff69b4'; // 百分比为 100 时显示粉色
    return '#cccccc'; // 默认情况下显示灰色
  });

// 计算属性：SVG 进度条的 stroke-dashoffset 值
// 这个值控制了圆环中未填充的部分，周长减去已填充的部分 (animatedDashoffset.value)
const dashoffset = computed(() => circumference.value - animatedDashoffset.value);
</script>

<style scoped>
/* 样式作用域限定在当前组件 */

/* 环形容器样式 */
.percentage-ring-container {
  position: relative; /* 相对定位，用于子元素的绝对定位 */
  display: inline-flex; /* 内联弹性布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

/* SVG 环形样式 */
.ring-svg {
  transform: rotate(0deg); /* 初始不旋转 */
}

/* 背景圆环样式，颜色绑定到 props.bgColor */
.ring-background {
  stroke: v-bind(bgColor); /* 使用 v-bind 绑定 props 中的 bgColor */
}

/* 进度圆环样式，颜色绑定到 computedProgressColor */
.ring-progress {
  stroke: v-bind(computedProgressColor); /* 使用 v-bind 绑定计算属性 computedProgressColor */
}

/* 百分比文本样式 */
.percentage-text {
  position: absolute; /* 绝对定位，使其位于圆环中心 */
  font-size: 24px; /* 字体大小 */
  font-weight: bold; /* 字体加粗 */
  color: v-bind(computedProgressColor); /* 文本颜色绑定到 computedProgressColor */
  font-family: 'Noto Sans', sans-serif; /* 字体样式 */
}
</style>
