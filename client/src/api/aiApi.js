import axiosInstance from './axiosInstance';
export const chatWithAI = async (question) => {
  return axiosInstance.get(`/ai/chat?question=${encodeURIComponent(question)}`);
};
