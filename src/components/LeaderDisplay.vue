<template>
<!-- QQ跳转提示信息 -->
  <div class="qq-jump-tip">
    若QQ跳转页长时间无反应则为被浏览器拦截跳转，请复制QQ跳转页网址到QQ内打开
  </div>
  <!-- 负责人信息展示区域 -->
  <div class="leader-display">
    <!-- 遍历按部门分组的负责人数据 -->
    <div v-for="(departmentLeaders, departmentName) in groupedLeaders" :key="departmentName">
      <!-- 部门标题，如果部门名为'null'则显示'特别鸣谢' -->
      <h3 class="department-group-title">{{ departmentName === 'null' ? '特别鸣谢' : departmentName }}</h3>
      <!-- 负责人网格布局 -->
      <div class="leader-grid">
        <!-- 遍历每个部门的负责人 -->
        <div v-for="leader in departmentLeaders" :key="leader.qqNumber" class="leader-item">
          <!-- 负责人头像 -->
          <img :src="leader.avatar" :alt="leader.name" class="leader-avatar" />
          <p>
            <!-- 负责人姓名，如果存在Link则为可点击链接 -->
            <a v-if="leader.Link" :href="leader.Link" target="_blank" class="leader-name-link">{{ leader.name }}</a>
            <span v-else class="leader-name">{{ leader.name }}</span>
            <!-- 负责人性别 -->
            <span class="leader-gender">{{ leader.gender }}</span>
          </p>
          <!-- 负责人班级信息 -->
          <p class="leader-class">
            <!-- 班级年级 -->
            <span v-if="parseClass(leader.class).grade" class="class-grade">{{ parseClass(leader.class).grade }}</span>
            <!-- 班级序号 -->
            <span v-if="parseClass(leader.class).className" class="class-name">{{ parseClass(leader.class).className }}</span>
            <span v-else>{{ leader.class }}</span>
          </p>
          <!-- 负责人职位信息 -->
          <div class="leader-positions">
            <span v-for="pos in leader.position" :key="pos" class="position-tag">
              <!-- 职位年份 -->
              <span v-if="parsePosition(pos).year" class="position-year">{{ parsePosition(pos).year }}</span>
              <!-- 职位部门 -->
              <span v-if="parsePosition(pos).department" class="position-department">{{ parsePosition(pos).department }}</span>
              <!-- 职位头衔 -->
              <span v-if="parsePosition(pos).title" class="position-title">{{ parsePosition(pos).title }}</span>
              <span v-else>{{ pos }}</span>
            </span>
          </div>
          <!-- QQ按钮，根据是否有qqLink显示不同文本 -->
          <button @click="handleQqClick(leader)" class="qq-button">
            {{ buttonTextMap[leader.qqNumber] || (leader.qqLink ? '添加QQ:' + leader.qqNumber : '复制QQ:' + leader.qqNumber) }}
          </button>
          <!-- 负责人工作描述 -->
          <p v-if="leader.workhere" class="leader-workhere">{{ leader.workhere }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- 脚本部分 -->
<script setup lang="ts">
// 导入Vue相关功能：响应式引用、生命周期钩子、组件属性定义、依赖注入
import { ref, onMounted, defineProps, watch, inject } from 'vue';
// 注入全局的displayInfo函数，用于显示提示信息
const displayInfo = inject('displayInfo') as (message: string, duration?: number, isDismissible?: boolean) => void;

// 负责人数据接口定义
interface Leader {
  name: string; // 姓名
  gender: string; // 性别
  avatar: string; // 头像URL
  qqNumber: number; // QQ号码
  qqLink?: string; // QQ跳转链接（可选）
  position: string[]; // 职位列表
  class: string; // 班级
  department: string; // 部门
  workhere?: string; // 工作描述（可选）
  Link?: string; // 外部链接（可选）
}

// 解析后的职位接口定义
interface ParsedPosition {
  year: string; // 年份
  department: string; // 部门
  title: string; // 头衔
}

// 解析后的班级接口定义
interface ParsedClass {
  grade: string; // 年级
  className: string; // 班级名称
}

// 定义组件接收的属性
const props = defineProps({
  dataUrl: { // 数据源URL
    type: String,
    required: true
  }
});

// 响应式变量：存储所有负责人数据
const leaders = ref<Leader[]>([]);
// 响应式变量：存储按部门分组的负责人数据
const groupedLeaders = ref<Record<string, Leader[]>>({});
// 响应式变量：存储QQ按钮的文本状态
const buttonTextMap = ref<Record<number, string>>({});

// 处理QQ按钮点击事件
const handleQqClick = (leader: Leader) => {
  const { qqNumber, qqLink } = leader;

  // 尝试使用Clipboard API复制QQ号码
  if (navigator.clipboard) {
    navigator.clipboard.writeText(qqNumber.toString())
      .then(() => {
        // 如果有QQ跳转链接
        if (qqLink) {
          buttonTextMap.value[qqNumber] = '已复制，正在跳转..'; // 更新按钮文本
          window.open(qqLink, '_blank'); // 打开QQ链接
          // 延迟后恢复按钮文本
          setTimeout(() => {
            buttonTextMap.value[qqNumber] = '添加QQ:' + qqNumber;
          }, 2000); 
        } else {
          buttonTextMap.value[qqNumber] = '已复制QQ'; // 更新按钮文本
          // 延迟后恢复按钮文本
          setTimeout(() => {
            buttonTextMap.value[qqNumber] = '复制QQ:' + qqNumber;
          }, 2000);
        }
      })
      .catch(() => {
        // 复制失败处理
        buttonTextMap.value[qqNumber] = '复制失败';
        setTimeout(() => {
          buttonTextMap.value[qqNumber] = qqLink ? '添加QQ:' + qqNumber : '复制QQ:' + qqNumber;
        }, 2000);
      });
  } else {
    // 兼容不支持Clipboard API的浏览器
    if (qqLink) {
      window.open(qqLink, '_blank'); // 直接打开QQ链接
    }
    buttonTextMap.value[qqNumber] = '不支持自动复制'; // 更新按钮文本
    setTimeout(() => {
      buttonTextMap.value[qqNumber] = qqLink ? '添加QQ:' + qqNumber : '复制QQ:' + qqNumber;
    }, 2000);
  }
};

// 加载负责人数据
const loadLeaders = async () => {
  try {
    const response = await fetch(props.dataUrl);
    // 检查HTTP响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    leaders.value = await response.json(); // 解析JSON数据
    groupLeadersByDepartment(); // 数据加载成功后进行分组
  } catch (error) {
    console.error('加载部门负责人数据失败', error); // 打印错误信息
    displayInfo('[数据加载错误]加载部门负责人数据失败，请联系技术同学！〒▽〒'); // 显示错误提示
  }
};

// 解析职位字符串
const parsePosition = (position: string): ParsedPosition => {
  let year = '';
  let department = '';
  let title = '';

  // 定义正则表达式
  const yearRegex = /^(\d{4}届)/; // 匹配年份，如“2024届”
  const departmentRegex = /(.+?部)/; // 匹配部门，如“宣传部”
  const titleRegex = /部\s*(.+)/; // 匹配头衔，如“部长”

  let remaining = position; // 剩余待解析字符串

  // 尝试匹配年份
  const yearMatch = remaining.match(yearRegex);
  if (yearMatch) {
    year = yearMatch[1];
    remaining = remaining.replace(yearRegex, '').trim();
  }

  // 尝试匹配部门
  const departmentMatch = remaining.match(departmentRegex);
  if (departmentMatch) {
    department = departmentMatch[1];
    remaining = remaining.replace(departmentRegex, '').trim();
  }

  // 剩余部分作为头衔
  if (remaining) {
    title = remaining;
  }

  return { year, department, title };
};

// 解析班级字符串
const parseClass = (classStr: string): ParsedClass => {
  // 匹配班级格式，如“2024级1班”
  const match = classStr.match(/^(\d+级)(.+班)$/);
  // 如果匹配成功则返回年级和班级名称，否则返回空字符串
  return match ? { grade: match[1], className: match[2] } : { grade: '', className: '' };
};

// 按部门分组负责人
const groupLeadersByDepartment = () => {
  const groups: Record<string, Leader[]> = {};
  leaders.value.forEach(leader => {
    const department = leader.department || 'null'; // 如果没有部门则归为'null'组
    if (!groups[department]) {
      groups[department] = [];
    }
    groups[department].push(leader);
  });

  // 对部门名称进行排序，'总社'排最前，'null'排最后
  const sortedDepartmentNames = Object.keys(groups).sort((a, b) => {
    if (a === '总社') return -1;
    if (b === '总社') return 1;
    if (a === 'null') return 1;
    if (b === 'null') return -1;
    return a.localeCompare(b);
  });

  // 构建排序后的分组对象
  const sortedGroups: Record<string, Leader[]> = {};
  sortedDepartmentNames.forEach(name => {
    sortedGroups[name] = groups[name];
  });
  groupedLeaders.value = sortedGroups; // 更新响应式分组数据
};

// 组件挂载时加载数据
onMounted(() => {
  loadLeaders();
});

// 监听dataUrl属性变化，重新加载数据
watch(() => props.dataUrl, loadLeaders, { immediate: true });
</script>

<!-- 样式部分 -->
<style scoped>
.qq-jump-tip {
  background-color: #fff3cd;
  color: #856404;
  margin-top: 20px;
  border: 1px solid #ffeeba;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  text-align: center;
  font-size: 0.9em;
  margin-top: 20px;
}
/* 样式部分无报错，保留原逻辑 */
.qq-button {
  background-color: #4CAF50; /* 绿色 */
  border: none;
  color: white;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  position: relative;
  z-index: 99999;
}

.qq-button:hover {
  background-color: #45a049;
}

.qq-button:active {
  background-color: #3e8e41;
}

.qq-button.copied {
  background-color: #f44336; /* 复制状态下的红色 */
}

.qq-button.copied-and-redirecting {
  background-color: #ff9800; /* 重定向状态下的橙色 */
}

.leader-display {
  padding: 20px;
  text-align: center;
}

.department-group-title {
  font-size: 1.8em;
  font-weight: bold;
  color: #2c3e50;
  margin-top: 30px;
  margin-bottom: 20px;
  border-bottom: 2px solid #a0c4ff;
  padding-bottom: 10px;
  text-align: left;
}

.leader-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px; /* 保持卡片之间的间距 */
  justify-items: center;
  /* 移除max-width，使其自适应 */
  margin: 0 auto;
  padding: 0 10px; /* 添加左右内边距，确保卡片与边缘有空隙 */
}

.leader-item {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: flex-start;
}

.leader-item:hover {
  transform: translateY(-7px) scale(1.02);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  border-color: #a0c4ff;
}

.leader-avatar {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 10px;
  border: 3px solid #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.leader-name-link {
  color: #ff69b4;
  text-decoration: underline;
}

.leader-name {
  font-size: 1.1em;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 5px;
}

.leader-gender {
  font-size: 0.9em;
  color: #666;
}

.leader-class {
  font-size: 0.9em;
  color: #555;
  margin-bottom: 3px;
}

.leader-workhere {
  color: #42b983;
  font-size: 0.9em;
  margin-bottom: 3px;
}

.leader-positions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  margin-bottom: 5px;
}

.position-tag {
  background-color: #a0c4ff;
  color: white;
  padding: 4px 8px;
  border-radius: 15px;
  font-size: 0.8em;
  white-space: nowrap;
  display: flex;
  align-items: center;
}

.position-year {
  font-weight: bold;
  margin-right: 4px;
}

.position-department {
  margin-right: 4px;
}

.position-title {
  font-style: italic;
}

.class-grade {
  font-weight: bold;
  margin-right: 4px;
}

.class-name {
  font-style: italic;
}

.qq-link {
  display: inline-block;
  margin-top: 10px;
  padding: 8px 15px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.qq-link-disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.qq-link-disabled:hover {
  background-color: #cccccc;
}

.qq-link:hover {
  background-color: #369f6e;
}

/* 响应式样式保留 */
@media (max-width: 640px) {
  .department-group-title {
    font-size: 1.5em;
    margin-top: 20px;
    margin-bottom: 15px;
  }

@media (hover: none) {
  .leader-item:hover {
    transform: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    border-color: #e0e0e0;
  }
}

  .leader-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); /* 调整小屏幕下的minmax值 */
    gap: 10px; /* 保持卡片之间的间距 */
    padding: 0 5px; /* 小屏幕下调整内边距 */
  }

  .leader-item {
    padding: 10px;
  }

  .leader-avatar {
    width: 80px;
    height: 80px;
  }

  .leader-name {
    font-size: 1em;
  }
}
</style>