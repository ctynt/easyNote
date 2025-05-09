import { useEffect, useState } from 'react';
import { List, Card, Tag, Button, Modal, message, Space, Layout } from 'antd';
import { getNotes, deleteNote } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import React from 'react';
const Notes = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate]);

  const fetchNotes = async () => {
    try {
      const fetchNotesData = await getNotes(user.id);
      setNotes(fetchNotesData.data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      alert('获取笔记失败');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      fetchNotes();
      message.success('笔记删除成功');
    } catch (error) {
      console.error('Failed to delete note:', error);
      message.error('删除笔记失败');
    }
  };

  return (
    <Layout>
      <Navbar />
      <Layout style={{ marginLeft: 200 }}>
        <Layout.Content
          style={{ padding: '24px', minHeight: '100vh', background: '#fff' }}
        >
          <div className="flex justify-between items-center mb-6">
            <h1>笔记列表</h1>
            <Button type="primary" onClick={() => navigate('/create-note')}>
              创建笔记
            </Button>
          </div>
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={notes}
            className="p-4"
            renderItem={(item) => (
              <Card className="bg-blue-100 m-2" hoverable>
                <Card.Meta title={item.title} />
                <div className="my-4">
                  {item.tags.map((tag) => (
                    <Tag color="cyan" key={tag}>
                      {tag}
                    </Tag>
                  ))}
                </div>
                <Space>
                  <a href={`/notes/${item.id}`}>点击查看详情</a>

                  <Button
                    type="primary"
                    onClick={() => {
                      setModalVisible(true);
                      setSelectedNoteId(item.id);
                    }}
                  >
                    删除
                  </Button>
                </Space>
              </Card>
            )}
          />
          <Modal
            title="确认删除"
            open={modalVisible}
            onOk={async () => {
              await handleDeleteNote(selectedNoteId);
              setModalVisible(false);
              setSelectedNoteId(null);
            }}
            onCancel={() => {
              setModalVisible(false);
              setSelectedNoteId(null);
            }}
          >
            <p>确定要删除这条笔记吗？此操作不可恢复。</p>
          </Modal>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default Notes;
