import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Typography, Tag, Button, message } from 'antd';
import { decryptNoteId } from '@/utils/shareUtils';
import { getNote } from '@/api/noteApi';
import TiptapViewer from '@/components/TiptapViewer';
import OutlineExtractor from '@/components/OutlineExtractor';

const { Content } = Layout;
const { Title } = Typography;

const SharedNote = () => {
  const { encryptedId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSharedNote = async () => {
      try {
        const noteId = decryptNoteId(encryptedId);
        if (!noteId) {
          message.error('无效的分享链接');
          navigate('/');
          return;
        }

        const response = await getNote(noteId);
        setNote(response.data);
      } catch (error) {
        console.error('获取分享笔记失败:', error);
        message.error('获取笔记失败');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedNote();
  }, [encryptedId, navigate]);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!note) {
    return null;
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Content
        style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}
      >
        <div
          style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}
        >
          <div style={{ marginBottom: '24px' }}>
            <Title level={2}>{note.title}</Title>
            <div style={{ marginTop: '12px' }}>
              {note.tags?.map((tag) => (
                <Tag key={tag} color="blue">
                  {tag}
                </Tag>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ flex: 1 }}>
              <TiptapViewer content={note.content} />
            </div>
            <div style={{ width: '250px' }}>
              <OutlineExtractor content={note.content} />
            </div>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Button type="primary" onClick={() => navigate('/login')}>
              登录查看更多内容
            </Button>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default SharedNote;
