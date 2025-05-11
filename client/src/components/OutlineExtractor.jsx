import React from 'react';
import { Typography, Anchor } from 'antd';

// 从HTML内容中提取标题并生成大纲
const OutlineExtractor = ({ content, onHeadingClick }) => {
  // 如果没有内容，返回空
  if (!content) return null;

  // 创建临时DOM元素来解析HTML内容
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;

  // 获取所有标题元素
  const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');

  // 如果没有标题，返回提示信息
  if (headings.length === 0) {
    return (
      <Typography.Text
        type="secondary"
        style={{ padding: '16px', display: 'block' }}
      >
        没有检测到标题
      </Typography.Text>
    );
  }

  // 处理标题数据，生成大纲结构
  const outlineItems = Array.from(headings).map((heading, index) => {
    const headingText = heading.textContent.trim();
    const headingId =
      heading.id ||
      (() => {
        if (!headingText) return `heading-${index}`;
        const sanitizedText = headingText
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]/g, '');
        return `heading-${sanitizedText}-${index}`;
      })();

    if (!heading.id) {
      heading.id = headingId;
    }

    return {
      id: headingId,
      level: parseInt(heading.tagName.substring(1)), // 获取标题级别 (1-6)
      text: heading.textContent,
    };
  });

  return (
    <div
      className="outline-container"
      style={{ padding: '16px', borderRadius: '8px' }}
    >
      <Typography.Title level={5}>文章大纲</Typography.Title>
      <Anchor
        items={outlineItems.map((item) => ({
          key: item.id,
          href: `#${item.id}`,
          title: (
            <span
              style={{
                paddingLeft: `${(item.level - 1) * 12}px`,
                fontSize: `${16 - (item.level - 1) * 1}px`,
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.text}
            </span>
          ),
        }))}
        onClick={(e, link) => {
          e.preventDefault();
          // 提取ID并滚动到对应元素
          const id = link.href.split('#')[1];
          // 使用传入的onHeadingClick回调（如果存在）
          if (onHeadingClick) {
            onHeadingClick(id);
          } else {
            // 默认滚动行为
            const element = document.getElementById(id);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }
          return false;
        }}
      />
    </div>
  );
};

export default OutlineExtractor;
