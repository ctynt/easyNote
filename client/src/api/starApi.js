import request from './axiosInstance';

// 获取用户的收藏夹列表（推荐使用 POST 或统一传参方式，若要用 GET，需改后端）
export const getStars = (userId) => {
  return request({
    url: `/stars/list`,
    method: 'post',
    data: { userId },
  });
};

// 创建收藏夹
export const createStar = (data) => {
  return request({
    url: '/stars',
    method: 'post',
    data,
  });
};

// 更新收藏夹
export const updateStar = (starId, data) => {
  return request({
    url: `/stars/${starId}`,
    method: 'put',
    data,
  });
};

// 删除收藏夹
export const deleteStar = (userId, starId) => {
  return request({
    url: `/stars/delete/${userId}/${starId}`,
    method: 'delete',
  });
};

export const addStarContent = (starId, note_id, userId) => {
  return request({
    url: `/stars/add/${starId}`,
    method: 'post',
    data: { note_id, userId },
  });
};

export const getStarContents = (starId, userId) => {
  return request({
    url: `/stars/content/${userId}/${starId}`,
    method: 'get',
  });
};

// 获取笔记的收藏状态
export const getStarsByNoteId = (noteId, userId) => {
  return request({
    url: `/stars/note/${noteId}/${userId}`,
    method: 'get',
  });
};

// 取消收藏
export const removeStarContent = (starId, noteId, userId) => {
  return request({
    url: `/stars/content/${starId}`,
    method: 'delete',
    data: { noteId, userId },
  });
};

export const deleteStarContent = (starId, noteId, userId) => {
  return request({
    url: `/stars/${starId}/content`,
    method: 'delete',
    data: { noteId, userId }, // 或者换成 params（推荐）
  });
};

// 获取用户所有收藏内容
export const getAllStarContents = (userId) => {
  return request({
    url: `/stars/content/all/${userId}`,
    method: 'get',
  });
};
