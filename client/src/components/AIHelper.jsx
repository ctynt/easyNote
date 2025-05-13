import React, { useState } from 'react';
import { Modal, Input, Button, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const AIHelper = ({ visible, onClose }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) {
      message.warning('请输入问题');
      return;
    }

    setLoading(true);
    try {
      // TODO: 调用后端API获取AI回答
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error('请求失败');
      }

      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error('AI请求失败:', error);
      message.error('获取AI回答失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(answer)
      .then(() => message.success('复制成功'))
      .catch(() => message.error('复制失败'));
  };

  return (
    <Modal
      title="AI助手"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div style={{ marginBottom: 16 }}>
        <TextArea
          placeholder="请输入您的问题..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={4}
        />
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          style={{ marginTop: 8 }}
        >
          获取回答
        </Button>
      </div>

      {answer && (
        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: 16,
            borderRadius: 4,
            position: 'relative',
          }}
        >
          <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{answer}</pre>
          <Button
            icon={<CopyOutlined />}
            onClick={handleCopy}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            复制
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default AIHelper;
