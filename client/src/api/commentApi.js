import axiosInstance from './axiosInstance';
// 获取文章评论列表
export const getComments = (noteId) => {
  return axiosInstance.get(`/comments/notes/${noteId}/comments`);
};

// 添加评论
export const addComment = (data) => {
  return axiosInstance.post('/comments/comments', data);
};

// 删除评论
export const deleteComment = (commentId) => {
  return axiosInstance.delete(`/comments/comments/delete/${commentId}`, {});
};
