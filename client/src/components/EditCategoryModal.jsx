import React, { useState } from 'react';
import { Modal, Form, Input, Switch, message, Upload } from 'antd';
import { updateCategory } from '@/api/categoryApi';
import { uploadImage } from '@/api/UploadApi';

const EditCategoryModal = ({ visible, onCancel, onSuccess, initialValues }) => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [coverUrl, setCoverUrl] = useState('');

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      values.cover = coverUrl;
      await updateCategory(initialValues.id, values);
      message.success('知识库更新成功');
      onSuccess?.();
      onCancel();
    } catch (error) {
      console.error('Failed to update category:', error);
      message.error('更新知识库失败');
    }
  };

  const handleUpload = async (file) => {
    try {
      setUploading(true);
      const res = await uploadImage(file);
      if (res.data && res.data.url) {
        setCoverUrl(res.data.url);
        form.setFieldsValue({ cover: res.data.url });
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

  React.useEffect(() => {
    if (initialValues?.cover) {
      setCoverUrl(initialValues.cover);
    }
  }, [initialValues]);

  return (
    <Modal
      title="编辑知识库"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          name="name"
          label="知识库名称"
          rules={[{ required: true, message: '请输入知识库名称' }]}
        >
          <Input placeholder="请输入知识库名称" />
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
            {coverUrl ? (
              <img
                src={coverUrl}
                alt="cover"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div>上传封面</div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item name="description" label="描述">
          <Input.TextArea placeholder="请输入知识库描述" rows={4} />
        </Form.Item>

        <Form.Item name="is_public" label="是否公开" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCategoryModal;
