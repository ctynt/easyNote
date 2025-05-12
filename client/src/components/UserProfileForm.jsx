import React, { useState } from 'react';
import { Form, Input, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useStore } from '@/store/userStore';
import { updateUser } from '@/api/userApi';
import { uploadImage } from '@/api/UploadApi';

const UserProfileForm = ({ onSuccess }) => {
  const { user, setUser } = useStore();
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url); // 保存新的头像地址

  // 处理头像上传 (直接复用 uploadImage api)
  const handleUpload = async (file) => {
    try {
      setUploading(true);
      const res = await uploadImage(file);

      if (res.data && res.data.url) {
        setAvatarUrl(res.data.url); // 上传成功，更新本地 avatarUrl
        message.success('头像更新成功');
      } else {
        throw new Error('服务器未返回图片地址');
      }
    } catch (error) {
      console.error('上传失败:', error);
      message.error('头像上传失败');
    } finally {
      setUploading(false);
    }
  };

  // 处理表单提交
  const handleSubmit = async (values) => {
    try {
      const updatedUser = await updateUser(user.id, {
        ...values,
        avatar_url: avatarUrl || user.avatar_url, // 如果没有新头像，保持原头像
      });
      setUser(updatedUser.data);

      message.success('用户信息更新成功');
      onSuccess?.();
    } catch (error) {
      console.log(values);
      console.error('更新失败:', error);
      message.error('用户信息更新失败');
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      initialValues={{
        username: user.username,
        nickname: user.nickname || '',
        email: user.email || '',
      }}
    >
      <Form.Item label="头像">
        <Upload
          name="avatar"
          listType="picture-card"
          showUploadList={false}
          beforeUpload={(file) => {
            handleUpload(file);
            return false;
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              style={{ width: '100%', borderRadius: '50%' }}
            />
          ) : (
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>上传头像</div>
            </div>
          )}
        </Upload>
      </Form.Item>

      <Form.Item
        name="username"
        label="用户名"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>

      <Form.Item name="nickname" label="昵称">
        <Input placeholder="请输入昵称" />
      </Form.Item>

      <Form.Item
        name="email"
        label="邮箱"
        rules={[{ type: 'email', message: '请输入有效邮箱' }]}
      >
        <Input placeholder="请输入邮箱" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={uploading}>
          保存修改
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserProfileForm;
