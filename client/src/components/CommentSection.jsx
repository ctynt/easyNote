import React, { useState, useEffect } from 'react';
import { Avatar, Form, Button, List, Input, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getComments, addComment, deleteComment } from '../api/commentApi';
import { useSelector } from 'react-redux';
import './CommentSection.css';

const { TextArea } = Input;

const CommentSection = ({ noteId }) => {
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    fetchComments();
  }, [noteId]);

  const fetchComments = async () => {
    try {
      const response = await getComments(noteId);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      message.error('获取评论失败');
    }
  };

  const handleSubmit = async () => {
    if (!value) return;
    if (!currentUser) {
      message.warning('请先登录');
      return;
    }

    setSubmitting(true);
    try {
      await addComment({
        note_id: noteId,
        content: value,
        user_id: currentUser.id,
      });
      setValue('');
      fetchComments();
      message.success('评论成功');
    } catch (error) {
      console.error('Error adding comment:', error);
      message.error('评论失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId, currentUser.id);
      fetchComments();
      message.success('删除成功');
    } catch (error) {
      console.error('Error deleting comment:', error);
      message.error('删除失败');
    }
  };

  return (
    <div className="comment-section">
      <div className="comment-input">
        <div className="comment-input-header">
          <Avatar icon={<UserOutlined />} src={currentUser?.avatar_url} />
        </div>
        <div className="comment-input-content">
          <Form.Item>
            <TextArea
              rows={4}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="写下你的评论..."
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              loading={submitting}
              onClick={handleSubmit}
              type="primary"
            >
              添加评论
            </Button>
          </Form.Item>
        </div>
      </div>
      <List
        className="comment-list"
        header={`${comments.length} 条评论`}
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={(item) => (
          <div className="comment-item">
            <div className="comment-item-header">
              <Avatar icon={<UserOutlined />} src={item.avatar_url} />
              <span className="comment-author">{item.username}</span>
              <span className="comment-time">
                {new Date(item.created_at).toLocaleString()}
              </span>
            </div>
            <div className="comment-item-content">{item.content}</div>
            {currentUser?.id === item.user_id && (
              <div className="comment-item-actions">
                <Button
                  type="text"
                  danger
                  onClick={() => handleDelete(item.id)}
                >
                  删除
                </Button>
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default CommentSection;
