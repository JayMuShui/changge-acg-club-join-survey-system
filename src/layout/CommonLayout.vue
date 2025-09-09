<template>
  <!-- 页面主容器：居中显示内容，并设置最小高度和内边距 -->
  <div class="flex items-center justify-center min-h-screen p-4 md:py-8 md:px-4">
    <!-- 卡片容器：承载主要内容，并应用样式实现毛玻璃效果和阴影 -->
    <div 
      ref="cardRef"
      class="w-full max-w-4xl max-h-screen bg-white/15 backdrop-blur-xl 
             rounded-xl shadow-2xl shadow-black/15 border border-white/20 
             overflow-auto p-4 sm:p-6 md:p-8 pb-10 transition-all duration-300
             hover:bg-white/20 hover:shadow-3xl hover:shadow-black/20 relative" 
    >  
      <!-- 信息提示条 (Info Bar) -->
      <transition name="info-fade"> <!-- 动画过渡组件 -->
        <!-- 当 infoBar.isVisible 为 true 时显示信息提示条 -->
        <div v-if="infoBar.isVisible" class="absolute top-4 left-4 right-4 text-white text-center py-2 px-4 z-50 shadow-md flex items-center justify-center rounded-full info-bar" :class="{show: infoBar.isVisible}"> <!-- 样式类，定义了位置、文本颜色、内边距、层级、阴影、布局、圆角和自定义样式 -->
          <span class="flex-grow text-center">{{ infoBar.message }}</span> <!-- 显示信息内容 -->
          <!-- 可关闭按钮，当 infoBar.isDismissible 为 true 时显示 -->
          <button v-if="infoBar.isDismissible" @click="dismissInfo" class="ml-4 px-2 py-1 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"> <!-- 样式类，定义了外边距、内边距、圆角、悬停和焦点样式 -->
            &times; <!-- 关闭图标 -->
          </button>
        </div>
      </transition>
      <slot></slot> <!-- 匿名插槽，用于插入父组件传递的内容 -->
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入 Vue 相关的函数：ref 用于创建响应式引用，onMounted 用于在组件挂载后执行，provide 用于提供数据给子组件
import { ref, onMounted, provide } from 'vue';

// 创建一个 ref 来引用卡片容器的 DOM 元素
const cardRef = ref<HTMLElement | null>(null);

// 信息提示条的状态管理
const infoBar = ref({
  isVisible: false, // 控制信息提示条的显示/隐藏
  message: '', // 信息提示条显示的消息内容
  isDismissible: true, // 信息提示条是否可关闭
  timeoutId: null as ReturnType<typeof setTimeout> | null, // 用于存储 setTimeout 的 ID，以便清除定时器
});

// 滚动到卡片容器顶部的方法
const scrollToTop = () => {
  if (cardRef.value) {
    cardRef.value.scrollTo({ top: 0, behavior: 'smooth' }); // 平滑滚动到顶部
  }
};

// 显示信息提示条的方法
const displayInfo = (message: string, duration: number = 3000, isDismissible: boolean = true) => {
  // 如果存在之前的定时器，则清除它
  if (infoBar.value.timeoutId) {
    clearTimeout(infoBar.value.timeoutId);
  }

  // 滑回顶部，确保提示栏可见
  scrollToTop();

  infoBar.value.message = message; // 设置消息内容
  infoBar.value.isDismissible = isDismissible; // 设置是否可关闭
  infoBar.value.isVisible = true; // 显示信息提示条

  // 如果设置了持续时间，则在指定时间后自动隐藏信息提示条
  if (duration > 0) {
    infoBar.value.timeoutId = setTimeout(() => {
      infoBar.value.isVisible = false;
    }, duration);
  }
};

// 关闭信息提示条的方法
const dismissInfo = () => {
  infoBar.value.isVisible = false; // 隐藏信息提示条
  // 如果存在定时器，则清除它
  if (infoBar.value.timeoutId) {
    clearTimeout(infoBar.value.timeoutId);
  }
};

// 动画锁，防止快速触发导致状态冲突
const isAnimating = ref(false);

// 播放动画的辅助函数
const playAnimation = (el: HTMLElement, className: string) => {
  return new Promise<void>((resolve) => {
    const handleEnd = () => {
      el.classList.remove(className); // 移除动画类
      el.removeEventListener('animationend', handleEnd); // 移除事件监听器
      resolve(); // 动画结束时解决 Promise
    };
    el.addEventListener('animationend', handleEnd, { once: true }); // 监听动画结束事件
    el.classList.add(className); // 添加动画类
  });
};

// 触发卡片动画的方法（收缩和展开）
const triggerAnimation = async (onShrinkComplete?: () => void) => {
  if (isAnimating.value) return; // 如果动画正在进行，则不触发
  isAnimating.value = true; // 锁定动画

  dismissInfo(); // 关闭信息提示条
  if (cardRef.value) {
    await playAnimation(cardRef.value, 'shrink'); // 播放收缩动画
    onShrinkComplete?.(); // 执行收缩完成后的回调函数
    await playAnimation(cardRef.value, 'expand'); // 播放展开动画
  }

  isAnimating.value = false; // 动画结束解锁
};

// 手动触发展开动画的方法
const triggerExpand = () => {
  if (cardRef.value) {
    cardRef.value.classList.add('expand'); // 添加展开动画类
    cardRef.value.addEventListener('animationend', () => {
      cardRef.value?.classList.remove('expand'); // 动画结束后移除动画类
    }, { once: true });
  }
};

// 使用 provide 将这些函数提供给后代组件使用
provide('triggerAnimation', triggerAnimation);
provide('triggerExpand', triggerExpand);
provide('scrollToTop', scrollToTop);
provide('displayInfo', displayInfo);
</script>

<style scoped>
/* 样式作用域限定在当前组件 */

/* 信息提示条样式 */
.info-bar {
  position: absolute; /* 绝对定位 */
  top: 10px; /* 距离顶部 10px */
  left: 50%; /* 距离左侧 50% */
  transform: translateX(-50%); /* 水平居中 */
  width: fit-content; /* 宽度自适应内容 */
  max-width: calc(100% - 20px); /* 最大宽度为父容器宽度减去 20px */

  /* 媒体查询：当屏幕宽度小于等于 640px 时应用以下样式（移动端适配） */
  @media (max-width: 640px) {
    top: 5px; /* 距离顶部 5px */
    width: 90%; /* 宽度为 90% */
    max-width: none; /* 取消最大宽度限制 */
    padding: 6px 10px; /* 内边距 */
    font-size: 0.9em; /* 字体大小 */
  }
  display: flex; /* 弹性布局 */
  align-items: center; /* 垂直居中对齐 */
  justify-content: space-between; /* 水平方向项目之间留有空白 */
  padding: 8px 15px; /* 内边距 */
  background: linear-gradient(to right, #ffb6c1, #dda0dd); /* 背景渐变色 */
  border-radius: 20px; /* 圆角 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  backdrop-filter: blur(10px); /* 背景模糊效果 */
  -webkit-backdrop-filter: blur(10px); /* 兼容 Safari 的背景模糊效果 */
  z-index: 1000; /* 层级 */
  overflow: hidden; /* 隐藏溢出内容 */
  transition: all 0.3s ease-in-out; /* 所有属性过渡效果 */
  opacity: 0; /* 初始透明度为 0 */
}

/* 信息提示条显示时的样式 */
.info-bar.show {
  transform: translateX(-50%); /* 水平居中 */
  opacity: 1; /* 透明度为 1，完全显示 */
}

/* 信息提示条进入和离开的过渡动画 */
.info-fade-enter-active, .info-fade-leave-active {
  transition: all 0.3s ease-in-out; /* 所有属性过渡效果 */
}

/* 信息提示条进入前和离开后的状态 */
.info-fade-enter-from, .info-fade-leave-to {
  transform: translateX(-50%); /* 水平居中 */
  opacity: 0; /* 透明度为 0 */
}

/* 信息提示条进入后和离开前的状态 */
.info-fade-enter-to, .info-fade-leave-from {
  transform: translateX(-50%); /* 水平居中 */
  opacity: 1; /* 透明度为 1 */
}

/* 自定义滚动条样式 */
/* Webkit 浏览器（如 Chrome, Safari）的滚动条整体样式 */
::-webkit-scrollbar {
  width: 6px; /* 滚动条宽度 */
  height: 6px; /* 滚动条高度 */
}

/* Webkit 浏览器滚动条轨道样式 */
::-webkit-scrollbar-track {
  background: transparent; /* 轨道背景透明 */
  border-radius: 3px; /* 轨道圆角 */
}

/* Webkit 浏览器滚动条滑块样式 */
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3); /* 滑块背景色 */
  border-radius: 3px; /* 滑块圆角 */
  transition: background 0.2s; /* 背景色过渡效果 */
}

/* Webkit 浏览器滚动条滑块悬停时的样式 */
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5); /* 悬停时滑块背景色变深 */
}

/* Firefox 浏览器滚动条样式 */
* {
  scrollbar-width: thin; /* 滚动条宽度为细 */
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent; /* 滑块颜色和轨道颜色 */
}

/* 定义名为 'shrink' 的关键帧动画，用于实现上下压缩效果 */
@keyframes shrink {
  0% { transform: scaleY(1); }
  100% { transform: scaleY(0); }
}

@keyframes expand {
  0% { transform: scaleY(0); }
  100% { transform: scaleY(1); }
}

.shrink {
  animation: shrink 0.5s ease-in-out forwards;
}

.expand {
  animation: expand 0.5s ease-in-out forwards;
}
</style>
