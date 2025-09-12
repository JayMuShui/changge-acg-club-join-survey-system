<template>
  <div class="container mx-auto p-4 text-center">
    <h1 v-if="!enteredReview" class="text-2xl font-bold mb-4 ">
      🌸内部审核系统🌸
    </h1>
    <div v-if="enteredReview">
      <ReviewCore />
    </div>
    <div v-else>
      <div class="mb-4">
        <input
          type="text"
          v-model="inputAccount"
          placeholder="这里填账户名(´▽`ʃ♡ƪ)"
          autocomplete="username"
          class="w-full max-w-xs p-2 border border-gray-300 rounded-md text-center mb-2"
        />
        <input
          type="password"
          v-model="inputText"
          placeholder="这里填密码(๑•̀ㅂ•́)و✧"
          autocomplete="current-password"
          class="w-full max-w-xs p-2 border border-gray-300 rounded-md text-center"
        />
      </div>
      <div>
        <button @click="confirmReview" class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-200 transition-all duration-300 hover:scale-105 hover:text-white hover:shadow-xl active:scale-95 active:shadow-md mr-2">
          <span class="relative z-10">确认</span>
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
import { ref, inject, onMounted } from 'vue';
import ReviewCore from '../components/ReviewCore.vue';
import { aes256Decrypt, phoneticSingleToBase64 } from '../utils/aesMeowCrypt.ts';

const triggerAnimation = inject('triggerAnimation') as (onShrinkComplete: () => void) => void;
const triggerExpand = inject('triggerExpand') as () => void;
const displayInfo = inject('displayInfo') as (message: string, duration?: number, isDismissible?: boolean) => void;

const enteredReview = ref(false);
const inputText = ref('');
const inputAccount = ref('');
const reviewPassword = ref('');
const reviewAccount = ref('');
const encryptionKey = ref('');

onMounted(async () => {
    try {
      const [passwordResponse, keyResponse] = await Promise.all([
        fetch('/_password/after-encrypt.json'),
        fetch('/_password/key.json')
      ]);
      const passwordData = await passwordResponse.json();
      const keyData = await keyResponse.json();
      reviewPassword.value = passwordData.review.password;
      reviewAccount.value = passwordData.review.account;
      encryptionKey.value = keyData.key;
      
    } catch (error) {
      console.error('[加密核心错误-审阅页] 密钥数据加载失败', error);
      displayInfo('[加密核心错误] 加载数据失败，请联系技术同学，否则无法正常使用系统！ヾ(≧へ≦)〃');
    }
  });

const confirmReview = () => {
  if (!reviewPassword.value || !encryptionKey.value || !reviewAccount.value) {
    displayInfo('系统数据加载中，请稍后再试！');
    return;
  }
  const storedBase64 = phoneticSingleToBase64(reviewPassword.value);
  const decryptedStoredText = aes256Decrypt(storedBase64, encryptionKey.value);

  if (!inputAccount.value) {
    triggerAnimation(() => {
    displayInfo('请输入账户！( •̀ ω •́ )✧');
    triggerExpand();
  });
    return;
  }

  if (inputAccount.value !== reviewAccount.value) {
    triggerAnimation(() => {
    displayInfo('账户不存在！（；´д｀）ゞ');
    triggerExpand();
  });
    return;
  }

  if (!inputText.value) {
    triggerAnimation(() => {
    displayInfo('请输入密码哦！φ(*￣0￣)');
    triggerExpand();
  });
    return;
  }

  if (inputText.value !== decryptedStoredText) {
    triggerAnimation(() => {
    displayInfo('密码错误，请重试！(・_・)');
    triggerExpand();
  });
    return;
  }

  triggerAnimation(() => {
    enteredReview.value = true;
    triggerExpand();
  });
};

</script>

<style scoped>
.container {
  max-width: 600px;
}

.btn {
  margin: 5px;
  padding: 10px 20px;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.btn:hover {
  background-color: #333;
  transform: scale(1.05);
}

.btn:active {
  transform: scale(0.95);
}
</style>