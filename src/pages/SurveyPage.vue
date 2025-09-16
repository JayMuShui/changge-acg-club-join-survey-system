<template>
  <div class="container mx-auto p-4 text-center">
    <!-- 欢迎标题 -->
  <h1 v-if="!enteredSurvey" class="text-2xl font-bold mb-4 ">
  🌸长歌动漫社入社问卷系统🌸
  </h1>
    <!-- 问卷组件 -->
    <SurveyCore v-if="enteredSurvey" />
    <!-- 输入密码或规则占位 -->
    <div v-else>
      <!-- 占位文本直接在模板维护 -->
<div v-if="!showInput" class="mb-4 text-green-600">当前注册:长歌动漫社2026届成员招新问卷 <strong>(试行 | 2025-09-17 00:52:06)</strong></div>
<div v-if="!showInput" class="mb-4 text-left">请仔细阅读以下规则后再点击开始填写，若对社团需要更多的了解和部门考虑请点击了解更多：</div>
<div v-if="!showInput" class="mb-4 text-left">
  <ol class="list-decimal pl-5">
    <li>请填写真实的简体中文姓名，避免使用网名或CN等。</li>
    <li>确保班别、性别、手机号、QQ号真实准确，以免影响后续联系。</li>
    <li>填写期间请勿离开或刷新页面，数据暂存于网页缓存，刷新将丢失。</li>
    <li>如收到邀请，将提前获知邀请码。</li>
    <li>提交信息后，在同一页面选择客观题库（至少一项）及期望部门。客观题库由你选择的题库、通识题及社团黑话题混合生成，共 <span class="text-blue-500">50</span> 题，每题 <span class="text-red-500">2</span> 分，总计 <span class="text-red-500">100</span> 分。主观题基于所选部门及通识题目，为考核核心。</li>
    <li class="text-red-600">请勿使用AI或搜索引擎等外部工具答题，答题记录将被追踪。客观题分数仅供我们参考不作为核心考核，<strong>热爱无法量化</strong>。</li>
    <li class="text-yellow-800">本问卷系统于今年起启用，本次试行题库由多人临时制作，难度未完全平衡，建议谨慎选择过多题库，以免影响评分。</li>
    <li>若接受部门调剂，请勾选<span class="text-green-700">调剂部门选择</span>的至少一项，系统将按权重分配其他部门主观题。</li>
    <li>主观题无标准答案，期待你的独特思考！</li>
    <li>因社团经费限制，问卷数据无服务器存储。确认提交后，将生成结果的加密数据为<span class="text-blue-700">你的名字.txt</span>文件下载或直接复制数据。麻烦你妥善保存，请勿修改<span class="text-red-700">（任何改动将导致数据不可读）</span>，并提交至指定负责人。</li>
  </ol>
</div>
      <!-- 密码输入框 -->
      <div v-if="showInput" class="mb-4 text-yellow-600">如收到邀请，将提前获知邀请码。</div>
      <div v-if="showInput" class="mb-4">
        <input
          type="password"
          v-model="inputText"
          placeholder="你应该受到邀请啦~请填写问卷邀请码"
          autocomplete="current-password"
          class="w-full max-w-xs p-2 border border-gray-300 rounded-md text-center"
        />
      </div>

      <!-- 按钮组 -->
      <div v-if="!showInput">
        <button @click="handleStartSurvey" class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-200 transition-all duration-300 hover:scale-105 hover:text-white hover:shadow-xl active:scale-95 active:shadow-md mr-2">
          <span class="relative z-10">开始填写~</span>
          <span class="absolute inset-0 overflow-hidden rounded-md">
            <span class="absolute left-0 aspect-square w-full -translate-x-full rounded-full bg-neutral-800 transition-all duration-300 group-hover:translate-x-0 group-hover:scale-150"></span>
          </span>
        </button>
        <button @click="learnMore" class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-200 transition-all duration-300 hover:scale-105 hover:text-white hover:shadow-xl active:scale-95 active:shadow-md">
          <span class="relative z-10">了解更多..</span>
          <span class="absolute inset-0 overflow-hidden rounded-md">
            <span class="absolute left-0 aspect-square w-full -translate-x-full rounded-full bg-neutral-800 transition-all duration-300 group-hover:translate-x-0 group-hover:scale-150"></span>
          </span>
        </button>
      </div>

      <div v-else>
        <button @click="confirmSurvey" class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-200 transition-all duration-300 hover:scale-105 hover:text-white hover:shadow-xl active:scale-95 active:shadow-md mr-2">
          <span class="relative z-10">确认</span>
          <span class="absolute inset-0 overflow-hidden rounded-md">
            <span class="absolute left-0 aspect-square w-full -translate-x-full rounded-full bg-neutral-800 transition-all duration-300 group-hover:translate-x-0 group-hover:scale-150"></span>
          </span>
        </button>
        <button @click="goBack" class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-200 transition-all duration-300 hover:scale-105 hover:text-white hover:shadow-xl active:scale-95 active:shadow-md">
          <span class="relative z-10">返回</span>
          <span class="absolute inset-0 overflow-hidden rounded-md">
            <span class="absolute left-0 aspect-square w-full -translate-x-full rounded-full bg-neutral-800 transition-all duration-300 group-hover:translate-x-0 group-hover:scale-150"></span>
          </span>
        </button>
      </div>
    </div>
  </div>
  <Copyright />
</template>

<script setup lang="ts">
import Copyright from '../components/Copyright.vue'
import { useRouter } from 'vue-router';
import { inject, ref, onMounted } from 'vue';
import { aes256Decrypt, phoneticSingleToBase64 } from '../utils/aesMeowCrypt.ts';
import SurveyCore from '../components/SurveyCore.vue';

const router = useRouter();

const triggerAnimation = inject('triggerAnimation') as (onShrinkComplete: () => void) => void;
const triggerExpand = inject('triggerExpand') as () => void;
const displayInfo = inject('displayInfo') as (message: string, duration?: number, isDismissible?: boolean) => void;

// 状态控制
const showInput = ref(false)        // 是否显示密码输入框
const enteredSurvey = ref(false)    // 是否已经进入问卷
const inputText = ref('')           // 用户输入的密码

// 加密数据
const surveyPassword = ref('')
const encryptionKey = ref('')

// 初始化加载密码和密钥
onMounted(async () => {
  try {
    const [surveyResponse, keyResponse] = await Promise.all([
      fetch('/_password/after-encrypt.json'),
      fetch('/_password/key.json')
    ]);
    const surveyData = await surveyResponse.json();
    const keyData = await keyResponse.json();
    surveyPassword.value = surveyData.survey;
    encryptionKey.value = keyData.key;
  } catch (error) {
    console.error('[加密核心错误-问卷页] 密钥数据加载失败', error);
    displayInfo('[加密核心错误] 加载数据失败，请联系技术同学，否则无法正常使用系统！ヾ(≧へ≦)〃');
  }
});

// 按钮操作
const handleStartSurvey = () => {
  triggerAnimation(() => {
    showInput.value = true;
    triggerExpand();
  });
}

const confirmSurvey = () => {
  triggerAnimation(() => {
    const storedBase64 = phoneticSingleToBase64(surveyPassword.value);
    const decryptedStoredText = aes256Decrypt(storedBase64, encryptionKey.value);

    if (inputText.value === decryptedStoredText) {
      enteredSurvey.value = true;
      showInput.value = false;
    } else {
      displayInfo('邀请码错误，请重试！(・_・)');
    }
    triggerExpand();
  });
}

const goBack = () => {
  triggerAnimation(() => {
    showInput.value = false;
    inputText.value = '';
    triggerExpand();
  });
}

const learnMore = () => {
  triggerAnimation(() => {
    router.push('/introduce');
    triggerExpand();
  });
}
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>
