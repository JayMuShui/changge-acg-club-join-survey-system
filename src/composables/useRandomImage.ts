// 导入 Vue 的 ref 函数，用于创建响应式数据
import { ref } from 'vue';

/**
 * @file useRandomImage.ts
 * @description 这是一个简化版的图片工具，主要用于在网页加载时设置一次随机壁纸，不提供切换或循环功能。
 *              它会根据用户的设备类型（横屏或竖屏）选择不同的图片 API，并利用浏览器的重定向机制来加载图片。
 */
export function useRandomImage() {
  // currentImage 是一个响应式引用，用于存储当前壁纸的 URL
  const currentImage = ref('');

  /**
   * @function getSingleImageApi
   * @description 根据设备的横竖屏状态选择合适的单张图片 API。
   *              横屏设备（如 PC）使用 'moez' 接口，竖屏设备（如移动设备）使用 'moemp' 接口。
   *              这两个接口都会自动重定向到实际的图片 URL。
   */
  const getSingleImageApi = () => {
    // 判断当前窗口宽度是否小于等于 768 像素，以此来粗略判断是否为移动设备
    const isMobile = window.innerWidth <= 768;
    // 根据 isMobile 的值返回不同的 API 地址
    return isMobile 
      ? 'https://t.alcy.cc/moemp' // 移动设备使用 moemp 接口
      : 'https://t.alcy.cc/moez'; // PC 设备使用 moez 接口
  };

  /**
   * @function loadOnceWallpaper
   * @description 仅加载一次壁纸。它会调用 getSingleImageApi 获取 API URL，
   *              然后将该 URL 设置为 currentImage 的值。浏览器会自动处理 API 的重定向，
   *              最终加载到实际的图片。同时，它还会创建一个 Image 对象来测试图片加载是否成功，
   *              如果加载失败（onerror 事件触发），则会在控制台发出警告。
   */
  const loadOnceWallpaper = () => {
    // 获取图片 API 的 URL
    const apiUrl = getSingleImageApi();
    // 将 API URL 直接赋值给 currentImage，浏览器会自动处理重定向并加载图片
    currentImage.value = apiUrl;

    // 创建一个新的 Image 对象，用于测试图片加载情况
    const testImg = new Image();
    testImg.src = apiUrl; // 设置 Image 对象的 src 为 API URL
    // 监听 Image 对象的 onerror 事件，如果图片加载失败，则在控制台输出警告
    testImg.onerror = () => {
      console.warn('API图片服务未响应'); // 警告信息
    };
  };

  // 在 useRandomImage 函数被调用时立即加载一次壁纸
  loadOnceWallpaper();

  // 返回 currentImage，使其可以在组件中被使用和监听
  return { currentImage };
}