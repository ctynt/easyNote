import axiosInstance from './axiosInstance';

// 翻译文本
export const translateText = async (text, from = 'auto', to = 'en') => {
  try {
    const targetLang = to || (text.match(/[\u4e00-\u9fa5]/) ? 'en' : 'zh');
    const sourceLang = from || (text.match(/[\u4e00-\u9fa5]/) ? 'zh' : 'en');
    const response = await axiosInstance.post('/translate/translate', {
      text,
      from: sourceLang,
      to: targetLang,
    });
    return response.data.translation;
  } catch (error) {
    console.error('Translation failed:', error);
    throw error;
  }
};
