import React, { useState, useEffect } from 'react';
import { List, Avatar, Input, Button, Popconfirm, message } from 'antd';
import { useStore } from '@/store/userStore';
import { getComments, addComment, deleteComment } from '@/api/commentApi';

const CommentList = ({ noteId }) => {
  const { user } = useStore();
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 获取评论列表
  const fetchComments = async () => {
    try {
      const response = await getComments(noteId);
      setComments(response.data);
      console.log('CommentsData:', response.data); // Add this line to log the comments t
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      message.error('获取评论失败');
    }
  };

  useEffect(() => {
    if (noteId) {
      fetchComments();
    }
  }, [noteId]);
  console.log('Comments:', comments); // Add this line to log the comments t
  // 提交评论
  const handleSubmit = async () => {
    if (!commentContent.trim()) {
      message.warning('请输入评论内容');
      return;
    }

    setSubmitting(true);
    try {
      await addComment({
        note_id: noteId,
        content: commentContent,
        user_id: user.id,
      });
      setCommentContent('');
      fetchComments(); // 刷新评论列表
      message.success('评论发布成功');
    } catch (error) {
      console.error('Failed to add comment:', error);
      message.error('评论发布失败');
    } finally {
      setSubmitting(false);
    }
  };

  // 删除评论
  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId, user?.id);
      fetchComments(); // 刷新评论列表
      message.success('评论删除成功');
    } catch (error) {
      console.error('Failed to delete comment:', error);
      if (error.response?.status === 403) {
        message.error('您没有权限删除此评论');
      } else {
        message.error('删除评论失败');
      }
    }
  };

  return (
    <div className="comment-list" style={{ padding: '0 24px' }}>
      <h3 style={{ marginBottom: '16px' }}>评论列表</h3>
      {/* 评论列表 */}
      <List
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={(item) => (
          <List.Item
            actions={
              item.user_id === user?.id
                ? [
                    <Popconfirm
                      title="确定要删除这条评论吗？"
                      onConfirm={() => handleDelete(item.id)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button type="link" danger>
                        删除
                      </Button>
                    </Popconfirm>,
                  ]
                : []
            }
          >
            <List.Item.Meta
              avatar={<Avatar src={item.avatar_url} alt={item.username} />}
              title={<span>{item.username}</span>}
              description={
                <div>
                  <div>{item.content}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {new Date(item.created_at).toLocaleString()}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
      {/* 评论输入框 */}
      <div style={{ marginBottom: '24px' }}>
        <Input.TextArea
          rows={4}
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="写下你的评论..."
          style={{ marginBottom: '8px' }}
        />
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={submitting}
          disabled={!commentContent.trim()}
        >
          发布评论
        </Button>
      </div>
    </div>
  );
};

export default CommentList;
