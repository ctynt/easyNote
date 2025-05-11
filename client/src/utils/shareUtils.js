import CryptoJS from 'crypto-js';

// 加密密钥
const SECRET_KEY = 'your-secret-key-2024';

// 加密文章ID
export const encryptNoteId = (noteId) => {
  const encrypted = CryptoJS.AES.encrypt(
    noteId.toString(),
    SECRET_KEY,
  ).toString();
  return encodeURIComponent(encrypted);
};

// 解密文章ID
export const decryptNoteId = (encryptedId) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(
      decodeURIComponent(encryptedId),
      SECRET_KEY,
    ).toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error('解密失败:', error);
    return null;
  }
};

// 生成分享链接
export const generateShareLink = (noteId) => {
  const encryptedId = encryptNoteId(noteId);
  return `${window.location.origin}/shared/${encryptedId}`;
};

// 复制文本到剪贴板
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('复制失败:', error);
    return false;
  }
};
