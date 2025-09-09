// 审核核心组件 - 780+ 行代码（含注释）
// 此文件本身负担过大职责的同时与 SurveyCore 存在大量趋同逻辑和样式，与预期时的独立使用场景不符
// 未来考虑将其拆分成多个组件，如文件处理，文件解析，文件审核等
<template>
  <div class="review-core">
    <!-- 上传模式界面：用于上传加密数据或直接粘贴文本 -->
    <div v-if="reviewMode === 'upload'">
      <h2 class="text-xl font-bold mb-4">在此上传加密数据</h2>
      <!-- 文件上传区域 -->
      <div class="mb-6 p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
        <label for="file-upload" class="block text-green-800 text-sm font-bold mb-2">上传文件 (.txt, .qaq):</label>
        <div class="relative">
          <input
                type="file"
                id="file-upload"
                @change="handleFileUpload"
                accept=".txt,.qaq"
                class="hidden"
              />
              <!-- 文件拖拽上传区域 -->
              <label 
                for="file-upload"
                class="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-300 flex items-center justify-center cursor-pointer hover:bg-gray-50"
                @dragover.prevent
                 @drop.prevent="handleFileDrop"
                 @dragenter="isDragging = true"
                 @dragleave="isDragging = false"
               >
                 <span v-if="!isDragging" class="text-black text-sm">点击或拖拽文件到此处</span>
                 <span v-else class="text-blue-500 text-sm">松手即上传</span>
              </label>
        </div>
      </div>
      <!-- 文本粘贴区域 -->
      <div class="mb-6 p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
        <label for="text-input" class="block text-black text-sm font-bold mb-2">或直接粘贴文本:</label>
        <textarea
          id="text-input"
          v-model="pastedText"
          placeholder="请在此处粘贴审核内容..."
          rows="10"
          class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-300 resize-y"
        ></textarea>
      </div>
      <!-- 操作按钮区域 -->
      <div class="flex justify-center space-x-4">
        <!-- 处理内容按钮 -->
        <button @click="processContent" class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-200 transition-all duration-300 hover:scale-105 hover:text-white hover:shadow-xl active:scale-95 active:shadow-md">
          <span class="relative z-10">处理内容</span>
          <span class="absolute inset-0 overflow-hidden rounded-md">
            <span class="absolute left-0 aspect-square w-full -translate-x-full rounded-full bg-neutral-800 transition-all duration-300 group-hover:translate-x-0 group-hover:scale-150"></span>
          </span>
        </button>
        <!-- 清空内容按钮 -->
        <button @click="clearContent" class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-200 transition-all duration-300 hover:scale-105 hover:text-white hover:shadow-xl active:scale-95 active:shadow-md">
          <span class="relative z-10">清空内容</span>
          <span class="absolute inset-0 overflow-hidden rounded-md">
            <span class="absolute left-0 aspect-square w-full -translate-x-full rounded-full bg-neutral-800 transition-all duration-300 group-hover:translate-x-0 group-hover:scale-150"></span>
          </span>
        </button>
      </div>
    </div>

    <!-- 总览模式界面：显示解密后的问卷数据概览 -->
    <div v-else-if="reviewMode === 'overview'" class="decrypted-result">
      <!-- 当存在姓名数据时，显示详细信息 -->
      <div v-if="reviewData.name">
        <div class="grid grid-cols-2 gap-4 items-start">
          <!-- 左上角：客观题得分环形图 -->
          <div class="flex flex-col items-center">
            <PercentageRing v-if="reviewData.objectiveQuestionsScore !== undefined" :percentage="reviewData.objectiveQuestionsScore" :radius="60" :strokeWidth="10" :size="80" />
            <p v-if="reviewData.objectiveQuestionsScore !== undefined" class="mt-2 text-lg font-semibold text-center">客观题得分: {{ reviewData.objectiveQuestionsScore }}</p>
          </div>
          <!-- 右上角：班级、QQ、电话信息 -->
          <div class="flex flex-col items-center text-center">
            <p class="font-bold">班别: {{ reviewData.gradeNum }}级{{ reviewData.classNum }}班</p>
            <p class="font-bold">QQ号: {{ reviewData.qqNumber }}</p>
            <p class="font-bold">电话号: {{ reviewData.phoneNumber }}</p>
          </div>
          <!-- 左下角：头像和姓名 -->
          <div class="flex flex-col items-center">
            <img v-if="qqAvatarUrl" :src="qqAvatarUrl" alt="QQ Avatar" class="qq-avatar w-20 h-20 rounded-full mb-2 object-cover" />
            <p class="text-lg font-semibold text-center">{{ reviewData.name }} <span v-if="reviewData.gender === '男'">♂️</span><span v-else-if="reviewData.gender === '女'">♀️</span></p>
          </div>
          <!-- 右下角：部门志愿偏好 -->
          <div v-if="reviewData.selectedBanks && reviewData.selectedBanks.length > 0" class="flex flex-col items-center text-center">
            <p class="font-semibold">志愿加入部门:</p>
            <div class="flex flex-wrap gap-2 mt-1 justify-center">
              <span v-for="bank in reviewData.selectedBanks.filter(b => b.choice === 'preferred')" :key="bank.bank" class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                {{ bank.bankName }}
              </span>
            </div>
            <p v-if="reviewData.selectedBanks.some(b => b.choice === 'adjustment')" class="font-semibold mt-2">可接受的调剂:</p>
            <div class="flex flex-wrap gap-2 mt-1 justify-center">
              <span v-for="bank in reviewData.selectedBanks.filter(b => b.choice === 'adjustment')" :key="bank.bank" class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                {{ bank.bankName }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- 当不存在姓名数据时，显示原始解密内容 -->
      <div v-else>
        <p class="whitespace-pre-wrap mb-4 p-2 border border-gray-300 rounded-md bg-gray-50">{{ decryptedContent }}</p>
      </div>
    </div>


    <!-- 客观题审阅模式界面 -->
    <div v-else-if="reviewMode === 'objective'" class="objective-questions-view">
      <div v-if="objectiveQuestionDetails.length > 0">
        <!-- 题目头部信息 -->
        <div class="question-header">
         <span class="question-type-tag">客观题 - {{ objectiveQuestionDetails[currentObjectiveQuestionIndex].bankName }}({{ objectiveQuestionDetails[currentObjectiveQuestionIndex].bank }}) - id:{{ objectiveQuestionDetails[currentObjectiveQuestionIndex].bankId }}</span>
         <span class="question-number">第 {{ currentObjectiveQuestionIndex + 1 }} / {{ objectiveQuestionDetails.length }} 题</span>
       </div>
       <!-- 题目内容卡片 -->
       <div class="question-detail-card">
        <div class="text-black text-lg font-bold mb-2">{{ objectiveQuestionDetails[currentObjectiveQuestionIndex].question }}</div>
        </div>
        <!-- 选项列表卡片 -->
        <div class="question-detail-card">
        <div class="text-black text-base">
        <ul class="options-list">
          <li v-for="(option, optIndex) in objectiveQuestionDetails[currentObjectiveQuestionIndex].options" :key="optIndex">
            {{ option }}
          </li>
        </ul>
        </div>
      </div>
        <!-- 用户回答与正确答案卡片 -->
        <div class="question-detail-card">
        <p v-if="!objectiveQuestionDetails[currentObjectiveQuestionIndex].isCorrect" :class="{'correct-answer': objectiveQuestionDetails[currentObjectiveQuestionIndex].isCorrect, 'wrong-answer': !objectiveQuestionDetails[currentObjectiveQuestionIndex].isCorrect}">
          问卷回答: {{ objectiveQuestionDetails[currentObjectiveQuestionIndex].userAnswer }}
        </p>
        <p class="correct-answer-text">正确答案: {{ objectiveQuestionDetails[currentObjectiveQuestionIndex].correctAnswer }}</p>
      </div>
      </div>
      <!-- 客观题导航条 -->
      <div class="objective-nav">
        <div
          v-for="(q, index) in objectiveQuestionDetails"
          :key="q.bank + '-' + q.bankId"
          @click="goToObjectiveQuestion(index)"
          class="question-nav-item"
          :class="{
            'active': currentObjectiveQuestionIndex === index,
            'answered': q.isAnswered,
            'correct': q.isCorrect,
            'wrong': !q.isCorrect && q.isAnswered
          }"
        >
          {{ index + 1 }}
        </div>
      </div>
      <!-- 返回总览按钮 -->
      <div class="flex justify-center mt-4">
        <button @click="returnToOverview" class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-200 transition-all duration-300 hover:scale-105 hover:text-white hover:shadow-xl active:scale-95 active:shadow-md">
          <span class="relative z-10">返回总览</span>
          <span class="absolute inset-0 overflow-hidden rounded-md">
            <span class="absolute left-0 aspect-square w-full -translate-x-full rounded-full bg-neutral-800 transition-all duration-300 group-hover:translate-x-0 group-hover:scale-150"></span>
          </span>
        </button>
      </div>
    </div>

    <!-- 主观题审阅模式界面 -->
    <div v-else-if="reviewMode === 'subjective'" class="subjective-questions-view">
      <div v-if="subjectiveQuestionDetails.length > 0" >
       <!-- 题目头部信息 -->
       <div class="question-header">
         <span class="question-type-tag">主观题 {{ subjectiveQuestionDetails[currentSubjectiveQuestionIndex].bankName }}({{ subjectiveQuestionDetails[currentSubjectiveQuestionIndex].bank }}) - id:{{ subjectiveQuestionDetails[currentSubjectiveQuestionIndex].bankId }}</span>
         <span class="question-number">第 {{ currentSubjectiveQuestionIndex + 1 }} / {{ subjectiveQuestionDetails.length }} 题</span>
       </div>
       <!-- 题目内容卡片 -->
       <div class="question-detail-card">
        <div class="text-black text-lg font-bold mb-2">{{ subjectiveQuestionDetails[currentSubjectiveQuestionIndex].question }}</div>
        </div>
        <!-- 用户回答卡片 -->
        <div class="question-detail-card">
        <div class="text-white text-base">
        <p class="user-answer-text">答: {{ subjectiveQuestionDetails[currentSubjectiveQuestionIndex].userAnswer }}</p>
        </div>
      </div>
      </div>
      <!-- 主观题导航条 -->
          <div class="subjective-nav">
        <div
          v-for="(q, index) in subjectiveQuestionDetails"
          :key="q.bank + '-' + q.bankId"
          @click="goToSubjectiveQuestion(index)"
          class="question-nav-item"
          :class="{
            'active': currentSubjectiveQuestionIndex === index,
            'answered': q.isAnswered
          }"
        >
          {{ index + 1 }}
        </div>
      </div>
      <!-- 返回总览按钮 -->
      <div class="flex justify-center mt-4">
        <button @click="returnToOverview" class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-200 transition-all duration-300 hover:scale-105 hover:text-white hover:shadow-xl active:scale-95 active:shadow-md">
          <span class="relative z-10">返回总览</span>
          <span class="absolute inset-0 overflow-hidden rounded-md">
            <span class="absolute left-0 aspect-square w-full -translate-x-full rounded-full bg-neutral-800 transition-all duration-300 group-hover:translate-x-0 group-hover:scale-150"></span>
          </span>
        </button>
      </div>
    </div>
  </div>
<!-- 总览模式下的操作按钮区域 -->
<div v-if="reviewMode === 'overview'" class="flex flex-col items-center mt-4">
  <!-- 切换到客观题/主观题审阅的按钮组 -->
  <div class="flex space-x-4 mb-4">
    <!-- 参考客观题情况按钮 -->
    <button @click="showObjectiveQuestions" class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-200 transition-all duration-300 hover:scale-105 hover:text-white hover:shadow-xl active:scale-95 active:shadow-md">
      <span class="relative z-10">参考客观题情况</span>
      <span class="absolute inset-0 overflow-hidden rounded-md">
        <span class="absolute left-0 aspect-square w-full -translate-x-full rounded-full bg-neutral-800 transition-all duration-300 group-hover:translate-x-0 group-hover:scale-150"></span>
      </span>
    </button>
    <!-- 审阅主观题回答按钮 -->
    <button @click="showSubjectiveQuestions" class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-200 transition-all duration-300 hover:scale-105 hover:text-white hover:shadow-xl active:scale-95 active:shadow-md">
      <span class="relative z-10">审阅主观题回答</span>
      <span class="absolute inset-0 overflow-hidden rounded-md">
            <span class="absolute left-0 aspect-square w-full -translate-x-full rounded-full bg-neutral-800 transition-all duration-300 group-hover:translate-x-0 group-hover:scale-150"></span>
          </span>
        </button>
      </div>
      <!-- 处理下一个内容按钮 -->
      <button @click="resetPage" class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-200 transition-all duration-300 hover:scale-105 hover:text-white hover:shadow-xl active:scale-95 active:shadow-md">
        <span class="relative z-10">处理下一个内容</span>
        <span class="absolute inset-0 overflow-hidden rounded-md">
          <span class="absolute left-0 aspect-square w-full -translate-x-full rounded-full bg-neutral-800 transition-all duration-300 group-hover:translate-x-0 group-hover:scale-150"></span>
        </span>
      </button>
    </div>

</template>

<script setup lang="ts">
// 导入 Vue 核心功能：ref 用于创建响应式数据，inject 用于注入父组件提供的数据，onMounted 用于组件挂载后执行操作，computed 用于创建计算属性
import { ref, inject, onMounted, computed } from 'vue';
// 导入自定义组件 PercentageRing，用于显示百分比环形图
import PercentageRing from './PercentageRing.vue';
// 导入加密解密工具函数：aes256Decrypt 用于 AES-256 解密，phoneticSingleToBase64 用于将拼音单字转换为 Base64 编码
import { aes256Decrypt , phoneticSingleToBase64 } from '../utils/aesMeowCrypt';
// 导入自定义组合式函数 useQABank，用于处理题库相关逻辑
import { useQABank } from '../composables/useQABank';

// 导入题库元数据，包含题库的基本信息
import metaData from '../../public/question-bank/_meta.json';

// 注入父组件提供的全局函数：displayInfo 用于显示信息提示，triggerAnimation 用于触发动画，triggerExpand 用于触发展开动画
const displayInfo = inject('displayInfo') as (message: string, duration?: number, isDismissible?: boolean) => void;
const triggerAnimation = inject('triggerAnimation') as (onShrinkComplete?: () => void) => void;
const triggerExpand = inject('triggerExpand') as () => void;
// 使用 useQABank 组合式函数获取题库相关方法：generateBankMeta 用于生成题库元数据，loadBank 用于加载题库，getQuestionById 用于根据 ID 获取题目
const { generateBankMeta, loadBank, getQuestionById } = useQABank();
// 定义响应式数据：pastedText 用于存储用户粘贴的文本，decryptedContent 用于存储解密后的内容，reviewMode 用于控制审阅模式（上传、总览、客观题、主观题），isDragging 用于判断文件是否正在被拖拽，decryptionKey 用于存储解密密钥
const pastedText = ref('');
const decryptedContent = ref('');
const reviewMode = ref<'upload' | 'overview' | 'objective' | 'subjective'>('upload');
const isDragging = ref(false);
const decryptionKey = ref('');

// 定义响应式数据：objectiveQuestionDetails 用于存储客观题详情列表，subjectiveQuestionDetails 用于存储主观题详情列表
const objectiveQuestionDetails = ref<any[]>([]);
const subjectiveQuestionDetails = ref<any[]>([]);

// 定义响应式数据：currentObjectiveQuestionIndex 用于记录当前查看的客观题索引，currentSubjectiveQuestionIndex 用于记录当前查看的主观题索引
const currentObjectiveQuestionIndex = ref(0);
const currentSubjectiveQuestionIndex = ref(0);


// 定义提交上来的客观题详情接口，暂无实际引用，供增加文件结构可读性
interface ObjectiveQuestionDetail {
  question: string;
  bank: string;
  bankId: string | number;
  bankName: string;
  options: string[];
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  isAnswered: boolean;
}

// 定义提交上来的客观题详情接口，暂无实际引用，供增加文件结构可读性
interface SubjectiveQuestionDetail {
  question: string;
  bank: string;
  bankId: string | number;
  bankName: string;
  userAnswer: string;
  isAnswered: boolean;
}

// 定义审阅数据接口，用于规范解密后的问卷数据结构
interface ReviewData {
  name?: string;
  gradeNum?: string;
  classNum?: string;
  gender?: string;
  qqNumber?: string;
  phoneNumber?: string;
  objectiveQuestionsScore?: number;
  selectedBanks?: Array<{ bank: string; bankName?: string; type: string; count: number; choice: string; answers: any[] }>;
  [key: string]: any;
}

// 定义响应式数据 reviewData，用于存储解密后的问卷数据
const reviewData = ref<ReviewData>({});

// 计算属性 qqAvatarUrl，根据 QQ 号生成 QQ 头像 URL
const qqAvatarUrl = computed(() => {
  if (reviewData.value.qqNumber) {
    return `https://q.qlogo.cn/g?b=qq&nk=${reviewData.value.qqNumber}&s=640`;
  } else {
    return null;
  }
});

// 组件挂载后执行的生命周期钩子函数：加载解密密钥
onMounted(async () => {
  try {
    const response = await fetch('/.password/key.json');
    const data = await response.json();
    decryptionKey.value = data.key;
  } catch (error) {
    console.error('[加密核心错误-审阅核心] 加载解密密钥失败', error);
    displayInfo('[加密核心错误]加载解密密钥失败，请联系技术同学！否则无法解析上传的加密数据！(っ °Д °;)っ');
  }
});

// 读取文件内容函数：将文件读取为文本，并更新 pastedText
const readFileContent = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target?.result) {
      pastedText.value = e.target.result as string;
    }
  };
  reader.readAsText(file);
};

// 处理文件上传函数：获取上传的文件并调用 readFileContent 读取内容
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    readFileContent(file);
  }
};

// 处理文件拖拽放置函数：获取拖拽的文件并调用 readFileContent 读取内容，同时重置 isDragging 状态
const handleFileDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files?.[0];
      if (file) {
        readFileContent(file);
      }
      isDragging.value = false;
};

// 处理内容函数：解密 pastedText 并解析数据，更新 reviewMode 和 reviewData
const processContent = () => {
  // 检查是否有内容上传
  if (!pastedText.value) {
    displayInfo('你木有上传内容，空白没法解密~(´。＿。｀)');
    return;
  }

  // 检查解密密钥是否加载完毕
  if (!decryptionKey.value) {
    displayInfo('解密密钥未加载完毕，请稍后再试！(っ °Д °;)っ');
    return;
  }

  // 触发动画并执行解密逻辑
  triggerAnimation(() => {
    try {
      // 解密内容
      const decrypted = aes256Decrypt(phoneticSingleToBase64(pastedText.value), decryptionKey.value);
      // 检查解密结果是否有效
      if (!decrypted) {
        displayInfo('密文格式错误或不完整！无法作为合法的数据解析..－O－');
        return;
      }

      let parsedData: any;
      try {
        // 尝试解析 JSON 数据
        parsedData = JSON.parse(decrypted);
        reviewData.value = parsedData;

        // 如果存在客观题得分，将其转换为数字类型
        if (parsedData.objectiveQuestionsScore !== undefined) {
          reviewData.value.objectiveQuestionsScore = Number(parsedData.objectiveQuestionsScore);
        }

        // 处理选定的部门信息，添加 bankName
        if (parsedData.selectedBanks) {
          reviewData.value.selectedBanks = parsedData.selectedBanks.map((bank: any) => ({
            ...bank,
            bankName: metaData.meta.find(m => m.bank === bank.bank)?.bankName || bank.bank
          }));
        }

        // 更新解密内容和审阅模式，并触发展开动画
        decryptedContent.value = decrypted;
        reviewMode.value = 'overview';
        triggerExpand();

        // 触发自定义事件通知解密完成，并传递解析后的数据
        window.dispatchEvent(new CustomEvent('reviewDataDecrypted', { detail: parsedData }));
        
        // 直接调用函数显示题目
        processDecryptedContent(decrypted);

      } catch (parseError) {
        // JSON 解析失败时，清空 reviewData 并显示原始解密内容
        reviewData.value = {};
        decryptedContent.value = decrypted;
      }
    } catch (error: any) {
      // 解密失败时，显示错误信息
      displayInfo(`解密失败，原因：${error.message}`);
    }
  });
};

// 处理解密内容函数：解析解密后的数据，加载题库并处理题目详情
const processDecryptedContent = async (content: string) => {
  const parsedData = JSON.parse(content) as ReviewData;

  // 1️.生成 bankMeta（生成 objective 和 subjective 类型）
  await generateBankMeta(['objective', 'subjective']); 

  // 2. 确保题库都加载到池里
  const banksToLoad = Array.from(new Set((parsedData.selectedBanks || []).map((b: any) => b.bank)));
  for (const bank of banksToLoad) {
    try {
      await loadBank(bank);
    } catch (err) {
      console.error(`[题库错误-审阅核心] 加载题库失败: ${bank}`, err);
      displayInfo(`[题库错误]加载题库失败: ${bank}，请联系技术同学！否则无法正常查看相关客观题！(っ °Д °;)っ`);
    }
  }

  // 初始化客观题和主观题详情列表
  objectiveQuestionDetails.value = [];
  subjectiveQuestionDetails.value = [];

  // 遍历选定的部门，处理题目详情
  // 遍历选定的部门，处理题目详情
  for (const bank of parsedData.selectedBanks || []) {
    if (!bank.answers) continue;

    // 遍历当前部门下的所有答案
    for (const answerItem of bank.answers) {
      // 根据题目 ID 获取题目详情
      const questionData = await getQuestionById(bank.bank, answerItem.id);
      if (!questionData) continue;

      // 如果是客观题
      if (questionData.type === 'objective') {
        // 将客观题详情添加到列表中
        objectiveQuestionDetails.value.push({
          question: questionData.question,
          bank: bank.bank,
          bankId: answerItem.id,
          bankName: metaData.meta.find(m => m.bank === bank.bank)?.bankName || bank.bank,
          options: questionData.options,
          correctAnswer: questionData.answer,
          userAnswer: answerItem.selectedOption,
          isCorrect: questionData.answer === answerItem.selectedOption,
          isAnswered: true
        });
      // 如果是主观题
      } else {
        // 将主观题详情添加到列表中
        subjectiveQuestionDetails.value.push({
          question: questionData.question,
          bank: bank.bank,
          bankId: answerItem.id,
          bankName: metaData.meta.find(m => m.bank === bank.bank)?.bankName || bank.bank,
          userAnswer: answerItem.text,
          isAnswered: true
        });
      }
    }
  }

  // 排序输出
  const sortByBankAndId = (a: { bank: string; bankId: string | number }, b: { bank: string; bankId: string | number }) => {
    if (a.bank < b.bank) return -1;
    if (a.bank > b.bank) return 1;
    if (a.bankId < b.bankId) return -1;
    if (a.bankId > b.bankId) return 1;
    return 0;
  };
  objectiveQuestionDetails.value.sort(sortByBankAndId);
  subjectiveQuestionDetails.value.sort(sortByBankAndId);
};

// 监听自定义事件 'reviewDataDecrypted'，当解密数据可用时触发
window.addEventListener('reviewDataDecrypted', async (event: Event) => {
  const parsedData = (event as CustomEvent).detail as ReviewData;
  await processDecryptedContent(JSON.stringify(parsedData));
});

// 显示客观题列表
const showObjectiveQuestions = () => {
  // 如果没有客观题，则显示提示信息并返回
  if (objectiveQuestionDetails.value.length === 0) {
    displayInfo('未注册客观题，无法查看。(_　_)。゜zｚＺ');
    return;
  }
  // 触发动画并切换到客观题审阅模式
  triggerAnimation(() => {
    reviewMode.value = 'objective';
    triggerExpand();
  });
};

// 跳转到指定索引的客观题
const goToObjectiveQuestion = (index: number) => {
  // 触发动画，更新当前客观题索引，并切换到客观题审阅模式
  triggerAnimation(() => {
    currentObjectiveQuestionIndex.value = index;
    reviewMode.value = 'objective';
    triggerExpand();
  });
};

// 显示主观题列表
const showSubjectiveQuestions = () => {
  // 如果没有主观题，则显示提示信息并返回
  if (subjectiveQuestionDetails.value.length === 0) {
    displayInfo('未注册主观题，无法查看。(_　_)。゜zｚＺ');
    return;
  }
  // 触发动画并切换到主观题审阅模式
  triggerAnimation(() => {
    reviewMode.value = 'subjective';
    triggerExpand();
  });
};

// 跳转到指定索引的主观题
const goToSubjectiveQuestion = (index: number) => {
  // 触发动画，更新当前主观题索引，并切换到主观题审阅模式
  triggerAnimation(() => {
    currentSubjectiveQuestionIndex.value = index;
    reviewMode.value = 'subjective';
    triggerExpand();
  });
};

// 重置页面状态，返回到上传模式
const resetPage = () => {
  // 触发动画，清空粘贴文本、解密内容、审阅数据，并切换到上传模式
  triggerAnimation(() => {
    pastedText.value = '';
    decryptedContent.value = '';
    reviewData.value = {};
    reviewMode.value = 'upload';
    triggerExpand();
  });
};

// 清空当前粘贴的内容
const clearContent = () => {
  pastedText.value = '';
  displayInfo('帮你清空辣！(๑•̀ㅂ•́)و✧');
};

// 返回总览模式
const returnToOverview = () => {
  // 触发动画并切换到总览模式
  triggerAnimation(() => {
    reviewMode.value = 'overview';
    triggerExpand();
  });
};
</script>

<style scoped>
/* 审阅核心组件的整体样式 */
.review-core {
  max-width: 800px; /* 最大宽度 */
  margin: 0 auto; /* 水平居中 */
  padding: 1rem; /* 内边距 */
}

/* 解密结果区域样式 */
.decrypted-result {
  padding: 1rem; /* 内边距 */
}

/* 网格布局样式 */
.grid {
  display: grid; /* 使用网格布局 */
  grid-template-columns: 1fr 1fr; /* 两列，每列占据等宽 */
  gap: 1rem; /* 网格间距 */
  align-items: start; /* 顶部对齐 */
}

/* 媒体查询：当屏幕宽度小于等于 640px 时，网格布局变为单列 */
@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr; /* 单列布局 */
  }
}

/* 客观题和主观题导航条的公共样式 */
.objective-nav,
.subjective-nav {
  display: flex; /* 弹性布局 */
  flex-wrap: wrap; /* 允许换行 */
  margin-top: 20px; /* 上外边距 */
  padding: 10px; /* 内边距 */
  background-color: rgba(0, 0, 0, 0.1); /* 背景色 */
  border-radius: 8px; /* 圆角 */
  border: 1px solid rgba(255, 255, 255, 0.2); /* 边框 */
}

/* 题目导航项的样式 */
.question-nav-item {
  display: flex; /* 弹性布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  width: 35px; /* 固定宽度 */
  height: 35px; /* 固定高度 */
  margin: 5px; /* 间距 */
  background-color: rgba(255, 255, 255, 0.1); /* 默认背景 */
  border: 1px solid rgba(255, 255, 255, 0.3); /* 边框 */
  border-radius: 50%; /* 圆形 */
  color: #eee; /* 默认文字颜色 */
  font-weight: bold; /* 字体加粗 */
  cursor: pointer; /* 鼠标指针样式 */
  transition: all 0.3s ease; /* 过渡动画 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 阴影 */
}

/* 题目导航项悬停时的样式 */
.question-nav-item:hover {
  background-color: rgba(255, 255, 255, 0.2); /* 悬停背景 */
  border-color: #42b983; /* 悬停边框颜色 */
  transform: translateY(-2px); /* 悬停上浮 */
}

/* 题目导航项选中时的样式 */
.question-nav-item.active {
  background-color: #42b983; /* 选中背景 */
  border-color: #42b983; /* 选中边框颜色 */
  color: #fff; /* 选中文字颜色 */
  box-shadow: 0 0 10px rgba(66, 185, 131, 0.7); /* 选中阴影 */
  transform: scale(1.1); /* 选中放大 */
}

/* 题目导航项已回答时的样式 */
.question-nav-item.answered {
  background-color: rgba(66, 185, 131, 0.3); /* 已答背景 */
  border-color: rgba(66, 185, 131, 0.5); /* 已答边框 */
}

/* 题目导航项已回答且选中时的样式 */
.question-nav-item.answered.active {
  background-color: #42b983; /* 已答且选中背景 */
  border-color: #42b983; /* 已答且选中边框 */
}

/* 题目导航项回答正确时的样式 */
.question-nav-item.correct {
  background-color: rgba(66, 185, 131, 0.7); /* 回答正确背景 */
  border-color: #42b983; /* 回答正确边框 */
}

/* 题目导航项回答错误时的样式 */
.question-nav-item.wrong {
  background-color: rgba(231, 76, 60, 0.7); /* 回答错误背景 */
  border-color: #e74c3c; /* 回答错误边框 */
}

/* 题目详情卡片的样式 */
.question-detail-card {
  background-color: rgba(0, 0, 0, 0.05); /* 背景色 */
  border: 1px solid rgba(255, 255, 255, 0.2); /* 边框 */
  border-radius: 10px; /* 圆角 */
  padding: 20px; /* 内边距 */
  margin-top: 20px; /* 上外边距 */
  width: 100%; /* 宽度 */
  max-width: 600px; /* 最大宽度 */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); /* 阴影 */
  color: #eee; /* 文字颜色 */
}

/* 题目详情卡片标题的样式 */
.question-detail-card h3 {
  font-size: 1.5rem; /* 字体大小 */
  margin-bottom: 15px; /* 下外边距 */
  color: #42b983; /* 文字颜色 */
  text-align: center; /* 文本居中 */
}

/* 题目头部的样式 */
.question-header {
  display: flex; /* 弹性布局 */
  justify-content: space-between; /* 两端对齐 */
  align-items: center; /* 垂直居中 */
  margin-bottom: 15px; /* 下外边距 */
  padding-bottom: 10px; /* 下内边距 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.3); /* 底部边框 */
}

/* 题目类型标签的样式 */
.question-type-tag {
  background-color: rgba(0, 0, 0, 0.2); /* 背景色 */
  color: #fff; /* 文字颜色 */
  padding: 5px 10px; /* 内边距 */
  border-radius: 5px; /* 圆角 */
  font-size: 0.8em; /* 字体大小 */
  font-weight: bold; /* 字体加粗 */
  opacity: 0.7; /* 透明度 */
}

/* 题目序号的样式 */
.question-number {
  font-size: 0.8em; /* 字体大小 */
  font-weight: bold; /* 字体加粗 */
  color: #fff; /* 文字颜色 */
  background-color: rgba(0, 0, 0, 0.3); /* 背景色 */
  padding: 5px 10px; /* 内边距 */
  border-radius: 5px; /* 圆角 */
}

/* 选项列表的样式 */
.options-list {
  list-style: none; /* 移除列表标记 */
  padding: 0; /* 移除内边距 */
  margin-bottom: 15px; /* 下外边距 */
}

/* 选项列表项的样式 */
.options-list li {
  margin-bottom: 8px; /* 下外边距 */
  padding: 5px; /* 内边距 */
  background-color: rgba(255, 255, 255, 0.05); /* 背景色 */
  border-radius: 5px; /* 圆角 */
}

/* 正确答案的样式 */
.correct-answer {
  color: #42b983; /* 文字颜色 */
  font-weight: bold; /* 字体加粗 */
}

/* 错误答案的样式 */
.wrong-answer {
  color: #e74c3c; /* 文字颜色 */
  font-weight: bold; /* 字体加粗 */
}

/* 正确答案文本的样式 */
.correct-answer-text {
  color: #42b983; /* 文字颜色 */
  font-weight: bold; /* 字体加粗 */
  margin-top: 10px; /* 上外边距 */
}

/* 用户答案文本的样式 */
.user-answer-text {
  color: #3498db; /* 文字颜色 */
  font-weight: bold; /* 字体加粗 */
  margin-top: 10px; /* 上外边距 */
}

/* 结果文本的样式 */
.result-text {
  font-weight: bold; /* 字体加粗 */
  margin-top: 10px; /* 上外边距 */
  text-align: center; /* 文本居中 */
}
</style>