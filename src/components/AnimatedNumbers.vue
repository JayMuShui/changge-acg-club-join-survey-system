<template>
  <!-- 根容器，用于包裹所有数字，采用 flex 布局使其水平排列，并居中对齐 -->
  <div class="animated-numbers inline-flex items-center font-host-grotesk">
    <!-- 遍历 digits 数组，为每个数字创建一个独立的显示区域 -->
    <div v-for="(digit, index) in digits" :key="index" class="digit mx-1">
      <!-- 显示当前动画帧的数字，currentDigits 会在动画过程中更新 -->
      {{ currentDigits[index] }}
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入 Vue 的 ref 函数用于创建响应式数据，onMounted 生命周期钩子用于在组件挂载后执行操作
import { ref, onMounted } from 'vue';

/**
 * @file AnimatedNumbers.vue
 * @description 这是一个 Vue 组件，用于显示带有动画效果的数字。
 *              数字会从随机跳动过渡到最终目标数字。
 */

// 定义组件接收的 props，这里只接收一个名为 'numbers' 的数字类型 prop
const props = defineProps<{
  numbers: number; // 要显示的目标数字
}>();

// 将传入的 numbers prop 转换为字符串数组，每个元素代表一个数字位，例如 123 -> ['1', '2', '3']
const digits = ref<string[]>(props.numbers.toString().split(''));
// 创建一个与 digits 长度相同的响应式数组，初始全部填充 '0'，用于显示动画过程中的数字
const currentDigits = ref<string[]>(Array(digits.value.length).fill('0'));
// 定义动画速度，每帧之间的时间间隔（毫秒）
const animationSpeed = 50; // ms per frame

// 组件挂载后执行的生命周期钩子
onMounted(() => {
  // 遍历 digits 数组，对每个数字位启动动画
  digits.value.forEach((target, index) => {
    // 调用 animateDigit 函数，传入当前数字位的索引和其目标数字（转换为整数）
    animateDigit(index, parseInt(target));
  });
});

/**
 * @function animateDigit
 * @description 为指定索引的数字位执行动画效果。
 *              动画分为两个阶段：首先随机显示 0-9 的数字，然后从 0 顺序过渡到目标数字。
 * @param {number} index - 当前数字位在 digits 数组中的索引。
 * @param {number} target - 当前数字位的最终目标数字（0-9）。
 */
function animateDigit(index: number, target: number) {
  // 阶段 1: 随机打乱 0-9 的数字数组，用于动画的随机跳动部分
  const shuffled = shuffleArray([...Array(10).keys()]); // 生成 0-9 的数组并打乱
  let frame = 0; // 动画帧计数器

  // 使用 setInterval 创建一个定时器，每隔 animationSpeed 毫秒执行一次
  const interval = setInterval(() => {
    if (frame < 10) {
      // 在前 10 帧中，显示随机打乱的数字
      currentDigits.value[index] = shuffled[frame].toString();
      frame++;
    } else if (frame < 10 + target + 1) {
      // 随机跳动结束后，从 0 开始顺序显示到目标数字
      // frame - 10 用于计算当前顺序显示的数字（0, 1, ..., target）
      currentDigits.value[index] = (frame - 10).toString();
      frame++;
    } else {
      // 动画完成后，清除定时器
      clearInterval(interval);
    }
  }, animationSpeed);
}

/**
 * @function shuffleArray
 * @description 使用 Fisher-Yates (Knuth) 洗牌算法打乱数组的顺序。
 * @param {number[]} array - 要打乱的数字数组。
 * @returns {number[]} 返回打乱后的新数组。
 */
function shuffleArray(array: number[]) {
  // 从数组的最后一个元素开始向前遍历
  for (let i = array.length - 1; i > 0; i--) {
    // 生成一个随机索引 j，范围从 0 到 i（包括 i）
    const j = Math.floor(Math.random() * (i + 1));
    // 交换当前元素 array[i] 和随机选中的元素 array[j]
    [array[i], array[j]] = [array[j], array[i]];
  }
  // 返回打乱后的数组
  return array;
}
</script>

<style scoped>
/* 样式作用域限定在当前组件 */

/* 定义字体样式，使用 'Host Grotesk' 字体，如果不可用则使用 sans-serif，设置字号和字重 */
.font-host-grotesk {
  font-family: 'Host Grotesk', sans-serif;
  font-size: 1.5em; /* 相对父元素字号的 1.5 倍 */
  font-weight: bold; /* 字体加粗 */
}

/* 定义单个数字位的样式 */
.digit {
  width: 1em; /* 宽度为当前字号的 1 倍 */
  text-align: center; /* 文本居中对齐 */
  background: #f0f0f0; /* 背景颜色 */
  padding: 0.2em 0.4em; /* 内边距，上下 0.2em，左右 0.4em */
  border-radius: 4px; /* 圆角边框 */
}
</style>
