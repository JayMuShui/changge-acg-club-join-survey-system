// 问卷核心组件 - 近 1600 行代码
// 此文件本身负担过大职责的同时与 ReviewCore 存在大量趋同逻辑和样式，与预期时的独立使用场景不符
// 未来考虑将其拆分成多个组件，如基础信息、问卷内容、问卷提交等
<template>
  <div class="survey-core">
    <!-- 步骤1: 基础信息填写 -->
    <div v-if="currentStep === 1">
      <h3 class="section-title">请填写以下基础信息哦~ </h3>
      <!-- 表单部分 -->
      <div class="form-section">
        <div class="form-row">
          <label for="userName">姓名：</label>
          <input
            type="text"
            id="userName"
            v-model="userName"
            placeholder="姓和名乖乖放在这哦~"
          />
        </div>
        <div class="class-input-group">
          <label for="gradeNum">班别：</label>
          <div class="grade-input-wrapper">
            <span>20</span>
            <input
              type="text"
              id="gradeNum"
              v-model="gradeNum"
              placeholder="XX"
              maxlength="2"
              min="00"
              max="25"
            />
          <label for="classNum">级</label>
          <input
            type="text"
            id="classNum"
            v-model="classNum"
            placeholder="XX"
            maxlength="2"
            min="1"
            max="99"
          />
          <label>班</label>
            </div>
        </div>
        <div class="gender-selection">
          <label>性别：</label>
          <input type="radio" id="male" value="男" v-model="gender" />
          <label for="male">男</label>
          <input type="radio" id="female" value="女" v-model="gender" />
          <label for="female">女</label>
          <!--仅娱乐选项 不参与实际JS逻辑-->
          <input
            type="radio"
            id="walmartBag"
            @click.prevent="displayInfo('这里是中国~禁止奇奇怪怪的性别！(・_・)')"
          />
          <label for="walmartBag">沃尔玛塑料袋</label>
          <input
            type="radio"
            id="attackHelicopter"
            @click.prevent="displayInfo('这里是中国~禁止奇奇怪怪的性别！(・_・)')"
          />
          <label for="attackHelicopter">武装直升机</label>
        </div>
        <div class="form-row">
          <label for="qqNumber">QQ号：</label>
          <input
            type="text"
            id="qqNumber"
            v-model="qqNumber"
            placeholder="帅锅镁铝我想要你的QQ"
          />
        </div>
        <div class="form-row">
          <label for="phoneNumber">电话号(+86)：</label>
          <input
            type="text"
            id="phoneNumber"
            v-model="phoneNumber"
            placeholder="放心，不会拿来做坏事的"
          />
        </div>
      </div>

      <button @click="nextStep" class="btn">下一步</button>
    </div>

    <!-- 步骤2: 志愿和调剂部门选择及其他题库选择 -->
    <div v-else-if="currentStep === 2">
      <!-- 志愿部门选择区域 -->
      <div class="department-selection">
        <h3 class="section-title">志愿部门</h3>
        <!-- 志愿部门选择提示 -->
        <p class="section-hint">请选择一个您最想加入的部门</p>
        <div class="bank-list grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div v-for="bank in departmentChoiceBanks" :key="bank.bank" class="bank-item">
            <input
              type="radio"
              :id="bank.bank"
              :value="bank"
              name="preferredDepartment"
              @change="selectPreferredDepartment(bank)"
              class="hidden peer"
              :checked="userSelectedBanks.some(b => b.bank === bank.bank && b.choice === 'preferred')"
            />
            <label :for="bank.bank" class="block p-3 border rounded-lg cursor-pointer transition-colors peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50">
              <div class="font-medium">{{ bank.bankName || bank.bank }}</div>
              <div v-if="showBankResponsibleInfo && bank.lastEditPerson" class="text-xs text-gray-500 mt-1">
                ({{ bank.lastEditPerson }} - {{ bank.lastEditTime }})
              </div>
            </label>
          </div>
        </div>
      </div>
      
      <!-- 调剂部门选择区域 (当选择了志愿部门后显示) -->
      <div v-if="showAdjustmentDepartments" class="department-selection mt-6">
        <h3 class="section-title">调剂部门</h3>
        <!-- 调剂部门选择提示 -->
        <p class="section-hint">不接受调剂请留空（可选多个）</p>
        <div class="bank-list grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div v-for="bank in adjustmentDepartments" :key="bank.bank" class="bank-item">
            <input
              type="checkbox"
              :id="'adjustment-' + bank.bank"
              :value="bank"
              @change="selectAdjustmentDepartment(bank)"
              class="hidden peer"
              :checked="userSelectedBanks.some(b => b.bank === bank.bank && b.choice === 'adjustment')"
            />
            <label :for="'adjustment-' + bank.bank" class="block p-3 border rounded-lg cursor-pointer transition-colors peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50">
              <div class="font-medium">{{ bank.bankName || bank.bank }}</div>
              <div v-if="showBankResponsibleInfo && bank.lastEditPerson" class="text-xs text-gray-500 mt-1">
                ({{ bank.lastEditPerson }} - {{ bank.lastEditTime }})
              </div>
            </label>
          </div>
        </div>
      </div>
      
      <!-- 其他题库选择区域 -->
      <div class="bank-selection mt-6">
        <!-- 题库分类循环 -->
        <div v-for="category in availableCategories" :key="category" class="bank-category mb-6">
          <h3 class="section-title">{{ bankMeta.map[category] || category }}</h3>
          <!-- 题库列表 -->
          <div class="bank-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            <div v-for="bank in banksByCategory[category]" :key="bank.bank" class="bank-item">
              <input
                type="checkbox"
                :id="bank.bank"
                :value="bank"
                @change="toggleBankSelection(bank)"
                :checked="userSelectedBanks.includes(bank)"
                class="hidden peer"
              />
              <label :for="bank.bank" class="block p-3 border rounded-lg cursor-pointer transition-colors peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50">
              <div class="font-medium">{{ bank.bankName || bank.bank }}</div>
              <div v-if="showBankResponsibleInfo && bank.lastEditPerson" class="text-xs text-gray-500 mt-1">
                ({{ bank.lastEditPerson }} - {{ bank.lastEditTime }})
              </div>
            </label>
            </div>
          </div>
        </div>
      </div>
      <div class="items-center mb-4 text-center">
        <input type="checkbox" id="showBankInfo" v-model="showBankResponsibleInfo" class="mr-2">
        <label for="showBankInfo" class="text-sm text-gray-600">显示题库负责信息</label>
      </div>
      <button @click="prevStep" class="btn">上一步</button>
      <button @click="nextStep" class="btn">下一步</button>
    </div>

    <!-- 步骤3: 信息确认 -->
    <div v-else-if="currentStep === 3">
      <h2>信息确认</h2>
      <p>请仔细核对以下信息，确认无误后进入下一步。</p>

      <!-- 信息展示区域 -->
      <div class="info-display">
        <!-- QQ头像显示区域 -->
        <div class="avatar-container">
          <img v-if="qqAvatarUrl" :src="qqAvatarUrl" alt="QQ Avatar" class="qq-avatar" />
          <p v-if="qqNumberValid" class="avatar-tip">填写QQ号指向的QQ头像</p>
        </div>
        <!-- 基础信息确认 -->
        <h3>基础信息</h3>
        <p><strong>姓名:</strong> {{ surveyData.name }}</p>
        <p><strong>班别:</strong> {{ surveyData.gradeNum }}级{{ surveyData.classNum }}班</p>
        <p><strong>性别:</strong> {{ surveyData.gender }}</p>
        <p><strong>QQ号:</strong> {{ surveyData.qqNumber }}</p>
        <p><strong>电话号:</strong> {{ surveyData.phoneNumber }}</p>

        <!-- 部门选择确认 -->
        <h3>部门选择</h3>
        <p>
          <strong>志愿部门: </strong>
          {{ userSelectedBanks.find(b => b.choice === 'preferred')?.bankName || '未选择' }}
        </p>
        <p>
          <strong>调剂部门: </strong>
          <span v-if="userSelectedBanks.filter(b => b.choice === 'adjustment').length > 0">
            {{ userSelectedBanks.filter(b => b.choice === 'adjustment').map(b => b.bankName).join(' | ') }}
          </span>
          <span v-else>无</span>
        </p>

        <!-- 题库选择确认 -->
        <h3>选择题库</h3>
        <ul class="selected-banks-list">
          <li v-for="bank in userSelectedBanks.filter(b => !b.choice)" :key="bank.bank">
            {{ bank.bankName }} ({{ bankMeta.map[bank.category] || bank.category }})
          </li>
          <li v-if="userSelectedBanks.filter(b => !b.choice).length === 0">无</li>
        </ul>
      </div>

      <button @click="nextStep" class="btn" :disabled="isLoading">
        <span v-if="isLoading" style="color: green;">{{ loadingText }}</span>
        <span v-else>确认并进入下一步</span>
      </button>
      <button @click="prevStep" class="btn">返回修改</button>
    </div>

    <!-- 步骤4: 客观题答题界面 -->
    <div v-else-if="currentStep === 4" class="objective-question" oncontextmenu="return false" oncopy="return false">
      <!-- 题目头部信息 -->
      <div class="question-header">
        <span class="question-type-tag">客观题 - {{ objectiveQuestions[currentObjectiveQuestionIndex].bankName }}</span>
        <span class="question-number">第 {{ currentObjectiveQuestionIndex + 1 }} / {{ objectiveQuestions.length }} 题</span>
      </div>
      <!-- 题目内容区域 -->
      <div v-if="objectiveQuestions.length > 0" class="question-container">
        <div class="question-content-area">
          <p class="question-text">{{ objectiveQuestions[currentObjectiveQuestionIndex].question }}</p>
          <!-- 选项容器 -->
          <div class="options-container">
            <!-- 选项按钮循环 -->
            <button
              v-for="(option, index) in objectiveQuestions[currentObjectiveQuestionIndex].options"
              :key="objectiveQuestions[currentObjectiveQuestionIndex].id + '-' + option"
              class="option-button"
              :class="{ 'selected': objectiveAnswers.find(ans => ans.id === objectiveQuestions[currentObjectiveQuestionIndex].id && ans.bank === objectiveQuestions[currentObjectiveQuestionIndex].bank)?.selectedOption === option }"
              @click="selectObjectiveOption(option)"
            >
              {{ option }}
            </button>
          </div>
        </div>
          <div class="navigation-buttons">
          <button v-if="currentObjectiveQuestionIndex > 0" @click="prevObjectiveQuestion" class="btn">上一题</button>
          <button v-if="currentObjectiveQuestionIndex < objectiveQuestions.length - 1" @click="nextObjectiveQuestion" class="btn">下一题</button>
          <button v-if="allObjectiveAnswered" @click="nextStep" class="btn">提交客观题</button>
        </div>
        <div class="objective-nav">
          <div
            v-for="(q, index) in objectiveQuestions"
            :key="q.id"
            @click="goToObjectiveQuestion(index)"
            class="question-nav-item"
            :class="{
              'active': currentObjectiveQuestionIndex === index,
              'answered': objectiveAnswers.find(ans => ans.id === q.id && ans.bank === q.bank && ans.selectedOption)
            }"
          >
            {{ index + 1 }}
          </div>
        </div>
      </div>
      <div v-else>
        <p>没有客观题。</p>
      </div>
    </div>

    <!-- 步骤5: 客观题提交确认界面 -->
    <div v-else-if="currentStep === 5">
      <h2 class="section-title">客观题提交确认</h2>
      <p>您已完成所有客观题。提交后将无法修改，是否确认提交？</p>
      <p><del>那我考考你！</del></p>
      <!-- 提交和返回按钮 -->
      <button @click="nextStep" class="btn">确认提交客观题</button>
      <button @click="prevStep" class="btn">返回修改</button>
    </div>

    <!-- 步骤6: 主观题答题界面 -->
    <div v-else-if="currentStep === 6" class="subjective-question" oncontextmenu="return false" oncopy="return false">
      <!-- 题目头部信息 -->
      <div class="question-header">
        <span class="question-type-tag">主观题 - {{ subjectiveQuestions[currentSubjectiveQuestionIndex].bankName }}</span>
        <span class="question-number">第 {{ currentSubjectiveQuestionIndex + 1 }} / {{ subjectiveQuestions.length }} 题</span>
      </div>
      <!-- 题目内容区域 -->
      <div v-if="subjectiveQuestions.length > 0" class="question-container">
        <p class="question-text">{{ subjectiveQuestions[currentSubjectiveQuestionIndex].question }}</p>
        <!-- 答案输入框 -->
        <textarea
          v-model="currentSubjectiveAnswer.text"
          placeholder="请输入你的答案..."
          class="subjective-answer-textarea no-placeholder-outline"
          rows="5"
        />
        <div class="navigation-buttons">
          <button v-if="currentSubjectiveQuestionIndex > 0" @click="prevSubjectiveQuestion" class="btn">上一题</button>
          <button v-if="currentSubjectiveQuestionIndex < subjectiveQuestions.length - 1" @click="nextSubjectiveQuestion" class="btn">下一题</button>
          <button v-if="allSubjectiveAnswered" @click="nextStep" class="btn">提交主观题</button>
        </div>
        <div class="subjective-nav">
          <div
            v-for="(q, index) in subjectiveQuestions"
            :key="q.bank + '-' + q.id"
            @click="goToSubjectiveQuestion(index)"
            class="question-nav-item"
            :class="{
              'active': currentSubjectiveQuestionIndex === index,
              'answered': subjectiveAnswers[index] && subjectiveAnswers[index].text.trim() !== ''
            }"
          >
            {{ index + 1 }}
          </div>
        </div>
      </div>
      <div v-else>
        <p>没有主观题。</p>
      </div>
    </div>

    <!-- 步骤7: 主观题提交确认界面 -->
    <div v-else-if="currentStep === 7">
      <h2 class="section-title">主观题提交确认</h2>
      <p>您已完成所有主观题。提交后将无法修改，是否确认提交？</p>
      <!-- 主观题回顾列表 -->
      <div class="subjective-review-list">
        <div v-for="(q, index) in subjectiveQuestions" :key="q.bank + '-' + q.id" class="subjective-review-item" @click="goToSubjectiveQuestion(index)">
          <p class="review-question-text">{{ q.question }}</p>
          <p class="review-answer-text">{{ subjectiveAnswers[index] ? subjectiveAnswers[index].text : '未作答' }}</p>
        </div>
      </div>
      <!-- 提交和返回按钮 -->
      <button @click="nextStep" class="btn">确认提交主观题</button>
      <button @click="prevStep" class="btn">返回修改</button>
    </div>

    <!-- 步骤8: 结果展示界面 -->
    <div v-else-if="currentStep === 8">
      <div class="result-display">
        <!-- 分数和头像显示 -->
        <div class="score-avatar-row">
          <PercentageRing :percentage="objectiveQuestionsScore" :radius="60" :strokeWidth="10" :size="80" />
          <img v-if="qqAvatarUrl" :src="qqAvatarUrl" alt="QQ Avatar" class="qq-avatar" />
        </div>
        <p class="score-label">客观题部分分数</p>
        <!-- 结果提示文本 -->
        <p class="result-text">感谢你的参与，{{surveyData.gradeNum}} 级 {{classNum}} 班的 {{ userName }} 同学，请妥善保管好您的结果数据，显示为大量口字旁的汉字即为正确格式(笑)，任何修改都会导致无法读取，及时提交给负责人哦~</p>
        <!-- 加密数据输出框 -->
        <textarea class="encrypted-output" v-model="encryptedData" readonly></textarea>
        <!-- 操作按钮 (复制、下载、了解社团) -->
        <!-- 查看错题按钮 -->
        <button @click="toggleWrongQuestions" class="btn">查看错题</button>
        <!-- 错题列表 (过渡动画) -->
        <Transition name="fade-slide-up">
          <div v-if="showWrongQuestions" class="wrong-questions-container">
          <div v-for="(q, index) in wrongQuestions" :key="index" class="wrong-question-item">
            <p class="question-text">{{ index + 1 }}. {{ q.question }} <span class="bank-source">({{ q.bankName }})</span></p>
            <p class="correct-answer">正确答案: {{ q.correctAnswer }}</p>
            <p class="user-answer">你的答案: {{ q.userAnswer }}</p>
          </div>
          </div>
        </Transition>
        <div class="button-row">
          <button @click="copyToClipboard" class="btn">复制</button>
          <button @click="downloadFile" class="btn">下载</button>
          <button v-if="showLearnMoreButton" @click="learnMore" class="btn">返回</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, inject, computed } from "vue"
import { useRouter } from 'vue-router';

const router = useRouter();
import { aes256Encrypt , base64ToPhoneticSingle } from "../utils/aesMeowCrypt"
import { useQABank } from "../composables/useQABank"
import PercentageRing from "./PercentageRing.vue"

const { bankMeta, generateBankMeta, drawRandomQuestions, getAllQuestionsInBank } = useQABank()

const objectiveQuestions = ref<any[]>([])
const subjectiveQuestions = ref<any[]>([])
const selectedBanks = ref<any[]>([])
const userSelectedBanks = ref<any[]>([]) // 新增：用户手动选择的题库
const showBankResponsibleInfo = ref(false); // 控制是否显示题库负责人信息

const departmentChoiceBanks = computed(() => {
  return bankMeta.value.meta.filter(meta => 
    meta.category === 'department-choice' && meta.type === 'subjective'
  )
})

const showAdjustmentDepartments = computed(() => {
  return userSelectedBanks.value.some(bank => bank.choice === 'preferred')
})

const adjustmentDepartments = computed(() => {
  const preferredBank = userSelectedBanks.value.find(bank => bank.choice === 'preferred')?.bank
  return departmentChoiceBanks.value.filter(bank => bank.bank !== preferredBank)
})

const availableCategories = computed(() => {
  const categories = new Set<string>()
  bankMeta.value.meta.forEach(meta => {
    if (!meta.required && meta.category !== 'department-choice') { // 只添加非必做题和非部门选择题的分类
      categories.add(meta.category)
    }
  })
  return Array.from(categories)
})

const banksByCategory = computed(() => {
  const grouped: { [key: string]: any[] } = {}
  bankMeta.value.meta.forEach(meta => {
    // 过滤掉 required 为 true 的题库和 category 为 'department-choice' 的题库，这些题库不应该在选择界面显示
    if (meta.required || meta.category === 'department-choice') return
    if (!grouped[meta.category]) {
      grouped[meta.category] = []
    }
    grouped[meta.category].push(meta)
  })
  return grouped
})

const selectPreferredDepartment = (bank: any) => {
  // 移除之前选择的志愿部门
  userSelectedBanks.value = userSelectedBanks.value.filter(b => b.choice !== 'preferred')
  // 移除所有调剂部门
  userSelectedBanks.value = userSelectedBanks.value.filter(b => b.choice !== 'adjustment')
  // 添加新的志愿部门
  userSelectedBanks.value.push({
    ...bank,
    choice: 'preferred'
  })
}

const selectAdjustmentDepartment = (bank: any) => {
  const index = userSelectedBanks.value.findIndex(b => b.bank === bank.bank && b.choice === 'adjustment')
  if (index > -1) {
    userSelectedBanks.value.splice(index, 1)
  } else {
    userSelectedBanks.value.push({
      ...bank,
      choice: 'adjustment'
    })
  }
}

const toggleBankSelection = (bank: any) => {
  const index = userSelectedBanks.value.findIndex(b => b.bank === bank.bank && !b.choice)
  if (index > -1) {
    userSelectedBanks.value.splice(index, 1)
  } else {
    userSelectedBanks.value.push(bank)
  }
}

const displayInfo = inject("displayInfo") as (
  message: string,
  duration?: number,
  isDismissible?: boolean
) => void

const triggerAnimation = inject("triggerAnimation") as (onShrinkComplete: () => void) => void
const triggerExpand = inject("triggerExpand") as () => void
const scrollToTop = inject("scrollToTop") as () => void

const userName = ref("")
const gradeNum = ref("")
const classNum = ref("")
const gender = ref("男")
const currentStep = ref(1)
const surveyData = ref<{ [key: string]: any }>({ })

const qqNumberValid = computed(() => {
  return /^[1-9][0-9]{4,10}$/.test(surveyData.value.qqNumber);
});

const qqAvatarUrl = computed(() => {
  if (qqNumberValid.value) {
    return `https://q.qlogo.cn/g?b=qq&nk=${surveyData.value.qqNumber}&s=640`;
  } else {
    return null;
  }
});
const encryptedData = ref("")
const objectiveQuestionsScore = ref(0)
const showLearnMoreButton = ref(false)
const showWrongQuestions = ref(false)
const encryptionKey = ref("")
const isLoading = ref(false)
const loadingText = ref("正在加载题目.")

// 新增 QQ 和电话
const qqNumber = ref("")
const phoneNumber = ref("")

// 答题相关状态
const currentObjectiveQuestionIndex = ref(0);
const currentSubjectiveQuestionIndex = ref(0);

// 修复：初始化时每题独立对象
const objectiveAnswers = ref<any[]>([]);
interface SubjectiveAnswer {
  id: number;
  bank: string;
  text: string;
}

const subjectiveAnswers = ref<SubjectiveAnswer[]>([]);


const allObjectiveAnswered = computed(() =>
  objectiveQuestions.value.length > 0 &&
  objectiveQuestions.value.every(q =>
    objectiveAnswers.value.some(
      ans => ans.id === q.id && ans.bank === q.bank && ans.selectedOption
    )
  )
);
const currentSubjectiveAnswer = computed({
  get: () => {
    return subjectiveAnswers.value[currentSubjectiveQuestionIndex.value] || { id: 0, bank: '', text: '' };
  },
  set: (val) => {
    subjectiveAnswers.value[currentSubjectiveQuestionIndex.value] = val;
  }
});



const allSubjectiveAnswered = computed(() =>
  subjectiveQuestions.value.length > 0 &&
  subjectiveQuestions.value.every(q =>
    subjectiveAnswers.value.some(ans => ans.id === q.id && ans.bank === q.bank && ans.text && ans.text.trim() !== "")
  )
);

const wrongQuestions = computed(() => {
  const wrong: any[] = [];
  if (surveyData.value.selectedBanks) {
    surveyData.value.selectedBanks.forEach((bank: any) => {
      if (bank.type === 'objective' && bank.answers) {
        bank.answers.forEach((answer: any) => {
          if (!answer.correct) {
            const originalQuestion = objectiveQuestions.value.find(q => q.id === answer.id && q.bank === bank.bank);
            if (originalQuestion) {
              wrong.push({
                question: originalQuestion.question,
                options: originalQuestion.options,
                correctAnswer: originalQuestion.answer,
                userAnswer: answer.selectedOption,
                bankName: originalQuestion.bankName
              });
            }
          }
        });
      }
    });
  }
  return wrong;
});


const selectObjectiveOption = (option: string) => {
  const currentQuestion = objectiveQuestions.value[currentObjectiveQuestionIndex.value];
  const answerIndex = objectiveAnswers.value.findIndex(ans => ans.id === currentQuestion.id && ans.bank === currentQuestion.bank);
  if (answerIndex !== -1) {
    objectiveAnswers.value[answerIndex].selectedOption = option;
    objectiveAnswers.value[answerIndex].correct = option === currentQuestion.answer;
  } else {
    objectiveAnswers.value.push({
      id: currentQuestion.id,
      bank: currentQuestion.bank,
      selectedOption: option,
      correct: option === currentQuestion.answer,
    });
  }
};

const prevObjectiveQuestion = () => {
  triggerAnimation(() => {
    if (currentObjectiveQuestionIndex.value > 0) {
      currentObjectiveQuestionIndex.value--;
    }
  });
};

const prevSubjectiveQuestion = () => {
  triggerAnimation(() => {
    if (currentSubjectiveQuestionIndex.value > 0) {
      currentSubjectiveQuestionIndex.value--;
    }
  });
};

const nextSubjectiveQuestion = () => {
  triggerAnimation(() => {
    if (currentSubjectiveQuestionIndex.value < subjectiveQuestions.value.length - 1) {
      currentSubjectiveQuestionIndex.value++;
    }
  });
};

const nextObjectiveQuestion = () => {
  triggerAnimation(() => {
    if (currentObjectiveQuestionIndex.value < objectiveQuestions.value.length - 1) {
      currentObjectiveQuestionIndex.value++;
    }
  });
};

// 方法：跳转到指定客观题
const goToObjectiveQuestion = (index: number) => {
  triggerAnimation(() => {
    currentObjectiveQuestionIndex.value = index;
  });
};

// 方法：跳转到指定主观题
const goToSubjectiveQuestion = (index: number) => {
  triggerAnimation(() => {
    currentSubjectiveQuestionIndex.value = index;
    currentStep.value = 6; // 在动画完成后切换到主观题页面
  });
};

const loadEncryptionKey = async () => {
  try {
    const response = await fetch("/_password/key.json")
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const data = await response.json()
    encryptionKey.value = data.key
  } catch (err) {
    console.error("[加密核心错误-问卷核心] 加载解密密钥失败", err)
    displayInfo("[加密核心错误] 解密密钥加载失败，请联系技术同学！否则无法保证填写的问卷数据保存正确(°ｰ°)")
  }
}

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (Object.keys(surveyData.value).length > 1 || surveyData.value.name) {
    event.preventDefault()
  }
}



const nextStep = async () => {
  triggerAnimation(async () => {
    if (currentStep.value === 1) {
      // 验证姓名是否为空
      if (userName.value.trim() === "") {
        displayInfo("不愿意把名字告诉我吗！(｡_｡)")
        return
      }
      // 验证姓名是否只包含汉字
      if (!/^[\u4e00-\u9fa5]+$/.test(userName.value.trim())) {
        displayInfo("这里只能用汉字哦~(・_・)")
        return
      }

      const classNumValue = parseInt(classNum.value);
      const gradeNumValue = parseInt(gradeNum.value);
      if (isNaN(gradeNumValue) || gradeNumValue < 0 || gradeNumValue > 25) {
        displayInfo("年级请填写正确的数字哦~(・_・)");
        return;
      }
      
      if (isNaN(classNumValue) || classNumValue < 1 || classNumValue > 99) {
        displayInfo("班级号请填写正确的数字哦~(・_・)");
        return;
      }

      if (!/^\d+$/.test(qqNumber.value.trim())) {
        displayInfo("QQ号格式不对哦~(・_・)")
        return
      }


      if (!/^1\d{10}$/.test(phoneNumber.value.trim())) {
        displayInfo("电话号格式不对哦~(・_・)")
        return
      }

      surveyData.value.name = userName.value
      surveyData.value.gradeNum = gradeNum.value.length === 2 ? '20' + gradeNum.value : gradeNum.value
      surveyData.value.classNum = parseInt(classNum.value, 10).toString().padStart(2, "0")
      surveyData.value.gender = gender.value
      surveyData.value.qqNumber = qqNumber.value
      surveyData.value.phoneNumber = phoneNumber.value

      currentStep.value = 2
      triggerExpand();
      scrollToTop();
    } else if (currentStep.value === 2) {


  // 校验用户选择的题库是否符合要求
  // 1. 获取所有可选的客观题库（非必做、非部门选择类）
  const allAvailableObjectiveBanks = bankMeta.value.meta.filter(meta => !meta.required && meta.category !== 'department-choice' && meta.type === 'objective');
  // 2. 获取所有可选的主观题库（非必做、非部门选择类）
  const allAvailableSubjectiveBanks = bankMeta.value.meta.filter(meta => !meta.required && meta.category !== 'department-choice' && meta.type === 'subjective');

  // 3. 检查部门选择类题库
  const allAvailableDepartmentChoiceBanks = bankMeta.value.meta.filter(meta => meta.category === 'department-choice');
  const hasDepartmentChoiceBank = allAvailableDepartmentChoiceBanks.length === 0 || userSelectedBanks.value.some(bank => bank.category === 'department-choice');

  // 4. 检查是否选择了客观题库
  const hasObjectiveBank = allAvailableObjectiveBanks.length === 0 || userSelectedBanks.value.some(bank => bank.type === 'objective' && bank.category !== 'department-choice');
  // 5. 检查是否选择了主观题库
  const hasSubjectiveBank = allAvailableSubjectiveBanks.length === 0 || userSelectedBanks.value.some(bank => bank.type === 'subjective' && bank.category !== 'department-choice');

  // 6. 执行校验逻辑并给出相应提示
  if (!hasDepartmentChoiceBank) {
    displayInfo("务必要选择志愿部门哦！(・ω・)");
    return;
  } else if (!hasObjectiveBank && !hasSubjectiveBank) {
    displayInfo("请至少选择一个客观题库和主观题库哦！(・ω・)");
    return;
  } else if (!hasObjectiveBank) {
    displayInfo("请至少选择一个客观题库哦！(・ω・)");
    return;
  } else if (!hasSubjectiveBank) {
    displayInfo("请至少选择一个主观题库哦！(・ω・)");
    return;
  } 
  // 合并用户选择的题库和必做题
  const requiredBanks = bankMeta.value.meta.filter(meta => meta.required);
  selectedBanks.value = [...userSelectedBanks.value, ...requiredBanks];

      let setting = { objective: 0, subjective: 0 };
      try {
        const response = await fetch('/question-bank/_setting.json');
        if (response.ok) {
          setting = await response.json();
        }
      } catch (error) {
        console.warn('[题库配置错误-问卷核心] 无法加载题库，这会导致所有题库均分为不筛选全输出', error);
      }

      const totalObjectiveQuestions = setting.objective;
      const totalSubjectiveQuestions = setting.subjective;
      const departmentPreferredChoiceCount = setting['department-preferred-choice'];
      const departmentAdjustmentChoiceCount = setting['department-adjustment-choice'];

      const objectiveBanks = selectedBanks.value.filter(bank => bank.type === 'objective' && bank.category !== 'department-choice');
      const subjectiveBanks = selectedBanks.value.filter(bank => bank.type === 'subjective' && bank.category !== 'department-choice');
      const departmentChoiceBanks = selectedBanks.value.filter(bank => bank.category === 'department-choice');

      if (objectiveBanks.length > 0) {
        const baseObjectivePerBank = Math.floor(totalObjectiveQuestions / objectiveBanks.length);
        let extraObjective = totalObjectiveQuestions % objectiveBanks.length;

        objectiveBanks.forEach(bank => {
          bank.count = baseObjectivePerBank;
          if (extraObjective > 0) {
            bank.count++;
            extraObjective--;
          }
        });
      }

      if (subjectiveBanks.length > 0) {
        const baseSubjectivePerBank = Math.floor(totalSubjectiveQuestions / subjectiveBanks.length);
        let extraSubjective = totalSubjectiveQuestions % subjectiveBanks.length;

        subjectiveBanks.forEach(bank => {
          bank.count = baseSubjectivePerBank;
          if (extraSubjective > 0) {
            bank.count++;
            extraSubjective--;
          }
        });
      }

      departmentChoiceBanks.forEach(bank => {
        if (bank.choice === 'preferred') {
          bank.count = departmentPreferredChoiceCount;
        } else if (bank.choice === 'adjustment') {
          bank.count = departmentAdjustmentChoiceCount;
        }
      });

      currentStep.value = 3
    } else if (currentStep.value === 3) {
      isLoading.value = true;
      let dotCount = 0;
      const loadingInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        loadingText.value = "正在加载题目" + ".".repeat(dotCount);
      }, 500);

      try {
        // 步骤3：信息确认后的处理逻辑
        // 用户已确认基础信息和题库选择。此步骤将根据用户选择的题库，生成具体的客观题和主观题。
        // surveyData.value 中已包含基础信息和已选择的题库信息。
        const selectedBankInfo: { bank: string; count: number; type: string; choice?: string }[] = [];
        for (const bank of selectedBanks.value) {
          let questions: any[] = [];
          if (bank.type === 'objective') {
            if (bank.count === 0) {
              questions = await getAllQuestionsInBank(bank.bank);
            } else {
              questions = await drawRandomQuestions([bank.bank], bank.count);
            }
            objectiveQuestions.value.push(...questions.map((q: any) => ({ ...q, bank: bank.bank, bankName: bank.bankName })));
            // 修复：初始化 objectiveAnswers，每题独立对象
            objectiveAnswers.value = objectiveQuestions.value.map(q => ({ id: q.id, bank: q.bank, selectedOption: null, correct: false }));
          } else if (bank.type === 'subjective') {
            if (bank.count === 0) {
              questions = await getAllQuestionsInBank(bank.bank);
            } else {
              questions = await drawRandomQuestions([bank.bank], bank.count);
            }
            subjectiveQuestions.value.push(...questions.map((q: any) => ({ ...q, bank: bank.bank, bankName: bank.bankName })));
            subjectiveAnswers.value = subjectiveQuestions.value.map(q => ({ id: q.id, bank: q.bank, text: '' }));

          }
          selectedBankInfo.push({
            bank: bank.bank,
            type: bank.type,
            count: bank.count,
            ...(bank.choice && { choice: bank.choice }),
          });
        }

        for (let i = objectiveQuestions.value.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [objectiveQuestions.value[i], objectiveQuestions.value[j]] = [objectiveQuestions.value[j], objectiveQuestions.value[i]];
        [objectiveAnswers.value[i], objectiveAnswers.value[j]] = [objectiveAnswers.value[j], objectiveAnswers.value[i]]; // 同步打乱 objectiveAnswers
      }
      for (let i = subjectiveQuestions.value.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [subjectiveQuestions.value[i], subjectiveQuestions.value[j]] = [subjectiveQuestions.value[j], subjectiveQuestions.value[i]];
      }

      surveyData.value.selectedBanks = selectedBankInfo;
        currentStep.value = 4; // 进入客观题答题界面
    } finally {
      clearInterval(loadingInterval);
      isLoading.value = false;
    }
    } else if (currentStep.value === 4) {
      // 步骤4: 客观题答题界面逻辑
      // 检查所有客观题是否已作答
      if (!allObjectiveAnswered.value) {
        displayInfo("请完成所有客观题再提交哦！(・ω・)");
        return;
      }
      // 遍历客观题答案，将其格式化并存储到 surveyData 中
      objectiveAnswers.value.forEach(answer => {
        // 找到对应的题库索引
        const bankIndex = surveyData.value.selectedBanks.findIndex(bank => bank.bank === answer.bank);
        if (bankIndex !== -1) {
          // 如果该题库还没有答案数组，则初始化
          if (!surveyData.value.selectedBanks[bankIndex].answers) {
            surveyData.value.selectedBanks[bankIndex].answers = [];
          }
          // 格式化答案对象
          const formattedAnswer: { id: number; correct: boolean; selectedOption?: string } = {
            id: answer.id,
            correct: answer.correct,
          };
          // 如果有选择的选项，则添加
          if (answer.selectedOption) {
            formattedAnswer.selectedOption = answer.selectedOption;
          }
          // 将格式化后的答案添加到对应题库的答案数组中
          surveyData.value.selectedBanks[bankIndex].answers.push(formattedAnswer);
        }
      });
      currentStep.value = 5; // 进入客观题提交确认界面
    } else if (currentStep.value === 5) {
      // 步骤5：客观题提交确认
      // 判断是否存在主观题
      if (subjectiveQuestions.value.length > 0) {
        // 如果有主观题，则进入主观题答题界面
        currentStep.value = 6;
      } else {
        // 如果没有主观题，则直接进入结果展示界面
        currentStep.value = 8;
      }
    } else if (currentStep.value === 6) {
      // 步骤6：主观题答题界面逻辑
      // 检查所有主观题是否已作答
      if (!allSubjectiveAnswered.value) {
        displayInfo("请完成所有主观题再提交哦！(・ω・)");
        return;
      }
      // 遍历主观题答案，将其格式化并存储到 surveyData 中
      subjectiveAnswers.value.forEach(answer => {
        // 检查答案是否存在且不为空
        if (answer.text && answer.text.trim() !== "") {
          // 找到对应的题库索引
          const bankIndex = surveyData.value.selectedBanks.findIndex(bank => bank.bank === answer.bank);
          if (bankIndex !== -1) {
            // 如果该题库还没有答案数组，则初始化
            if (!surveyData.value.selectedBanks[bankIndex].answers) {
              surveyData.value.selectedBanks[bankIndex].answers = [];
            }
            // 将格式化后的答案添加到对应题库的答案数组中
            surveyData.value.selectedBanks[bankIndex].answers.push({
              id: answer.id,
              text: answer.text,
            });
          }
        }
      });
      

      currentStep.value = 7; // 进入主观题提交确认界面
    } else if (currentStep.value === 7) {
      // 从主观题提交确认页进入结果展示界面
      let score = 0;
      surveyData.value.selectedBanks.forEach((bank: any) => {
        if (bank.type === 'objective' && bank.answers) {
          bank.answers.forEach((answer: any) => {
            if (answer.correct) {
              score += 2;
            }
          });
        }
      });
      objectiveQuestionsScore.value = score;
      surveyData.value.objectiveQuestionsScore = score; // 将分数写入 surveyData
      encryptedData.value = JSON.stringify(base64ToPhoneticSingle(aes256Encrypt(JSON.stringify(surveyData.value), encryptionKey.value))).replace(/"/g, '');
      currentStep.value = 8; // 直接进入结果展示界面
    } 
    triggerExpand();
    scrollToTop();
  })
}

// prevStep 函数：返回上一步骤
const prevStep = () => {
  // 触发动画效果
  triggerAnimation(() => {
    // 根据当前步骤执行不同的返回逻辑
    if (currentStep.value === 2) {
      // 从步骤2（志愿和调剂部门选择及其他题库选择）返回到步骤1（基础信息填写）
      currentStep.value = 1;
    } else if (currentStep.value === 3) {
      // 从步骤3（信息确认）返回到步骤2（志愿和调剂部门选择及其他题库选择）
      currentStep.value = 2;
      // 清除已加载的题目和已选择的非必做题库，避免缓存问题
      objectiveQuestions.value = [];
      subjectiveQuestions.value = [];
      selectedBanks.value = selectedBanks.value.filter(bank => bank.required); // 只保留必做题库
    } else if (currentStep.value === 4) {
      // 从步骤4（客观题答题）返回到步骤3（信息确认）
      currentStep.value = 3;
    } else if (currentStep.value === 5) {
      // 从步骤5（客观题提交确认）返回到步骤4（客观题答题）
      currentStep.value = 4;
    } else if (currentStep.value === 6) {
      // 从步骤6（主观题答题）返回到步骤5（客观题提交确认）
      currentStep.value = 5;
    } else if (currentStep.value === 7) {
      // 从步骤7（主观题提交确认）返回到步骤6（主观题答题）
      currentStep.value = 6;
    }
    // 触发界面展开动画
    triggerExpand();
    // 滚动到页面顶部
    scrollToTop();
  });
};

// copyToClipboard 函数：将加密数据复制到剪贴板
const copyToClipboard = async () => {
  try {
    // 尝试将加密后的数据写入用户的剪贴板
    await navigator.clipboard.writeText(encryptedData.value);
    // 复制成功后，向用户显示提示信息
    displayInfo("剪贴板已经被我塞入加密数据啦！粘贴到收集的地方哦~(・ｖ・)");
    // 显示“了解更多”按钮
    showLearnMoreButton.value = true;
  } catch (err) {
    // 如果复制失败（例如，由于浏览器安全限制），则捕获错误并打印到控制台
    console.error("[浏览器限制]复制失败:", err);
    // 向用户显示复制失败的提示信息
    displayInfo("复制失败了，可能是浏览器限制，请手动复制一下。（＞人＜；）");
  }
};

// downloadFile 函数：将加密数据下载为文件
const downloadFile = () => {
  // 检查用户名是否为空，如果为空则提示用户输入名字
  if (!userName.value) {
    displayInfo("请输入您的名字才能下载文件！(｡_｡)");
    return;
  }
  // 构建文件名，格式为“用户名.txt”
  const filename = `${userName.value}.txt`;
  // 创建一个 Blob 对象，包含加密数据，类型为纯文本 ，此处同时移除双引号
  const blob = new Blob([encryptedData.value.replace(/"/g, '')], { type: "text/plain" });
  // 创建一个 URL，指向 Blob 对象
  const url = URL.createObjectURL(blob);
  // 创建一个临时的 <a> 元素
  const a = document.createElement("a");
  // 设置 <a> 元素的 href 属性为 Blob URL
  a.href = url;
  // 设置 <a> 元素的 download 属性为文件名，触发下载
  a.download = filename;
  // 显示“了解更多”按钮
  showLearnMoreButton.value = true;
  // 将 <a> 元素添加到文档体中
  document.body.appendChild(a);
  // 模拟点击 <a> 元素，触发文件下载
  a.click();
  // 从文档体中移除临时的 <a> 元素
  document.body.removeChild(a);
  // 释放 Blob URL，避免内存泄漏
  URL.revokeObjectURL(url);
  // 向用户显示文件下载成功的提示信息
  displayInfo("文件下载到你的设备啦！(・∀・)");
};

// toggleWrongQuestions 函数：切换错题显示状态
const toggleWrongQuestions = () => {
  // 切换 showWrongQuestions 的布尔值，控制错题的显示与隐藏
  showWrongQuestions.value = !showWrongQuestions.value;
  // 注意：此处的逻辑仅切换显示状态，实际的错题筛选逻辑可能在其他地方或在显示时动态计算。
};

// learnMore 函数：导航到介绍页面
const learnMore = () => {
  // 触发动画效果
  triggerAnimation(() => {
    // 导航到 '/introduce' 路由
    router.push('/introduce');
    // 触发界面展开动画
    triggerExpand();
  });
};

// onMounted 钩子函数：组件挂载后执行的逻辑
onMounted(async () => {
  // 加载加密密钥
  await loadEncryptionKey();
  // 生成题库元数据，包括客观题和主观题
  const allMeta = await generateBankMeta(['objective', 'subjective']);

  // 筛选出所有必做题库，并将其添加到 selectedBanks 中
  const requiredBanks = allMeta.filter(bank => bank.required);
  selectedBanks.value.push(...requiredBanks);

  // 添加 beforeunload 事件监听器，处理页面卸载前的逻辑
  window.addEventListener("beforeunload", handleBeforeUnload);
});


// onBeforeUnmount 钩子函数：组件卸载前执行的逻辑
onBeforeUnmount(() => {
  // 移除 beforeunload 事件监听器，防止内存泄漏
  window.removeEventListener("beforeunload", handleBeforeUnload);
});
</script>


<style scoped>
/* 结果显示区域样式 */
.result-display {
  display: flex; /* 使用 Flexbox 布局 */
  flex-direction: column; /* 垂直排列子元素 */
  align-items: center; /* 水平居中对齐子元素 */
  gap: 20px; /* 子元素之间的间距 */
  margin-top: 20px; /* 上外边距 */
}


/* 分数和头像行样式 */
.score-avatar-row {
  display: flex; /* 使用 Flexbox 布局 */
  align-items: center; /* 垂直居中对齐子元素 */
  gap: 20px; /* 子元素之间的间距 */
}


/* 结果文本样式 */
.result-text {
  text-align: center; /* 文本居中对齐 */
  max-width: 600px; /* 最大宽度 */
}


/* 分数标签样式 */
.score-label {
  font-size: 0.8em; /* 字体大小 */
  color: #888; /* 字体颜色 */
  margin-top: -10px; /* 上外边距 */
  margin-bottom: 5px; /* 下外边距 */
}


/* 题库选择区域样式 */
.bank-selection {
  max-width: 800px; /* 最大宽度 */
  margin: 0 auto; /* 水平居中 */
  padding: 20px; /* 内边距 */
}


/* 题库分类样式 */
.bank-category {
  margin-bottom: 20px; /* 下外边距 */
}

/* 题库分类标题样式 */
.bank-category h3 {
  margin-top: 0; /* 上外边距 */
  color: #333; /* 字体颜色 */
  border-bottom: 1px solid #ddd; /* 底部边框 */
  padding-bottom: 10px; /* 底部内边距 */
}
/* 题库列表样式 */
.bank-list {
  gap: 10px; /* 子元素之间的间距 */
}

/* 题库项悬停效果 */
.bank-item:hover {
  background-color: #f0f0f0; /* 悬停时背景颜色 */
  transform: scale(1.03); /* 悬停时放大效果 */
}

/* 题库项复选框样式 */
.bank-item input[type="checkbox"] {
  margin-right: 8px; /* 右外边距 */
  transform: scale(1.2); /* 放大效果 */
}

/* 题库项标签样式 */
.bank-item label {
  cursor: pointer; /* 鼠标悬停时显示手型光标 */
  font-weight: 500; /* 字体粗细 */
  color: #333; /* 字体颜色 */
}

/* 题库项复选框选中时标签样式 */
.bank-item input[type="checkbox"]:checked + label {
  color: #007bff; /* 选中时字体颜色 */
}

/* 错题容器样式 */
.wrong-questions-container {
  margin-top: 20px; /* 上外边距 */
  width: 100%; /* 宽度 */
  text-align: left; /* 文本左对齐 */
  border: 1px solid #eee; /* 边框 */
  padding: 15px; /* 内边距 */
  border-radius: 8px; /* 边框圆角 */
}

/* 错题项样式 */
.wrong-question-item {
  margin-bottom: 15px; /* 下外边距 */
  padding-bottom: 15px; /* 下内边距 */
  border-bottom: 1px dashed #ddd; /* 底部虚线边框 */
}


/* 最后一个错题项样式 */
.wrong-question-item:last-child {
  border-bottom: none; /* 移除底部边框 */
  margin-bottom: 0; /* 移除下外边距 */
  padding-bottom: 0; /* 移除下内边距 */
}


/* 错题项问题文本样式 */
.wrong-question-item .question-text {
  font-weight: bold; /* 字体加粗 */
  color: #333; /* 字体颜色 */
  margin-bottom: 5px; /* 下外边距 */
}


/* 错题项题库来源样式 */
.wrong-question-item .bank-source {
  font-size: 0.8em; /* 字体大小 */
  color: #888; /* 字体颜色 */
  font-weight: normal; /* 字体粗细 */
}


/* 错题项正确答案样式 */
.wrong-question-item .correct-answer {
  color: green; /* 字体颜色 */
  font-weight: 500; /* 字体粗细 */
}


/* 错题项用户答案样式 */
.wrong-question-item .user-answer {
  color: red; /* 字体颜色 */
  font-weight: 500; /* 字体粗细 */
}


/* 调查核心区域样式 */
.survey-core {
  display: flex; /* 使用 Flexbox 布局 */
  flex-direction: column; /* 垂直排列子元素 */
  align-items: center; /* 水平居中对齐子元素 */
  padding: 20px; /* 内边距 */
  max-width: 600px; /* 最大宽度 */
  margin: 20px auto; /* 上下外边距 20px，左右自动居中 */
  text-align: center; /* 文本居中对齐 */
}


/* 表单区域样式 */
.form-section {
  display: flex; /* 使用 Flexbox 布局 */
  flex-direction: column; /* 垂直排列子元素 */
  align-items: flex-start; /* 靠左对齐子元素 */
  width: 100%; /* 宽度 */
  text-align: left; /* 文本左对齐 */
}


/* 表单行、班级输入组、性别选择样式 */
.form-row,
.class-input-group,
.gender-selection {
  display: flex; /* 使用 Flexbox 布局 */
  align-items: center; /* 垂直居中对齐子元素 */
  margin-bottom: 20px; /* 下外边距 */
}


/* 文本输入框样式 */
input[type="text"] {
  padding: 5px; /* 内边距 */
  border: 1px solid #ccc; /* 边框 */
  border-radius: 4px; /* 边框圆角 */
}


/* 班级输入组样式 */
.class-input-group {
  display: flex; /* 使用 Flexbox 布局 */
  align-items: center; /* 垂直居中对齐子元素 */
  flex-wrap: nowrap; /* 不换行 */
}


/* 班级输入组标签样式 */
.class-input-group label {
  margin-right: 8px; /* 右外边距 */
  white-space: nowrap; /* 不换行 */
}


/* 班级输入组年级输入框样式 */
.class-input-group input#gradeNum {
  width: 60px; /* 宽度 */
  text-align: center; /* 文本居中对齐 */
}


/* 班级输入组班级输入框样式 */
.class-input-group input#classNum {
  width: 60px; /* 宽度 */
  text-align: center; /* 文本居中对齐 */
}


/* 性别选择输入框样式 */
.gender-selection input {
  margin-left: 10px; /* 左外边距 */
}


/* 按钮行样式 */
.button-row {
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: space-around; /* 子元素平均分布，两端留白 */
  margin-top: 20px; /* 上外边距 */
}


/* 按钮行中的按钮样式 */
.button-row .btn {
  flex: 1; /* 弹性布局，占据可用空间 */
  margin: 0 10px; /* 左右外边距 */
}


/* 信息显示区域样式 */
.info-display {
  /* background-color: #f9f9f9; */ /* 背景颜色（注释掉） */
  border: 1px solid #eee; /* 边框 */
  border-radius: 8px; /* 边框圆角 */
  padding: 20px; /* 内边距 */
  margin-top: 20px; /* 上外边距 */
  text-align: left; /* 文本左对齐 */
  width: 100%; /* 宽度 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* 阴影效果 */
  position: relative; /* 相对定位 */
}
/* 信息显示区域标题样式 */
.info-display h3 {
  color: #333; /* 字体颜色 */
  border-bottom: 1px solid #ddd; /* 底部边框 */
  padding-bottom: 10px; /* 底部内边距 */
  margin-bottom: 15px; /* 下外边距 */
  font-size: 1.2em; /* 字体大小 */
  font-weight: bold; /* 字体加粗 */
}

/* 信息显示区域段落样式 */
.info-display p {
  margin-bottom: 8px; /* 下外边距 */
  line-height: 1.8; /* 行高 */
  font-size: 1.1em; /* 字体大小 */
}
/* 信息显示区域段落中的强调文本样式 */
.info-display p strong {
  color: #555; /* 字体颜色 */
}

/* 问题头部样式 */
.question-header {
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: space-between; /* 子元素两端对齐 */
  align-items: center; /* 垂直居中 */
  margin-bottom: 15px; /* 下外边距 */
  padding-bottom: 10px; /* 底部内边距 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.3); /* 底部边框 */
  }
/* 问题类型标签样式 */
.question-type-tag {
  background-color: rgba(0, 0, 0, 0.2); /* 背景颜色 */
  color: #fff; /* 字体颜色 */
  padding: 5px 10px; /* 内边距 */
  border-radius: 5px; /* 边框圆角 */
  font-size: 0.8em; /* 字体大小 */
  font-weight: bold; /* 字体加粗 */
  opacity: 0.7; /* 透明度 */
}
/* 问题编号样式 */
.question-number {
  font-size: 0.8em; /* 字体大小 */
  font-weight: bold; /* 字体加粗 */
  color: #fff; /* 字体颜色 */
  background-color: rgba(0, 0, 0, 0.3); /* 背景颜色 */
  padding: 5px 10px; /* 内边距 */
  border-radius: 5px; /* 边框圆角 */
  }
/* 问题内容区域样式 */
.question-content-area {
  background-color: rgba(255, 255, 255, 0.05); /* 背景颜色 */
  border-radius: 8px; /* 边框圆角 */
  padding: 20px; /* 内边距 */
  margin-bottom: 20px; /* 下外边距 */
  border: 1px solid rgba(255, 255, 255, 0.2); /* 边框 */
}
/* 主观题回顾列表样式 */
.subjective-review-list {
  margin-top: 20px; /* 上外边距 */
  max-height: 300px; /* 限制最大高度，出现滚动条 */
  overflow-y: auto; /* 垂直方向滚动 */
  padding-right: 10px; /* 右内边距，避免滚动条遮挡内容 */
  max-width: 300px; /* 限制最大宽度 */
  margin: 20px auto 0 auto; /* 上外边距，左右自动，下外边距，实现水平居中 */
}
/* 主观题回顾项样式 */
.subjective-review-item {
  background-color: rgba(255, 255, 255, 0.05); /* 背景颜色 */
  border-radius: 8px; /* 边框圆角 */
  padding: 15px; /* 内边距 */
  margin-bottom: 10px; /* 下外边距 */
  border: 1px solid rgba(255, 255, 255, 0.1); /* 边框 */
  cursor: pointer; /* 鼠标指针样式 */
  transition: background-color 0.3s ease; /* 背景颜色过渡效果 */
}


/* 主观题回顾项悬停样式 */
.subjective-review-item:hover {
  background-color: rgba(255, 255, 255, 0.1); /* 悬停时背景颜色 */
/* 回顾问题文本、回顾答案文本样式 */
}
.review-question-text,
.review-answer-text {
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 溢出隐藏 */
  text-overflow: ellipsis; /* 文本溢出显示省略号 */
  margin-bottom: 5px; /* 下外边距 */
  color: #000; /* 纯黑 */
  font-weight: bold;
}

/* 回顾问题文本样式 */
.review-question-text {
  font-weight: bold; /* 字体加粗 */
}


.review-answer-text {
  font-size: 0.9em;
  opacity: 0.8;
}

.question-text {
  font-size: 1.2em;
  margin-bottom: 15px;
  color: #000; /* 字体颜色设置为黑色 */
  line-height: 1.6;
  color: #000; /* 纯黑 */
  font-weight: bold;
}

.options-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); /* 等宽，最小120px，自动填充 */
  gap: 10px; /* 按钮之间的间距 */
  margin-top: 15px;
}

.option-button {
  background-color: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 15px 10px; /* 调整内边距 */
  cursor: pointer;
  transition: all 0.3s ease;
  color: #000; /* 字体颜色设置为黑色 */
  font-size: 1em;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60px; /* 最小高度，确保等高 */
  word-break: break-word; /* 自动换行 */
}

.option-button:hover {
  background-color: rgba(0, 0, 0, 0.2);
  border-color: #42b983;
}

.option-button.selected {
  background-color: #42b983;
  border-color: #42b983;
  color: white;
  box-shadow: 0 0 15px rgba(66, 185, 131, 0.6); /* 选中状态的阴影 */
  transform: translateY(-3px); /* 选中状态轻微上浮 */
  text-shadow: none; /* 移除文本阴影 */
}
textarea {
  width: calc(100% - 20px);
  padding: 10px;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background-color: rgba(0, 0, 0, 0.1);
  color: #000; /* 字体颜色设置为黑色 */
  font-size: 1em;
  resize: vertical;
  min-height: 100px;
}

textarea::placeholder {
  color: #ccc;
}
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.navigation-buttons .btn {
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: white;
}

.navigation-buttons .btn:first-child {
  margin-right: auto;
}
.navigation-buttons .btn:last-child {
  margin-left: auto;
}

.info-display strong {
  color: #333;
}

.avatar-container {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.qq-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #007bff;
  object-fit: cover;
}

.avatar-tip {
  font-size: 0.5em;
  color: #777;
  margin-top: 5px;
  text-align: center;
  max-width: 100px;
}

.selected-banks-list {
  list-style: none;
  padding: 0;
  margin-top: 10px;
}
.selected-banks-list li {
  background-color: #e9e9e9;
  border-left: 4px solid #0056b3;
  padding: 10px 15px;
  margin-bottom: 8px;
  border-radius: 5px;
  font-size: 1em;
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

.objective-nav,
.subjective-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.question-nav-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px; /* 固定宽度 */
  height: 35px; /* 固定高度 */
  margin: 5px; /* 间距 */
  background-color: rgba(255, 255, 255, 0.1); /* 默认背景 */
  border: 1px solid rgba(255, 255, 255, 0.3); /* 边框 */
  border-radius: 50%; /* 圆形 */
  color: #eee; /* 默认文字颜色 */
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 阴影 */
}

.question-nav-item:hover {
  background-color: rgba(255, 255, 255, 0.2); /* 悬停背景 */
  border-color: #42b983; /* 悬停边框颜色 */
  transform: translateY(-2px); /* 悬停上浮 */
}

.question-nav-item.active {
  background-color: #42b983; /* 选中背景 */
  border-color: #42b983; /* 选中边框颜色 */
  color: #fff; /* 选中文字颜色 */
  box-shadow: 0 0 10px rgba(66, 185, 131, 0.7); /* 选中阴影 */
  transform: scale(1.1); /* 选中放大 */
}

.question-nav-item.answered {
  background-color: rgba(66, 185, 131, 0.3); /* 已答背景 */
  border-color: rgba(66, 185, 131, 0.5); /* 已答边框 */
}

.question-nav-item.answered.active {
  background-color: #42b983; /* 已答且选中背景 */
  border-color: #42b983; /* 已答且选中边框 */
}

.encrypted-output {
  width: 100%;
  height: 200px;
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-family: "Courier New", Courier, monospace;
  resize: vertical;
}

.fade-slide-up-enter-active,
.fade-slide-up-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-slide-up-enter-from,
.fade-slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>