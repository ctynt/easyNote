// 生成标题ID的工具函数
export const generateHeadingId = (text, index) => {
  if (!text) return `heading-${index}`;
  const sanitizedText = text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '');
  return `heading-${sanitizedText}-${index}`;
};
