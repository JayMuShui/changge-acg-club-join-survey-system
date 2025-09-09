<template>
  <!-- 部门展示主容器 -->
  <div class="department-display">
    <!-- 顶部提示胶囊 -->
    <div class="capsule-note">
      <p>以下部门OC均是个人创作，属于未完善且非最终的版本的艺术创作，仅为我们创造乐趣，不要太细究哦（安全声明）</p>
    </div>
    <!-- 部门网格布局容器 -->
    <div class="department-grid">
      <!-- 遍历部门数据，为每个部门创建展示项 -->
      <div v-for="department in departments" :key="department['en-name']" class="department-item" @click="openDrawer(department)">
        <!-- 部门图片，根据英文名获取图片路径 -->
        <img :src="getDepartmentImage(department['en-name'])" :alt="department['cn-name']" class="department-image" />
        <!-- 部门中文名称 -->
        <p class="department-name">{{ department['cn-name'] }}</p>
      </div>
    </div>

    <!-- 抽屉叠加层过渡动画 -->
    <transition name="drawer-fade">
      <!-- 抽屉叠加层，点击自身关闭抽屉 -->
      <div v-if="isDrawerOpen" class="drawer-overlay" @click.self="closeDrawer"></div>
    </transition>

    <!-- 抽屉内容过渡动画 -->
    <transition name="drawer-slide">
      <!-- 抽屉内容区域 -->
      <div v-if="isDrawerOpen" class="drawer-content">
        <!-- 关闭抽屉按钮 -->
        <button class="close-button" @click="closeDrawer">×</button>
        <!-- 如果有选中的部门，则显示部门详情 -->
        <div v-if="selectedDepartment">
          <!-- 抽屉中的部门图片 -->
          <img :src="getDepartmentImage(selectedDepartment['en-name'])" :alt="selectedDepartment['cn-name']" class="drawer-image" />
          <!-- 部门中文名称 -->
          <h2>{{ selectedDepartment['cn-name'] }}</h2>
          <!-- 部门描述 -->
          <p>{{ selectedDepartment.description }}</p>
          <!-- 部门设定标题 -->
          <h3>设定:</h3>
          <!-- 遍历部门设定 -->
          <div v-for="(setting, index) in selectedDepartment.setting" :key="index">
            <!-- 设定名称 -->
            <h4>{{ setting.name }}</h4>
            <!-- 身高信息 -->
            <p v-if="setting.high">身高: {{ setting.high }}</p>
            <!-- 体重信息 -->
            <p v-if="setting.weight">体重: {{ setting.weight }}</p>
            <!-- 爱好信息，用逗号连接 -->
            <p v-if="setting.love">爱好: {{ setting.love.join(', ') }}</p>
            <!-- 讨厌信息，用逗号连接 -->
            <p v-if="setting.hate">讨厌: {{ setting.hate.join(', ') }}</p>
            <!-- 故事信息 -->
            <div v-if="setting.story">
              <h5>故事:</h5>
              <!-- 遍历故事行 -->
              <p v-for="(storyLine, sIndex) in setting.story" :key="sIndex" >{{ storyLine }}</p>
            </div>
            <!-- 角色信息 -->
            <div v-if="setting.role">
              <h5>角色:</h5>
              <!-- 遍历角色行 -->
              <p v-for="(roleLine, rIndex) in setting.role" :key="rIndex">{{ roleLine }}</p>
            </div>
            <!-- 服装信息 -->
            <div v-if="setting.outfit">
              <h5>服装:</h5>
              <!-- 遍历服装行 -->
              <p v-for="(outfitLine, oIndex) in setting.outfit" :key="oIndex">{{ outfitLine }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
// 导入Vue核心功能：ref用于创建响应式数据，onMounted用于组件挂载后执行操作，inject用于注入祖先组件提供的数据，defineProps用于定义组件接收的属性，watch用于监听数据变化。
import { ref, onMounted, inject, defineProps, watch } from 'vue';

// 注入全局的displayInfo函数，用于显示提示信息。
const displayInfo = inject('displayInfo') as (message: string, duration?: number, isDismissible?: boolean) => void;

// 定义部门设定接口，规范部门设定的数据结构。
interface DepartmentSetting {
  name: string; // 设定名称
  high?: string; // 身高 (可选)
  weight?: string; // 体重 (可选)
  love?: string[]; // 爱好列表 (可选)
  hate?: string[]; // 讨厌列表 (可选)
  story?: string[]; // 故事描述列表 (可选)
  role?: string[]; // 角色描述列表 (可选)
  outfit?: string[]; // 服装描述列表 (可选)
}

// 定义部门接口，规范部门的数据结构。
interface Department {
  'cn-name': string; // 中文名称
  'en-name': string; // 英文名称
  description: string; // 部门描述
  setting: DepartmentSetting[]; // 部门设定列表
}

// 定义组件接收的props。
const props = defineProps({
  dataUrl: { // 数据URL，用于加载部门信息
    type: String,
    required: true // 必须提供
  }
});

// 响应式变量：存储部门列表数据。
const departments = ref<Department[]>([]);
// 响应式变量：控制抽屉（侧边栏）的打开/关闭状态。
const isDrawerOpen = ref(false);
// 响应式变量：存储当前选中的部门数据。
const selectedDepartment = ref<Department | null>(null);

// 异步函数：加载部门数据。
const loadDepartments = async () => {
  try {
    // 从props.dataUrl获取数据
    const response = await fetch(props.dataUrl);
    // 检查HTTP响应是否成功
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // 将响应的JSON数据赋值给departments。
    departments.value = await response.json();
  } catch (error) {
    // 捕获并打印加载错误
    console.error('部门数据加载失败', error);
    // 通过displayInfo显示错误提示给用户
    displayInfo('[数据加载错误]部门数据加载失败，请联系技术同学！〒▽〒');
  }
};

// 根据部门英文名获取对应的图片路径。
const getDepartmentImage = (enName: string) => {
  // 图片映射表，将英文名映射到图片路径。
  const imageMap: { [key: string]: string } = {
    'art-drawing-department': '/department-oc/art-drawing-department.webp',
    'design-editing-department': '/department-oc/design-editing-department.webp',
    'performance-department': '/department-oc/performance-department.webp',
    'public-relations-department': '/department-oc/public-relations-department.webp',
  };
  // 返回对应的图片路径，如果不存在则返回空字符串。
  return imageMap[enName] || '';
};

// 注入全局的scrollToTop函数，用于滚动页面到顶部。
const scrollToTop = inject('scrollToTop') as () => void;

// 打开部门详情抽屉的函数。
const openDrawer = (department: Department) => {
  selectedDepartment.value = department; // 设置当前选中的部门
  isDrawerOpen.value = true; // 打开抽屉
  document.body.style.overflow = 'hidden'; // 防止在抽屉打开时页面滚动
  // 如果scrollToTop函数存在，则滚动到顶部
  if (scrollToTop) {
    scrollToTop();
  }
};

// 关闭部门详情抽屉的函数。
const closeDrawer = () => {
  isDrawerOpen.value = false; // 关闭抽屉
  selectedDepartment.value = null; // 清空选中的部门
  document.body.style.overflow = ''; // 恢复页面滚动
};

// 组件挂载后执行：加载部门数据。
onMounted(() => {
  loadDepartments();
});

// 监听props.dataUrl的变化，当dataUrl改变时重新加载部门数据，immediate: true表示组件初始化时也立即执行一次。
watch(() => props.dataUrl, loadDepartments, { immediate: true });
</script>

<style scoped>
/* 部门展示容器样式 */
.department-display {
  padding: 20px; /* 内边距 */
}

/* 部门网格布局样式 */
.department-grid {
  display: grid; /* 使用网格布局 */
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* 自动调整列宽，最小150px */
  gap: 20px; /* 网格间距 */
  justify-items: center; /* 网格项水平居中 */
}

/* 媒体查询：当屏幕宽度小于640px时 */
@media (max-width: 640px) {
  .department-grid {
    grid-template-columns: repeat(2, 1fr); /* 在小屏幕上显示2列 */
    gap: 10px; /* 减小网格间距 */
  }
  
  .department-item {
    padding: 10px; /* 减小部门项内边距 */
  }
  
  .department-image {
    width: 80px; /* 减小图片宽度 */
    height: 80px; /* 减小图片高度 */
  }
  
  .department-name {
    font-size: 1em; /* 减小字体大小 */
  }
  
  .drawer-content {
    width: 100%; /* 在小屏幕上抽屉内容宽度占满 */
    max-width: none; /* 移除最大宽度限制 */
    padding: 15px; /* 减小抽屉内容内边距 */
  }
}

/* 部门项样式 */
.department-item {
  cursor: pointer; /* 鼠标悬停时显示手型光标 */
  text-align: center; /* 文本居中 */
  background-color: #f9f9f9; /* 背景色 */
  border: 1px solid #e0e0e0; /* 边框 */
  border-radius: 12px; /* 圆角 */
  padding: 15px; /* 内边距 */
  transition: all 0.3s ease; /* 所有属性过渡动画 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* 阴影 */
}

/* 部门项悬停效果 */
.department-item:hover {
  transform: translateY(-7px) scale(1.02); /* 向上移动并稍微放大 */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12); /* 增大阴影 */
  border-color: #a0c4ff; /* 边框颜色变蓝 */
}

/* 部门图片样式 */
.department-image {
  width: 120px; /* 宽度 */
  height: 120px; /* 高度 */
  object-fit: cover; /* 图片裁剪以填充容器 */
  border-radius: 50%; /* 圆形图片 */
  margin-bottom: 15px; /* 下外边距 */
  border: 3px solid #fff; /* 白色边框 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 阴影 */
}

/* 部门名称样式 */
.department-name {
  font-size: 1.2em; /* 字体大小 */
  font-weight: bold; /* 字体加粗 */
  color: #2c3e50; /* 字体颜色 */
  margin-top: 5px; /* 上外边距 */
}

.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
}

.drawer-content {
  position: fixed;
  top: 0;
  right: 0;
  width: 90%; /* 调整以适应更好的移动端体验 */
  max-width: 550px; /* 稍宽以适应更大的屏幕 */
  height: 100%;
  background-color: #ffffff;
  z-index: 1000;
  padding: 25px;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.close-button {
  position: sticky;
  top: 10px;
  align-self: flex-end;
  background: none;
  border: none;
  font-size: 1.8em;
  cursor: pointer;
  color: #666;
  z-index: 1001;
  padding: 5px;
  border-radius: 50%;
  transition: background-color 0.4s;
}

.close-button:hover {
  background-color: #f0f0f0;
}

.capsule-note {
  background-color: #e0f7fa; /* 浅蓝色背景 */
  color: #00796b; /* 深青色文本 */
  padding: 10px 20px;
  border-radius: 25px; /* 药丸形状 */
  margin: 20px auto; /* 居中并添加垂直空间 */
  width: fit-content; /* 根据内容调整宽度 */
  font-size: 0.9em;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.capsule-note p {
  margin: 0; /* 移除默认段落边距 */
} 


.drawer-content h2 {
  font-size: 1.8em;
  color: #34495e;
  margin-top: 15px;
  margin-bottom: 10px;
  border-bottom: 2px solid #42b983;
  padding-bottom: 5px;
}

.drawer-content h3 {
  font-size: 1.4em;
  color: #2980b9;
  margin-top: 20px;
  margin-bottom: 8px;
}

.drawer-content h4 {
  font-size: 1.2em;
  color: #3498db;
  margin-top: 15px;
  margin-bottom: 5px;
}

.drawer-content h5 {
  font-size: 1.1em;
  color: #8e44ad;
  margin-bottom: 10px;
  margin-bottom: 3px;
}

.drawer-content p {
  line-height: 1.7;
  color: #555;
  margin-bottom: 8px;
  text-indent: 2em; /* 首行缩进2em */
}

.drawer-content p:last-child {
  margin-bottom: 0;
  }

.drawer-image {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 50%;
  margin: 0 auto 25px auto;
  display: block;
  border: 4px solid #42b983;
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Transitions */
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.4s ease;
}


.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.4s ease-out;
}
.drawer-slide-enter-from,
.drawer-slide-out {
  transform: translateX(100%); /* 从右侧滑入 */
}

/* 响应式调整 */
@media (max-width: 768px) {
  .department-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 15px;
  }

  .department-image {
    width: 90px;
    height: 90px;
  }

  .department-name {
    font-size: 1em;
  }

  .drawer-content {
    width: 100%;
    padding: 16px;
  }

  .drawer-content h2 {
    font-size: 1.5em;
  }

  .drawer-content h3 {
    font-size: 1.2em;
  }

  .drawer-content h4 {
    font-size: 1.1em;
  }

  .drawer-content h5 {
    font-size: 1em;
  }

  .drawer-content p {
    font-size: 0.9em;
  }

  .drawer-image {
    width: 140px;
    height: 140px;
  }
}

@media (max-width: 480px) {
  .department-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .department-image {
    width: 80px;
    height: 80px;
  }

  .department-name {
    font-size: 0.9em;
  }

  .drawer-content {
    padding: 10px;
  }

  .drawer-content h2 {
    font-size: 1.3em;
  }

  .drawer-content h3 {
    font-size: 1.1em;
  }

  .drawer-content h4 {
    font-size: 1.0em;
  }

  .drawer-content h5 {
    font-weight: 600;
    font-size: 0.9em;
  }

  .drawer-content p {
    font-size: 0.85em;
  }

  .drawer-image {
    width: 120px;
    height: 120px;
  }
}


.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #333;
}

.drawer-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 20px;
}

.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.3s ease;
}
.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.3s ease-out;
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}
</style>