// useQABank.ts

import { ref } from "vue";

/**
 * @file useQABank.ts
 * @description 这是一个用于管理和操作题库的 Vue Composition API。
 *              它提供了加载题库元数据、加载指定题库内容、随机抽题、按ID查询题目以及获取题库所有题目等功能。
 */

/**
 * @interface Question
 * @description 定义了单个题目的数据结构。
 * @property {number} id - 题目的唯一标识符。
 * @property {string} type - 题目的类型（例如：选择题、填空题）。
 * @property {string} question - 题目的具体内容。
 * @property {string[]} options - 题目的选项列表（如果适用）。
 * @property {string} answer - 题目的正确答案。
 */
interface Question {
  id: number;
  type: string;
  question: string;
  options: string[];
  answer: string;
}

/**
 * @interface BankMeta
 * @description 定义了题库元数据的数据结构，用于描述一个题库的基本信息。
 * @property {string} bank - 题库的文件名。
 * @property {string} bankName - 题库在 JSON 文件内部定义的名称。
 * @property {string} category - 题库所属的一级分类文件夹（例如：'department-oc'）。
 * @property {string} type - 题库的类型文件夹（例如：'objective' 表示客观题，'subjective' 表示主观题）。
 * @property {string} path - 题库文件的相对路径，用于数据获取（fetch）。
 * @property {boolean} [required] - 可选字段，表示该题库是否为必选。
 */
interface BankMeta {
  bank: string;        // 题库的文件名
  bankName: string;    // 题库在 JSON 文件内部定义的名称
  category: string;    // 题库所属的一级分类文件夹
  type: string;        // 题库的类型文件夹，例如 objective、subjective
  path: string;        // 题库文件的相对路径，用于数据获取
  required?: boolean;  // 可选字段，表示该题库是否为必选
  lastEditPerson?: string; // 可选字段，最后编辑人
  lastEditTime?: string;   // 可选字段，最后编辑时间
}

/**
 * @interface MetaData
 * @description 定义了所有题库元数据的集合结构。
 * @property {Record<string, string>} map - 一个映射表，可能用于快速查找题库相关信息。
 * @property {BankMeta[]} meta - 包含所有题库元数据对象的数组。
 */
interface MetaData {
  map: Record<string, string>;
  meta: BankMeta[];
}

/**
 * @function useQABank
 * @description Vue Composition API，提供了管理和操作题库的功能。
 * @returns {object} 返回一个包含响应式数据和操作函数的对象。
 * @property {Ref<MetaData>} bankMeta - 响应式引用，存储所有题库的元数据。
 * @property {Record<string, Question[]>} loadedBanks - 一个对象，用于缓存已加载的题库内容，避免重复加载。
 * @property {function(string[]): Promise<BankMeta[]>} generateBankMeta - 异步函数，用于扫描并生成指定类型的题库元数据。
 * @property {function(string): Promise<Question[]>} loadBank - 异步函数，用于加载指定名称的题库内容到缓存池中。
 * @property {function(string[], number): Promise<Question[]>} drawRandomQuestions - 异步函数，用于从指定题库中混合随机抽取指定数量的题目。
 * @property {function(string, number): Promise<Question | null>} getQuestionById - 异步函数，用于根据题库名称和题目ID查询单个题目。
 * @property {function(string): Promise<Question[]>} getAllQuestionsInBank - 异步函数，用于获取指定题库的所有题目。
 */
export function useQABank() {
  // bankMeta 是一个响应式引用，用于存储所有题库的元数据（map 和 meta 数组）
  const bankMeta = ref<MetaData>({ map: {}, meta: [] });
  // loadedBanks 是一个普通对象，用于缓存已经加载到内存中的题库内容，键是题库名称，值是题目数组
  const loadedBanks: Record<string, Question[]> = {};

  /**
   * @function generateBankMeta
   * @description 自动扫描并生成题库元数据。它会从 `/question-bank/_meta.json` 文件中获取所有元数据，
   *              然后根据传入的 `types` 数组进行过滤，只保留指定类型的题库元数据。
   * @param {string[]} types - 要扫描的题库类型文件夹列表，例如 `['objective', 'subjective']`。
   * @returns {Promise<BankMeta[]>} 返回一个 Promise，解析为过滤后的题库元数据数组。
   */
  async function generateBankMeta(types: string[]) {
    // 从指定路径获取 _meta.json 文件
    const response = await fetch(`/question-bank/_meta.json`);
    // 将响应解析为 JSON 数据，并断言其类型为 MetaData
    const data: MetaData = await response.json();
    
    // 根据传入的 types 数组过滤出符合条件的题库元数据
    const filteredMeta = data.meta.filter(item => types.includes(item.type));
    // 更新 bankMeta 的值，保留原始的 map，更新 meta 数组为过滤后的数据
    bankMeta.value = { map: data.map, meta: filteredMeta };
    // 返回过滤后的元数据数组
    return filteredMeta;
  }

  /**
   * @function loadBank
   * @description 加载指定名称的题库内容到缓存池中。如果题库已经加载过，则直接返回缓存中的数据。
   *              否则，它会根据 `bankMeta` 查找题库的路径，然后通过 fetch 获取题库的 JSON 内容，
   *              并将其存储到 `loadedBanks` 缓存中。
   * @param {string} bank - 要加载的题库名称。
   * @returns {Promise<Question[]>} 返回一个 Promise，解析为指定题库的题目数组。
   * @throws {Error} 如果找不到指定的题库元数据，则抛出错误。
   */
  async function loadBank(bank: string) {
    // 如果题库已经加载过，直接返回缓存中的数据
    if (loadedBanks[bank]) return loadedBanks[bank];

    // 在 bankMeta 中查找与传入 bank 名称匹配的题库元数据
    const meta = bankMeta.value.meta.find(b => b.bank === bank);
    // 如果没有找到对应的元数据，则抛出错误
    if (!meta) throw new Error(`Bank ${bank} 未找到，请先生成 bankMeta`);

    // 根据元数据中的路径获取题库的 JSON 文件
    const res = await fetch(`/question-bank/${meta.path}`);
    // 将响应解析为 JSON 数据
    const data = await res.json();
    // 将获取到的题目内容（bank-qa 字段）存储到 loadedBanks 缓存中
    loadedBanks[bank] = data['bank-qa'];
    // 返回加载的题目内容
    return loadedBanks[bank];
  }

  /**
   * @function drawRandomQuestions
   * @description 从指定的题库列表中混合随机抽取指定数量的题目。
   *              它会首先确保所有指定的题库都已加载，然后将所有题目的内容合并到一个池中，
   *              打乱顺序后返回指定数量的题目。
   * @param {string[]} banks - 要从中抽题的题库名称列表。
   * @param {number} count - 要抽取的题目数量。
   * @returns {Promise<Question[]>} 返回一个 Promise，解析为随机抽取的题目数组。
   */
  async function drawRandomQuestions(banks: string[], count: number) {
    // 创建一个空数组，用于存放所有题库的题目
    const pool: Question[] = [];
    // 遍历传入的题库名称列表，加载每个题库的题目并添加到 pool 中
    for (const bank of banks) {
      const questions = await loadBank(bank); // 确保题库已加载
      pool.push(...questions); // 将加载的题目添加到题目池中
    }

    // 使用 Fisher-Yates (Knuth) 洗牌算法打乱题目池的顺序
    const shuffled = pool.sort(() => Math.random() - 0.5);
    // 返回打乱后数组的前 count 个题目
    return shuffled.slice(0, count);
  }

  /**
   * @function getQuestionById
   * @description 根据题库名称和题目ID查询单个题目。
   *              它会首先加载指定的题库，然后在该题库中查找匹配ID的题目。
   * @param {string} bank - 题库名称。
   * @param {number} id - 题目的唯一标识符ID。
   * @returns {Promise<Question | null>} 返回一个 Promise，解析为找到的题目对象，如果未找到则为 `null`。
   */
  async function getQuestionById(bank: string, id: number) {
    // 加载指定题库的所有题目
    const questions = await loadBank(bank);
    // 在加载的题目中查找 ID 匹配的题目，如果找到则返回该题目，否则返回 null
    return questions.find(q => q.id === id) || null;
  }

  /**
   * @function getAllQuestionsInBank
   * @description 获取指定题库的所有题目。
   *              它会首先加载指定的题库，然后返回该题库中的所有题目。
   * @param {string} bank - 题库名称。
   * @returns {Promise<Question[]>} 返回一个 Promise，解析为指定题库的所有题目数组。
   */
  async function getAllQuestionsInBank(bank: string) {
    // 加载指定题库的所有题目
    const questions = await loadBank(bank);
    // 返回加载的题目
    return questions;
  }

  // 返回 useQABank 提供的所有响应式数据和函数，以便在组件中使用
  return {
    bankMeta, // 题库元数据
    generateBankMeta, // 生成题库元数据函数
    loadBank, // 加载题库函数
    drawRandomQuestions, // 混合抽题函数
    getQuestionById, // 按 ID 查询题目函数
    getAllQuestionsInBank // 获取指定题库所有题目函数
  };
}
