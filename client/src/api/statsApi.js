import axiosInstance from './axiosInstance';
// 获取单个笔记的统计信息
export const getNoteStats = async (noteId) => {
  return await axiosInstance.get(`/stats/notes/${noteId}`);
};

// 批量获取多个笔记的统计信息
export const getBatchNoteStats = async (noteIds) => {
  return await axiosInstance.post('/stats/notes/batch', { noteIds });
};
