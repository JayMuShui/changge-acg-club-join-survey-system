<template>
  <!-- 滚动姓名容器，相对定位，隐藏溢出内容，高度由 containerHeight 动态设置 -->
  <div class="scrolling-names-container relative overflow-hidden" :style="{ height: containerHeight }">
    <!-- 内容包裹器，用于实现平滑过渡效果 -->
    <div class="content-wrapper relative w-full h-full">
      <!-- 容器1：用于显示滚动内容 -->
      <div 
        class="scroll-content absolute inset-0"
        :class="{ 'active': activeContainer === 1, 'fade-out': fadeOutContainer === 1 }"
      >
        <!-- 遍历 displayRows1 中的每一行数据 -->
        <div 
          v-for="(row, rowIndex) in displayRows1" 
          :key="'container1-row-' + rowIndex" 
          class="names-row"
          :style="{
            animationDuration: `${1 / speed * 20}s`, /* 动画持续时间，根据 speed 属性计算 */
            animationDelay: `${row.randomDelay}s`, /* 动画延迟，每行随机延迟 */
            flexDirection: direction === 'right' ? 'row' : 'row-reverse' /* 根据 direction 属性设置滚动方向 */
          }"
        >
          <!-- 原始数据项的渲染 -->
          <div 
            v-for="(person, index) in row.data" 
            :key="'container1-row-' + rowIndex + '-' + index"
            class="name-item whitespace-nowrap"
          >
            {{ person.name }}<template v-if="person.who">-{{ person.who }}</template><template v-if="person.qq">(QQ:{{ person.qq }})</template>
          </div>
          <!-- 克隆一份数据项，用于实现无缝滚动效果 -->
          <div 
            v-for="(person, index) in row.data" 
            :key="'container1-row-clone-' + rowIndex + '-' + index"
            class="name-item clone whitespace-nowrap"
          >
            {{ person.name }}<template v-if="person.who">-{{ person.who }}</template><template v-if="person.qq">(QQ:{{ person.qq }})</template>
          </div>
        </div>
      </div>

      <!-- 容器2：用于显示滚动内容，与容器1交替显示以实现平滑过渡 -->
      <div 
        class="scroll-content absolute inset-0"
        :class="{ 'active': activeContainer === 2, 'fade-out': fadeOutContainer === 2 }"
      >
        <!-- 遍历 displayRows2 中的每一行数据 -->
        <div 
          v-for="(row, rowIndex) in displayRows2" 
          :key="'container2-row-' + rowIndex" 
          class="names-row"
          :style="{
            animationDuration: `${1 / speed * 20}s`, /* 动画持续时间，根据 speed 属性计算 */
            animationDelay: `${row.randomDelay}s`, /* 动画延迟，每行随机延迟 */
            flexDirection: direction === 'right' ? 'row' : 'row-reverse' /* 根据 direction 属性设置滚动方向 */
          }"
        >
          <!-- 原始数据项的渲染 -->
          <div 
            v-for="(person, index) in row.data" 
            :key="'container2-row-' + rowIndex + '-' + index"
            class="name-item whitespace-nowrap"
          >
            {{ person.name }}<template v-if="person.who">-{{ person.who }}</template><template v-if="person.qq">(QQ:{{ person.qq }})</template>
          </div>
          <!-- 克隆一份数据项，用于实现无缝滚动效果 -->
          <div 
            v-for="(person, index) in row.data" 
            :key="'container2-row-clone-' + rowIndex + '-' + index"
            class="name-item clone whitespace-nowrap"
          >
            {{ person.name }}<template v-if="person.who">-{{ person.who }}</template><template v-if="person.qq">(QQ:{{ person.qq }})</template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file ScrollingNames.vue
 * @description 这是一个 Vue 组件，用于实现一个带有平滑过渡效果的滚动姓名展示功能。
 *              它能够从指定的数据源加载人员信息，并以多行、可配置的速度和方向进行滚动显示。
 */

// 导入 Vue 相关的响应式、生命周期钩子和工具函数
import { ref, onMounted, watch, nextTick, defineProps } from 'vue';

// 定义组件属性 (props)
const props = defineProps({
  /**
   * @property {number} speed - 滚动速度。
   * @description 值为 1 表示正常速度，值越大滚动越快。范围 0-5。
   */
  speed: { type: Number, default: 1, validator: (v: number) => v > 0 && v <= 5 },
  /**
   * @property {string} direction - 滚动方向。
   * @description 可选值：'left'（向左滚动）或 'right'（向右滚动）。
   */
  direction: { type: String, default: 'right', validator: (v: string) => ['left', 'right'].includes(v) },
  /**
   * @property {string} height - 滚动容器的高度。
   * @description 默认为 '140px'。
   */
  height: { type: String, default: '140px' },
  /**
   * @property {number} rows - 显示的行数。
   * @description 范围 1-5。
   */
  rows: { type: Number, default: 1, validator: (v: number) => v > 0 && v <= 5 },
  /**
   * @property {number} itemsPerRow - 每行显示的项目数量。
   * @description 范围 1-20。
   */
  itemsPerRow: { type: Number, default: 5, validator: (v: number) => v > 0 && v <= 20 },
  /**
   * @property {number} refreshInterval - 数据刷新间隔（毫秒）。
   * @description 默认为 10000 毫秒（10秒），最小值为 5000 毫秒。
   */
  refreshInterval: { type: Number, default: 10000, validator: (v: number) => v >= 5000 },
  /**
   * @property {string} dataUrl - 获取人员数据的 URL。
   * @description 必填项，数据格式应为 JSON 数组，每个元素包含 name, who, qq 等字段。
   */
  dataUrl: { type: String, required: true }
});

// 响应式变量：存储从 dataUrl 加载的所有人员数据
const persons = ref<any[]>([]);
// 响应式变量：用于容器1显示的数据行
const displayRows1 = ref<any[]>([]);
// 响应式变量：用于容器2显示的数据行
const displayRows2 = ref<any[]>([]);
// 响应式变量：当前激活的容器（1或2），用于控制显示哪个容器
const activeContainer = ref(1);
// 响应式变量：需要淡出（隐藏）的容器，用于平滑过渡效果
const fadeOutContainer = ref(0);
// 响应式变量：滚动容器的实际高度，绑定到 props.height
const containerHeight = ref(props.height);

/**
 * @function loadPersons
 * @description 异步加载人员数据并初始化显示行。
 */
const loadPersons = async () => {
  try {
    // 从 dataUrl 发起请求获取数据
    const response = await fetch(props.dataUrl);
    // 解析 JSON 响应
    const data = await response.json();
    // 更新 persons 响应式变量
    persons.value = data;
    // 为两个容器生成初始显示行数据
    generateDisplayRows(displayRows1);
    generateDisplayRows(displayRows2);
  } catch (error) {
    // 捕获并打印数据加载或解析错误
    console.error('[滚动姓名组件] 无法正常识别数据格式', error);
  }
};

/**
 * @function generateDisplayRows
 * @param {any} targetArray - 目标响应式数组（displayRows1 或 displayRows2）。
 * @description 根据 persons 数据和 props 配置生成用于显示的行数据。
 */
const generateDisplayRows = (targetArray: any) => {
  // 如果 persons 数组为空，则不生成数据
  if (persons.value.length === 0) return;
  // 清空目标数组
  targetArray.value = [];
  // 根据 props.rows 生成指定行数
  for (let r = 0; r < props.rows; r++) {
    const row: any[] = [];
    // 根据 props.itemsPerRow 生成每行的项目数量
    for (let i = 0; i < props.itemsPerRow; i++) {
      // 随机选择一个人员数据
      const randomIndex = Math.floor(Math.random() * persons.value.length);
      // 将选中的人员数据添加到当前行
      row.push({ ...persons.value[randomIndex] });
    }
    // 将生成的行数据和随机延迟添加到目标数组
    targetArray.value.push({
      data: row,
      randomDelay: -(Math.random() * 10).toFixed(2) // 为每行生成一个随机的负延迟，实现错位滚动效果
    });
  }
};

/**
 * @function smoothRefreshData
 * @description 实现两个容器之间的平滑切换，用于数据刷新。
 */
const smoothRefreshData = () => {
  // 获取当前激活的容器
  const currentContainer = activeContainer.value;
  // 确定下一个要激活的容器
  const nextContainer = currentContainer === 1 ? 2 : 1;
  // 为下一个容器生成新的显示行数据
  generateDisplayRows(nextContainer === 1 ? displayRows1 : displayRows2);
  // 在 DOM 更新后执行
  nextTick(() => {
    // 设置当前容器为淡出状态
    fadeOutContainer.value = currentContainer;
    // 延迟 500 毫秒后切换激活容器并清除淡出状态，实现过渡效果
    setTimeout(() => {
      activeContainer.value = nextContainer;
      fadeOutContainer.value = 0;
    }, 500);
  });
};

// 组件挂载时执行的操作
onMounted(() => {
  // 加载人员数据
  loadPersons();
  // 设置定时器，每隔 refreshInterval 毫秒平滑刷新数据
  setInterval(smoothRefreshData, props.refreshInterval);
});

// 监听 props 变化，当相关属性改变时重新加载数据
watch([() => props.rows, () => props.itemsPerRow, () => props.speed, () => props.dataUrl], () => {
  loadPersons();
}, { immediate: true }); // immediate: true 表示组件初始化时立即执行一次 watch 回调
</script>

<style scoped>
/* 样式作用域限定在当前组件 */

/* 滚动姓名容器样式 */
.scrolling-names-container {
  width: 100%; /* 宽度占满父容器 */
  position: relative; /* 相对定位 */
  margin: 1rem 0; /* 上下外边距 */
  border-radius: 8px; /* 圆角边框 */
  background: rgba(255, 255, 255, 0.05); /* 半透明背景 */
}

/* 内容包裹器样式 */
.content-wrapper {
  overflow: hidden; /* 隐藏溢出内容 */
  position: relative; /* 相对定位 */
}

/* 滚动内容容器样式 */
.scroll-content {
  display: flex; /* 弹性布局 */
  flex-direction: column; /* 垂直排列 */
  gap: 10px; /* 行间距 */
  width: 100%; /* 宽度占满 */
  height: 100%; /* 高度占满 */
  opacity: 0; /* 初始透明度为 0 */
  transition: opacity 0.5s ease-in-out; /* 透明度过渡效果 */
  pointer-events: auto; /* 允许鼠标事件 */
  z-index: 20; /* 层级 */
}

/* 激活状态的滚动内容容器 */
.scroll-content.active {
  opacity: 1; /* 激活时透明度为 1 */
}

/* 淡出状态的滚动内容容器 */
.scroll-content.fade-out {
  opacity: 0; /* 淡出时透明度为 0 */
}

/* 姓名行样式 */
.names-row {
  display: flex; /* 弹性布局 */
  width: max-content; /* 宽度适应内容 */
  animation: scroll linear infinite; /* 滚动动画 */
}

/* 定义滚动动画 */
@keyframes scroll {
  0% { transform: translateX(0); } /* 动画开始时在原位 */
  100% { transform: translateX(-50%); } /* 动画结束时向左移动自身宽度的一半，实现无缝循环 */
}

/* 姓名项样式 */
.name-item {
  padding: 0.5rem 1rem; /* 内边距 */
  min-width: 60px; /* 最小宽度 */
  border-radius: 4px; /* 圆角 */
  color: inherit; /* 继承父元素颜色 */
  font-family: 'Noto Sans', sans-serif; /* 字体 */
}

/* 克隆的姓名项样式 */
.name-item.clone {
  pointer-events: none; /* 克隆不阻挡滚动点击 */
}
</style>
