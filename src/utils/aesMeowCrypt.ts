import CryptoJS from "crypto-js"; // 引入 CryptoJS 库

/**
 * @function padKey
 * @description 对密钥进行填充，使其长度符合 AES-256 的要求（32 字节，即 64 个十六进制字符）。
 *              如果密钥不足 64 个十六进制字符，则在末尾填充 '0'；如果超过，则截断。
 * @param {string} key - 原始密钥字符串。
 * @returns {CryptoJS.lib.WordArray} 填充后的密钥，以 WordArray 形式返回。
 */
function padKey(key: string): CryptoJS.lib.WordArray {
  // 将密钥字符串解析为 UTF-8 编码的 WordArray
  const keyBytes = CryptoJS.enc.Utf8.parse(key);
  // 将 WordArray 转换为十六进制字符串
  const keyHex = keyBytes.toString(CryptoJS.enc.Hex);
  // 填充或截断十六进制字符串至 64 位，然后解析为 WordArray 作为最终密钥
  return CryptoJS.enc.Hex.parse(keyHex.padEnd(64, "0").slice(0, 64));
}

/**
 * @function aes256Encrypt
 * @description 使用 AES-256 CBC 模式和 PKCS7 填充对纯文本进行加密。
 *              加密结果包含 IV（初始化向量）和密文，两者用冒号分隔并以 Base64 编码。
 * @param {string} plaintext - 需要加密的纯文本字符串。
 * @param {string} key - 加密密钥。
 * @returns {string} Base64 编码的 IV 和密文，格式为 "IV:密文"。
 */
export function aes256Encrypt(plaintext: string, key: string): string {
  // 获取填充后的密钥
  const keyUtf8 = padKey(key);
  // 生成一个随机的 16 字节（128 位）IV
  const iv = CryptoJS.lib.WordArray.random(16);

  // 执行 AES 加密操作
  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(plaintext), // 将纯文本解析为 WordArray
    keyUtf8, // 使用填充后的密钥
    { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 } // 配置加密模式和填充方式
  );

  // 将 IV 转换为 Base64 字符串
  const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
  // 将加密结果（密文）转换为 Base64 字符串
  const cipherBase64 = encrypted.toString();

  // 返回 IV 和密文的组合字符串
  return ivBase64 + ":" + cipherBase64;
}

/**
 * @function aes256Decrypt
 * @description 使用 AES-256 CBC 模式和 PKCS7 填充对密文进行解密。
 *              密文应为 "IV:密文" 的 Base64 编码格式。
 * @param {string} cipherText - 需要解密的密文字符串，格式为 "IV:密文"。
 * @param {string} key - 解密密钥。
 * @returns {string} 解密后的纯文本字符串。
 * @throws {Error} 如果密文格式不正确，则抛出错误。
 */
export function aes256Decrypt(cipherText: string, key: string): string {
  // 将密文字符串按冒号分割，获取 IV 和密文部分
  const [ivBase64, cipherBase64] = cipherText.split(":");
  // 检查 IV 和密文是否存在，否则抛出错误
  if (!ivBase64 || !cipherBase64) throw new Error("密文格式错误，无法解析");

  // 将 Base64 编码的 IV 解析为 WordArray
  const iv = CryptoJS.enc.Base64.parse(ivBase64);
  // 获取填充后的密钥
  const keyUtf8 = padKey(key);

  // 执行 AES 解密操作
  const decrypted = CryptoJS.AES.decrypt(
    cipherBase64, // 密文部分
    keyUtf8, // 使用填充后的密钥
    { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 } // 配置解密模式和填充方式
  );

  // 将解密后的 WordArray 转换为 UTF-8 字符串
  return CryptoJS.enc.Utf8.stringify(decrypted);
}

// ---------------- 单汉字 Base64 映射 ----------------
/**
 * @constant phoneticMap
 * @description 一个将 Base64 字符映射到单个汉字（拟声词）的常量对象。
 *              用于将 Base64 编码的字符串转换为更具可读性或趣味性的汉字表示。
 */
const phoneticMap: Record<string, string> = {
  "A": "喵","B": "汪","C": "咩","D": "嗷","E": "哞","F": "哔","G": "嘟","H": "叽",
  "I": "咻","J": "嗖","K": "咚","L": "嗡","M": "嘎","N": "呼","O": "嘭","P": "啪",
  "Q": "哒","R": "咔","S": "哧","T": "唧","U": "咯","V": "啾","W": "呀","X": "唔",
  "Y": "咪","Z": "哏","a": "嚯","b": "嘶","c": "咕","d": "吭","e": "哼","f": "啊",
  "g": "啸","h": "吼","i": "嚎","j": "呜","k": "唳","l": "咴","m": "吠","n": "嘛",
  "o": "咝","p": "呱","q": "唯","r": "喔","s": "哇","t": "吱","u": "啵","v": "哗",
  "w": "砰","x": "卟","y": "呤","z": "嗔","0": "唴","1": "哄","2": "咙","3": "吩",
  "4": "唏","5": "叻","6": "噗","7": "啕","8": "啄","9": "嚼","+": "咽","/": "喷",
  "=": "吡",":": "喘" // 冒号的映射，用于处理加密结果中的分隔符
}

/**
 * @constant reverseMap
 * @description `phoneticMap` 的反向映射，用于将汉字（拟声词）转换回 Base64 字符。
 */
const reverseMap: Record<string, string> = Object.fromEntries(
  Object.entries(phoneticMap).map(([k,v]) => [v,k])
);

/**
 * @function base64ToPhoneticSingle
 * @description 将 Base64 编码的字符串中的每个字符转换为对应的汉字（拟声词）。
 *              如果字符没有对应的映射，则保留原字符。
 * @param {string} base64 - Base64 编码的字符串。
 * @returns {string} 转换后的汉字字符串。
 */
export function base64ToPhoneticSingle(base64: string): string {
  // 将 Base64 字符串分割成单个字符数组，然后进行映射转换
  return base64.split("").map(ch => phoneticMap[ch] || ch).join("");
}

/**
 * @function phoneticSingleToBase64
 * @description 将包含汉字（拟声词）的字符串转换回 Base64 字符。
 *              如果汉字没有对应的映射，则保留原汉字。
 * @param {string} phonetic - 包含汉字（拟声词）的字符串。
 * @returns {string} 转换后的 Base64 字符串。
 */
export function phoneticSingleToBase64(phonetic: string): string {
  // 将汉字字符串分割成单个字符数组，然后进行反向映射转换
  return phonetic.split("").map(ch => reverseMap[ch] || ch).join("");
}
