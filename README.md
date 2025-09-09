# 长歌动漫社入社问卷系统 changge-acg-club-join-survey-system

## 项目概述

这是一个基于Vue3、Vite、TypeScript、TailwindCSS等构建的社团招新问卷纯前端系统，旨在为桂平市第一中学长歌动漫社提供一个高效、便捷的线上招新问卷平台。系统集成了问卷填写、数据加密、结果审核与社团介绍等功能，确保招新流程的顺畅与数据安全。

同时针对社团实际情况，对桂平市第三中学Joker动漫社制作了一个缅怀的页面，用于展示社团的历史与人物。


[![Github](https://img.shields.io/badge/Github-black?style=for-the-badge&logo=github)](https://github.com/JayMuShui/Chouka-ACG-Club-Join-Survey-System) [![Author-JayMuShui](https://img.shields.io/badge/Author-JayMuShui-00E676?style=for-the-badge&logo=mit)](https://jaymushui.github.io) [![License-MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&logo=mit)](https://opensource.org/licenses/MIT)
[![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)](https://git-scm.com) [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org) [![Pnpm](https://img.shields.io/badge/Pnpm-FF69B4?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-4EC5F1?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org) [![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white)](https://postcss.org) [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-blue?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vue3](https://img.shields.io/badge/Vue3-00796b?style=for-the-badge&logo=vuedotjs)](https://vuejs.org) [![Vite](https://img.shields.io/badge/Vite-20272F?style=for-the-badge&logo=vite)](https://vitejs.dev) 
[![PKG-Crypto.JS](https://img.shields.io/badge/PKG-Crypto.JS-00E676?style=for-the-badge)](https://github.com/brix/crypto-js)[![PKG-GSAP](https://img.shields.io/badge/PKG-GSAP-FF69B4?style=for-the-badge)](https://github.com/greensock/GSAP) 
[![ACG_image-t.alcy.cc](https://img.shields.io/badge/ACG_image-t.alcy.cc-pink?style=for-the-badge)](https://t.alcy.cc) 



## 文件结构说明

本项目主要包含以下目录和文件：

```
src/                # 源代码目录
├── App.vue         # Vue根组件
├── main.ts         # 应用入口文件，Vue应用初始化
├── components/     # 可复用Vue组件
│   ├── AnimatedNumbers.vue # 数字滚动动画组件，用于展示动态变化的数字
│   ├── Copyright.vue       # 版权信息组件，通常显示在页面底部
│   ├── DepartmentDisplay.vue # 部门信息展示组件，用于显示各部门的详细信息
│   ├── LeaderDisplay.vue   # 负责人信息展示组件，用于显示社团负责人的信息
│   ├── PercentageRing.vue  # 百分比环形图组件，用于可视化百分比数据
│   ├── ReviewCore.vue      # 审核核心组件，处理问卷审核逻辑和界面
│   ├── ScrollingNames.vue  # 滚动名称组件，用于展示滚动播放的名称列表
│   ├── SetBackground.vue   # 背景设置组件，用于动态设置页面背景
│   └── SurveyCore.vue      # 问卷核心组件，处理问卷的填写和提交逻辑
├── composables/    # Vue组合式函数，封装可复用逻辑
│   ├── useQABank.ts        # 题库相关逻辑的组合式函数，用于获取和处理题库数据
│   └── useRandomImage.ts   # 随机图片逻辑的组合式函数，用于获取随机背景图片
├── layout/         # 页面布局组件
│   └── CommonLayout.vue # 通用布局组件，用于定义页面的整体结构和样式
├── pages/          # 页面组件
│   ├── GoodNightJokerACGClub.vue # 晚安小丑社页面，可能包含社团介绍或特定活动内容
│   ├── IntroducePage.vue         # 介绍页面，用于展示项目或社团的简介
│   ├── NotFound.vue              # 404页面，当访问的路径不存在时显示
│   ├── ReviewPage.vue            # 审核页面，用于审核问卷提交结果
│   └── SurveyPage.vue            # 问卷页面，用户填写问卷的入口
├── router/         # Vue Router路由配置
│   └── index.ts
├── scripts/        # 辅助脚本
│   └── aesMeowCrypt.cjs # 用于加密解密的CommonJS模块，可能用于后端或Node.js环境
├── styles/         # 全局样式文件
│   └── _index.css  # 项目的全局CSS样式文件
└── utils/          # 工具函数
    └── aesMeowCrypt.ts # 用于加密解密的TypeScript工具函数
```

### public配置目录重要文件格式要求

1.  **加密文件** (`/public/_password/`):
    -   `after-encrypt.json`: 存储加密后的调查问卷内容和审核账号密码，JSON格式。
        ```json
        {
            "survey": "<加密后的调查问卷内容>",
            "review": {
                "account": "<审核账号>",
                "password": "<加密后的审核密码>"
            }
        }
        ```
    -   `key.json`: 存储加密密钥，JSON格式，包含多个随机字符串作为密钥。
    -   这两个文件必须保持完整性，用于系统的安全验证。


2.  **负责人信息** (`/public/leader/`):
    -   `2025-club-leader.json`: 存储2025年社团负责人的信息，JSON格式，是一个数组，每个元素代表一位负责人的详细信息。
        ```json
        [
            {
                "name": "<姓名>",
                "gender": "<性别符号，如♀️或♂️>",
                "avatar": "<头像URL>",
                "qqNumber": <QQ号码>,
                "qqLink": "<QQ联系链接>",
                "position": [
                    "<职位1>",
                    "<职位2>"
                ],
                "class": "<班级>",
                "department": "<所属部门>"
            }
        ]
        ```

3.  **题库文件** (`/public/question-bank/`):
    -   `_meta.json`: 题库的元数据，JSON格式，定义了题库的结构和类型。
        ```json
        {
            "map": {
                "anime": "动画",
                "game": "游戏",
                "commom": "通识",
                "community": "圈子",
                "other-carrier": "其他媒介"
            },
            "meta": [
                {
                    "bank": "<题库英文标识>",
                    "bankName": "<题库中文名称>",
                    "category": "<所属分类，如anime>",
                    "type": "<题目类型，如objective或subjective>",
                    "path": "<题库文件路径>"
                }
            ]
        }
        ```
    -   `_setting.json`: 题库的设置信息，JSON格式，包含题目数量分配等。
        ```json
        {
            "objective": <客观题数量>,
            "subjective": <主观题数量>,
            "department-preferred-choice": <部门偏好选择数量>,
            "department-adjustment-choice": <部门调整选择数量>,
        }
        ```
    -   `objective/`: 存放客观题题库，每个子文件夹（如 `anime`, `commom`, `community`, `game`, `other-carrier`）代表一个具体的客观题分类，内部文件为JSON格式。
    -   `subjective/`: 存放主观题题库，每个子文件夹（如 `commom`, `department-choice`）代表一个具体的主观题分类，内部文件为JSON格式。
    -   所有题库文件必须是JSON格式，并遵循 `_meta.json` 中定义的字段结构。


### 题库文件格式要求

题库文件分为客观题和主观题，分别存储在 `public/question-bank/objective` 和 `public/question-bank/subjective` 目录下。每个文件都是一个 JSON 对象，包含 `bank`、`bank-name` 和 `bank-qa` 字段。

**通用字段：**

- `bank`: 题库的唯一标识符 (String)，通常与文件名相同。
- `bank-name`: 题库的显示名称 (String)。
- `bank-qa`: 题目列表 (Array)，每个元素是一个题目对象。

**题目对象通用字段：**

- `id`: 题目 ID (Number)，在当前题库中唯一。
- `type`: 题目类型 (String)，"objective" 表示客观题，"subjective" 表示主观题。
- `question`: 题目内容 (String)。

**客观题 (`type: "objective"`) 特有字段：**

- `options`: 选项列表 (Array of Strings)，包含所有可选答案。
- `answer`: 正确答案 (String)，必须是 `options` 中的一个。

**客观题示例：**

```json
// public/question-bank/objective/anime/japanese-daily-anime.json
{
    "bank": "japanese-daily-anime",
    "bank-name": "日漫·日常",
    "bank-qa": [
        {
            "id": 1,
            "type": "objective",
            "question": "《轻音少女》中，主角团所在的社团活动室最常出现的饮品是什么？",
            "options": [
                "咖啡",
                "红茶",
                "果汁",
                "牛奶"
            ],
            "answer": "红茶"
        }
    ]
}
```

**主观题 (`type: "subjective"`) 特有字段：**

无

**主观题示例：**

```json
// public/question-bank/subjective/commom/common.json
{
    "bank": "common",
    "bank-name": "通用主观题",
    "bank-qa": [
        {
            "id": 1,
            "type": "subjective",
            "question": "说出你喜欢的一部动漫，并简单说说你喜欢它的什么地方。"
        }
    ]
}
```
## 加密数据说明

1.  **数据加密与解密**：
    -   **问题**：问卷数据和敏感信息（如审核账号密码）需要进行加密存储和传输，以确保数据安全和不被篡改。解密过程也必须可靠，以供后续处理和审核使用。
    -   **解决方案**：本项目使用`aesMeowCrypt.ts`（TypeScript工具函数）通过Crypto.JS使用AES-256-CBC算法进行加密和解密。这个模块提供了统一的加密解密接口，确保数据在不同环境下的安全流转。

  

## 开发指南

>在Node.js环境下操作

   - 项目默认使用pnpm作为包管理器
   - 配置位于`package.json`中的`"packageManager": "pnpm@x.x.x"`
   - 如需更换为npm或yarn等其他包管理器，请先删除`package.json`中的`packageManager`字段
   - 然后运行`rm -rf node_modules && rm pnpm-lock.yaml`清除原有依赖
   - 最后使用新的包管理器重新安装依赖（如`npm install`或`yarn install`）

1.  安装依赖:
    ```bash
    pnpm install
    ```

2.  运行开发服务器:
    ```bash
    pnpm dev
    ```

3.  构建生产版本:
    ```bash
    pnpm build
    ```


### 开发指南核心问题与改进建议

1.  **`SurveyCore.vue` 和 `ReviewCore.vue` 组件职责过重**：
    -   **问题**：`SurveyCore.vue`（问卷核心组件）和 `ReviewCore.vue`（审核核心组件）的代码行数都非常庞大（分别为近1600行和近800行，包含注释），且两者之间存在大量趋同的逻辑和样式。这导致组件难以维护、复用性差，且不符合单一职责原则。
    -   **改进建议**：
        -   **拆分组件**：将这两个核心组件拆分为更小、更具单一职责的子组件。例如：
            -   `SurveyCore.vue` 可以拆分为 `BasicInfoForm.vue`（基础信息填写）、`DepartmentSelection.vue`（部门选择）、`QuestionnaireContent.vue`（问卷内容展示）、`SubmissionConfirmation.vue`（提交确认）等。
            -   `ReviewCore.vue` 可以拆分为 `FileUpload.vue`（文件上传）、`DataDecryption.vue`（数据解密）、`OverviewDisplay.vue`（概览展示）、`ObjectiveReview.vue`（客观题审阅）、`SubjectiveReview.vue`（主观题审阅）等。
        -   **逻辑复用**：提取两者之间趋同的逻辑和样式，封装成独立的组合式函数（Composables）或工具函数，以提高代码复用性并减少冗余。
        -   **状态管理**：对于跨组件共享的状态，可以考虑引入更完善的状态管理方案（如Vuex或Pinia），以更好地管理复杂数据流。
        -   **样式优化**：审查并优化重复的样式代码，利用TailwindCSS的优势，确保样式的一致性和可维护性。

通过上述改进，可以显著提升项目的可维护性、可扩展性和开发效率。




