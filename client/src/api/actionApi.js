import axiosInstance from './axiosInstance';

// 创建/取消点赞或收藏
export const createAction = (data) => {
  return axiosInstance({
    url: '/actions',
    method: 'post',
    data,
  });
};

// api/actionApi.js
export const getActionStatus = (noteId, userId) => {
  return axiosInstance({
    url: `/actions/${userId}/${noteId}`,
    method: 'get',
  });
};
