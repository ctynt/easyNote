import axiosInstance from './axiosInstance';

// 上传图片到阿里云OSS
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  return axiosInstance({
    url: '/upload/image',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
