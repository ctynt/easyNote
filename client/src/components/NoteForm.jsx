import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Tag, Select, message } from 'antd';
import TiptapEditor from './TiptapEditor';
import { getCategories } from '@/api/categoryApi';

const NoteForm = ({ initialValues, onSubmit, submitButtonText }) => {
  const [tags, setTags] = useState(initialValues?.tags || []);
  const [inputTag, setInputTag] = useState('');
  const [categories, setCategories] = useState([]);
  const [editorContent, setEditorContent] = useState(
    initialValues?.content || '',
  ); // 编辑器内部内容
  const [form] = Form.useForm();

  // 加载分类
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        message.error('获取分类失败');
      }
    };
    fetchCategories();
  }, []);

  // 加载初始数据
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        title: initialValues.title,
        categoryId: initialValues.category_id,
      });
      setTags(initialValues.tags || []);
      setEditorContent(initialValues.content || '');
    }
  }, [initialValues, form]);

  const handleInputTagChange = (e) => setInputTag(e.target.value);

  const handleAddTag = () => {
    if (inputTag && !tags.includes(inputTag)) {
      setTags([...tags, inputTag]);
      setInputTag('');
    }
  };

  const handleRemoveTag = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  const handleSubmit = async (values) => {
    await onSubmit({
      ...values,
      content: editorContent, // 提交时带上 editor 内容
      tags,
    });
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      className="note-form"
      style={{
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
      }}
    >
      <Form.Item
        name="title"
        rules={[{ required: true, message: '请输入笔记标题' }]}
      >
        <Input
          placeholder="请输入笔记标题"
          style={{
            fontSize: '24px',
            border: 'none',
            padding: '0',
            height: 'auto',
          }}
          className="title-input"
        />
      </Form.Item>

      <Form.Item
        name="categoryId"
        rules={[{ required: true, message: '请选择知识库' }]}
        style={{ marginBottom: '12px' }}
      >
        <Select placeholder="请选择知识库" style={{ width: '200px' }}>
          {categories.map((category) => (
            <Select.Option key={category.id} value={category.id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* 标签管理 */}
      <div style={{ marginBottom: '16px' }}>
        <div className="flex gap-2 items-center">
          <Input
            value={inputTag}
            onChange={handleInputTagChange}
            placeholder="添加标签"
            style={{ width: '150px', border: 'none', background: '#f5f5f5' }}
            onPressEnter={handleAddTag}
          />
          <Button type="text" onClick={handleAddTag}>
            添加
          </Button>
        </div>
        <div className="flex gap-2 flex-wrap mt-2">
          {tags.map((tag) => (
            <Tag
              key={tag}
              closable
              onClose={() => handleRemoveTag(tag)}
              style={{
                margin: '4px',
                borderRadius: '12px',
                padding: '4px 12px',
              }}
            >
              {tag}
            </Tag>
          ))}
        </div>
      </div>

      {/* 富文本编辑器，单独内容，不和 Form 绑 */}
      <div style={{ marginBottom: '16px' }}>
        <TiptapEditor
          value={editorContent} // 传入 editor 内容
          onChange={(value) => setEditorContent(value)} // 只改 editorContent 状态
        />
      </div>
    </Form>
  );
};

export default NoteForm;
