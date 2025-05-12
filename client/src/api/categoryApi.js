import axiosInstance from './axiosInstance';

export const createCategory = async (categoryData) => {
  return axiosInstance.post('/categories', categoryData);
};

export const getCategories = async (userId) => {
  return axiosInstance.get(`/categories/user/${userId}`);
};

export const getCategory = async (categoryId) => {
  return axiosInstance.get(`/categories/${categoryId}`);
};

export const updateCategory = async (categoryId, categoryData) => {
  return axiosInstance.put(`/categories/${categoryId}`, categoryData);
};

export const deleteCategory = async (categoryId) => {
  return axiosInstance.delete(`/categories/${categoryId}`);
};

export const getPublicCategories = async () => {
  return axiosInstance.get('/categories/public');
};
