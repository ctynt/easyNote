import React, { useState, useEffect } from 'react';
import { FloatButton, message } from 'antd';
import {
  LikeOutlined,
  LikeFilled,
  StarOutlined,
  StarFilled,
} from '@ant-design/icons';
import { createAction, getActionStatus } from '@/api/actionApi';
import { useStore } from '@/store/userStore';

const ActionButtons = ({ noteId }) => {
  const [liked, setLiked] = useState(null); // 初始状态为 null，避免闪烁
  const [favorited, setFavorited] = useState(null); // 初始状态为 null
  const { user } = useStore();

  useEffect(() => {
    const fetchActionStatus = async () => {
      try {
        const res = await getActionStatus(noteId, user.id);
        const status = res.data; // 取 .data
        setLiked(status.liked); // 根据接口返回设置状态
        setFavorited(status.favorited);
        console.log(status); // 打印 status 以检查其结构
      } catch (error) {
        console.error('Failed to fetch action status:', error);
      }
    };

    fetchActionStatus();
  }, [noteId, user.id]);

  const handleAction = async (type) => {
    try {
      const res = await createAction({
        note_id: noteId,
        type,
        user_id: user.id,
      });

      const result = res.data; // 取 .data
      message.success(result.message);

      if (type === 0) {
        setLiked(result.status); // status = true (新增) / false (取消)
      } else {
        setFavorited(result.status);
      }
    } catch (error) {
      console.error('Failed to perform action:', error);
    }
  };

  // 初始状态为 null 时不渲染按钮，直到获取到正确的状态
  if (liked === null || favorited === null) {
    return null; // 你可以根据需要渲染一个加载状态
  }

  return (
    <div style={{ position: 'fixed', right: '24px', bottom: '24px' }}>
      <FloatButton.Group shape="circle" style={{ right: 24 }}>
        <FloatButton
          icon={liked ? <LikeFilled /> : <LikeOutlined />}
          onClick={() => handleAction(0)}
          tooltip={liked ? '取消点赞' : '点赞'}
        />
        <FloatButton
          icon={favorited ? <StarFilled /> : <StarOutlined />}
          onClick={() => handleAction(1)}
          tooltip={favorited ? '取消收藏' : '收藏'}
        />
      </FloatButton.Group>
    </div>
  );
};

export default ActionButtons;
