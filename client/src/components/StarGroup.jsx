import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Checkbox, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  createStar,
  getStars,
  addStarContent,
  getStarsByNoteId,
  removeStarContent,
} from '@/api/starApi';
import { useStore } from '@/store/userStore';
const StarGroup = ({ visible, onCancel, onSuccess, noteId }) => {
  const [form] = Form.useForm();
  const { user } = useStore();
  const [stars, setStars] = useState([]);
  const [selectedStars, setSelectedStars] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchStars();
      fetchNoteStars();
    }
  }, [visible]);

  const fetchNoteStars = async () => {
    try {
      const response = await getStarsByNoteId(noteId, user.id);
      setSelectedStars(response.data.map((star) => star.id));
    } catch (error) {
      console.error('Failed to fetch note stars:', error);
      message.error('获取笔记收藏状态失败');
    }
  };

  const fetchStars = async () => {
    try {
      const response = await getStars(user.id);
      setStars(response.data);
    } catch (error) {
      console.error('Failed to fetch stars:', error);
      message.error('获取收藏夹失败');
    }
  };

  const handleCreateStar = async (values) => {
    try {
      await createStar({
        name: values.name,
        description: values.description,
        userId: user.id,
      });
      message.success('创建收藏夹成功');
      setShowCreateForm(false);
      form.resetFields();
      fetchStars();
    } catch (error) {
      console.error('Failed to create star:', error);
      message.error('创建收藏夹失败');
    }
  };

  const handleSave = async () => {
    try {
      // 获取当前笔记的收藏状态
      const currentStars = await getStarsByNoteId(noteId, user.id);
      const currentStarIds = currentStars.data.map((star) => star.id);

      // 需要添加的收藏夹
      const starsToAdd = selectedStars.filter(
        (id) => !currentStarIds.includes(id),
      );
      // 需要移除的收藏夹
      const starsToRemove = currentStarIds.filter(
        (id) => !selectedStars.includes(id),
      );

      // 添加新的收藏
      for (const starId of starsToAdd) {
        await addStarContent(starId, noteId, user.id);
      }

      // 移除取消的收藏
      for (const starId of starsToRemove) {
        await removeStarContent(starId, noteId, user.id);
      }

      message.success('更新收藏成功');
      onSuccess?.();
      onCancel();
    } catch (error) {
      console.error('Failed to update stars:', error);
      message.error('更新收藏失败');
    }
  };

  return (
    <Modal
      title="选择收藏夹"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSave}>
          确定
        </Button>,
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Checkbox.Group
          style={{ width: '100%' }}
          value={selectedStars}
          onChange={setSelectedStars}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {stars.map((star) => (
              <Checkbox key={star.id} value={star.id}>
                {star.name}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>

        {showCreateForm ? (
          <Form form={form} layout="vertical" onFinish={handleCreateStar}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: '请输入收藏夹名称' }]}
            >
              <Input placeholder="收藏夹名称" />
            </Form.Item>
            <Form.Item name="description">
              <Input.TextArea placeholder="收藏夹描述（选填）" />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  创建
                </Button>
                <Button onClick={() => setShowCreateForm(false)}>取消</Button>
              </Space>
            </Form.Item>
          </Form>
        ) : (
          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={() => setShowCreateForm(true)}
          >
            新建分组
          </Button>
        )}
      </Space>
    </Modal>
  );
};

export default StarGroup;
