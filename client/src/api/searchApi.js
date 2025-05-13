import axiosInstance from './axiosInstance';

// 获取最近的笔记和知识库
export const getRecentItems = async (userId) => {
  return axiosInstance.get(`/search/recent/${userId}`);
};

// 搜索笔记和知识库
export const searchItems = async (userId, keyword) => {
  return axiosInstance.get(`/search/search/${userId}`, {
    params: { keyword },
  });
};
