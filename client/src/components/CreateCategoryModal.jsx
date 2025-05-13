import React, { useState } from 'react';
import { Modal, Form, Input, Upload, Checkbox, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { createCategory } from '@/api/categoryApi';
import { uploadImage } from '@/api/UploadApi';
import { useStore } from '@/store/userStore';

const CreateCategoryModal = ({ open, onCancel, onSuccess }) => {
  const { user } = useStore();
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [coverUrl, setCoverUrl] = useState('');

  // 处理封面图片上传
  const handleUpload = async (file) => {
    try {
      setUploading(true);
      const res = await uploadImage(file);
      if (res.data && res.data.url) {
        setCoverUrl(res.data.url);
        message.success('封面图上传成功');
      } else {
        throw new Error('服务器未返回图片地址');
      }
    } catch (error) {
      console.error('上传失败:', error);
      message.error('封面图上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      await createCategory({
        name: values.name,
        user_id: user.id,
        description: values.description,
        cover: coverUrl,
        is_public: values.is_public ? 1 : 0,
      });
      message.success('知识库创建成功');
      form.resetFields();
      setCoverUrl('');
      onSuccess?.();
    } catch (error) {
      console.log(values.is_public ? 1 : 0);
      console.error('Failed to create category:', error);
      message.error('创建知识库失败');
    }
  };

  return (
    <Modal
      title="新建知识库"
      open={open}
      onOk={form.submit}
      onCancel={() => {
        form.resetFields();
        setCoverUrl('');
        onCancel?.();
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="知识库名称"
          rules={[{ required: true, message: '请输入知识库名称' }]}
        >
          <Input placeholder="请输入知识库名称" />
        </Form.Item>
        <Form.Item name="description" label="知识库简介">
          <Input.TextArea placeholder="请输入知识库简介" />
        </Form.Item>
        <Form.Item label="封面图">
          <Upload
            name="cover"
            listType="picture-card"
            showUploadList={false}
            beforeUpload={(file) => {
              handleUpload(file);
              return false;
            }}
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>上传封面图</div>
            </div>
            )
          </Upload>
        </Form.Item>
        <Form.Item
          name="is_public"
          valuePropName="checked"
          initialValue={false}
        >
          <Checkbox>是否公开</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCategoryModal;
