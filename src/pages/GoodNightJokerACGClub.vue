<template>
  <div class="flex justify-between items-center w-full px-4">
    <!-- 返回介绍页面的链接 -->
    <a @click="goToIntroducePage" class="joker-club-link">
      让我们返回长歌动漫社吧
    </a>
  </div>
  <!-- 页面主要内容容器 -->
  <div class="container mx-auto p-4 text-center">
    <!-- 标题和Logo区域 -->
    <div class="flex items-center justify-center mb-4">
      <div class="flex flex-col items-center">
         <!-- Joker动漫社成立天数标题，使用AnimatedNumbers组件显示动态数字 -->
         <h1 class="text-2xl font-bold">关于桂平市第三中学Joker动漫社的<AnimatedNumbers :numbers="4317" />天</h1>
         <!-- Joker动漫社Logo -->
         <img src="/joker-acg-club/favicon.webp" alt="Logo" class="h-40 w-40 mt-4" />
       </div>
    </div>
    <!-- 网易云音乐播放器嵌入 -->
    <div class="flex items-center justify-center mb-4">
    <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=880 height=86 src="//music.163.com/outchain/player?type=2&id=689657&auto=1&height=66"></iframe>
    </div>
    <!-- 社团介绍段落1 -->
    <p class="mb-4 text-indent-2em">桂平市第三中学Joker动漫社，肇始于2013年11月5日，堪称桂平市高中ACG社团之先声。其诞生于中国大陆二次元文化尚未全然兴盛的年代，以一腔热忱点燃了本地动漫爱好者的星火，不仅引领风气之先，更深刻启迪了桂平市其他高中，促成其各自ACG社团的相继萌芽。放眼桂平，这座承载深厚历史底蕴的小城，竟在主要高中间悉数孕育了二次元文化社团，构筑起一片在当时鲜有匹敌的兴趣沃土。此番成就，尤以2010年代中国大陆ACG文化商业模式尚未健全之际，更显难能可贵。Joker动漫社以其独树一帜的文化热情，昂然成为长歌动漫社的姊妹社团之首，堪称姊者。</p>
    <!-- 社团介绍段落2：社团停止活动说明 -->
    <p class="mb-4 text-indent-2em">惜乎，岁月流转，至2025年8月31日，Joker动漫社在第十届领导班子近三年的砥砺维持下，历经4,317日的风雨兼程，终因社团内部运营之艰与学校政策外部掣肘，艰难做出停止活动的决定。其间，社团成员以无尽热忱与坚持，书写了一段属于桂平二次元文化的璀璨篇章，虽暂告段落，然其精神与影响，必将长存于后人之心。</p>
        <!-- 感谢标题 -->
        <h2 class="text-xl font-bold text-center mb-4"> JOKER动漫社感谢有你们：</h2>
    <!-- 插入滚动名字组件，配置行数和每行数量 -->
    <ScrollingNames 
      :speed="0.8" 
      direction="left" 
      height="220px"
      :rows="4"         
      :itemsPerRow="20" 
      dataUrl="/joker-acg-club/us.json"
    />
    <!-- 社团介绍段落3：与长歌动漫社的情谊 -->
    <p class="mb-4 text-indent-2em">桂平一中长歌动漫社，自2016年肇基以来，与桂平市第三中学Joker动漫社结下深厚情谊，往来密切，共同书写了桂平二次元文化的动人篇章。两社团以志趣相投为纽带，不仅在公开活动中并肩携手，更在私下交往中以真挚情感交融，早已结下不解之缘。回溯2021年，两社团共襄社团联谊派对，欢声笑语间尽显同好之情；至2023年末，长歌动漫社再联合Joker动漫社、浔州高中瞳·无双动漫社等桂平各大高中ACG社团，与MBC动漫嘉年华组委会协力，成功举办首届MBC动漫嘉年华桂平站，盛况空前，为本地二次元文化再添浓墨重彩的一笔。</p>
    <!-- 社团介绍段落4：情谊的延续 -->
    <p class="mb-4 text-indent-2em">早在2010年代初期，桂平各兴趣圈子中，志同道合者便已因共同的ACG爱好相识相知。彼时，长歌与Joker社团成员因其相似的文化属性，于桂平的兴趣土壤中埋下情谊的种子，彼此信任，渐成佳话。此份情分，不仅体现于社团间的默契合作，更流淌于成员私下交往的点滴温情，至今令人感怀。如今，长歌动漫社为纪念Joker动漫社的卓越贡献与不灭精神，以微小而真挚的举动，延续这份跨越时光的信任与幸运，致敬那段共同书写的二次元文化篇章。</p>
    <!-- 社团介绍段落5：未来展望与联系方式 -->
    <p class="mb-4 text-indent-2em">然，Joker动漫社虽暂别舞台，却无需沉湎于全然覆灭的惋惜。社团虽止，精神犹存，正如其名源于扑克牌中的“Joker”，总能在关键时刻翻出制胜之牌，笑傲牌局。历经4317日的文化积淀，未曾随风而逝，而是静待传承。未来，桂平三中任何志趣相投的兴趣小组或社团，皆可接过这份文化衣钵，延续其二次元之魂。若你正是来自桂平三中的热血之人，怀揣才华与梦想，愿你自前辈手中接过这封存的王牌，<a href="https://qm.qq.com/q/7zmq7pckI" target="_blank" class="text-red-500 hover:underline">点击此处联系</a>，复兴社团荣光，重振辉煌篇章！在此之前，桂平一中长歌动漫社将始终铭记姊妹之情，守护Joker之形神！</p>
    
  </div>
  <!-- 页面底部固定信息栏 -->
  <div class="fixed left-0 w-full py-2 text-center text-sm">
    <!-- Joker动漫社Logo和时间范围 -->
    <img src="/joker-acg-club/favicon.webp" alt="Logo" class="inline-block h-6 w-6 mr-2" />
    🕯️ Joker动漫社 2013.11.05 - 2025.08.31 
  </div>
</template>

<!-- 脚本部分 -->
<script setup lang="ts">
// 导入Vue相关功能：依赖注入、路由
import { inject } from 'vue';
import { useRouter } from 'vue-router';
// 导入滚动名字组件
import ScrollingNames from '../components/ScrollingNames.vue';
// 导入动态数字组件
import AnimatedNumbers from '../components/AnimatedNumbers.vue';

// 获取路由实例
const router = useRouter();
// 注入triggerAnimation函数，用于触发动画
const triggerAnimation = inject('triggerAnimation') as (callback: () => void) => void;
// 注入triggerExpand函数，用于触发展开
const triggerExpand = inject('triggerExpand') as () => void;

// 返回介绍页面的方法
const goToIntroducePage = () => {
  // 如果存在triggerAnimation函数，则先触发动画再跳转
  if (triggerAnimation) {
    triggerAnimation(() => {
      router.push('/introduce');
      triggerExpand();
    });
  } else {
    // 否则直接跳转
    router.push('/introduce');
  }
};
</script>

<!-- 样式部分 -->
<style scoped>
/* 返回长歌动漫社链接的样式 */
.joker-club-link {
  color: #007bff; /* 蓝色 */
  text-decoration: underline; /* 下划线 */
  cursor: pointer; /* 鼠标指针样式 */
  font-size: 0.9em; /* 字体大小 */
  transition: color 0.3s ease; /* 颜色过渡效果 */
}

/* 鼠标悬停时的链接颜色 */
.joker-club-link:hover {
  color: #0056b3;
}

/* 媒体查询：当屏幕宽度小于等于640px时 */
@media (max-width: 640px) {
  /* 链接字体大小调整 */
  .joker-club-link {
    font-size: 0.75em;
  }
  /* 顶部flex布局调整 */
  .flex.justify-between.items-center.w-full.px-4 {
    flex-wrap: wrap; /* 允许换行 */
    justify-content: center; /* 居中对齐 */
    gap: 10px; /* 元素间距 */
  }
}

/* 文本首行缩进2em，左对齐 */
.text-indent-2em {
  text-indent: 2em;
  text-align: left;
}
</style>