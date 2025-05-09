import React, { useState, useEffect } from 'react';
import {
  Layout,
  Typography,
  List,
  Card,
  Tag,
  Space,
  Button,
  Modal,
} from 'antd';
import Navbar from '@/components/Navbar';
import { useStore } from '@/store/userStore';
import { getNotesList, deleteNote } from '@/api/noteApi';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Home = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) return;
      try {
        const response = await getNotesList();
        setNotes(response.data);
      } catch (error) {
        console.error('Failed to fetch notes:', error);
        console.error('获取笔记列表失败');
      }
    };
    fetchNotes();
  }, [user]);

  return (
    <>
      <Layout>
        <Navbar />
        <Layout style={{ marginLeft: 200 }}>
          <Layout.Content
            className="p-6 bg-gray-50"
            style={{ overflow: 'hidden' }}
          >
            <div>
              {user ? (
                <Title level={2} className="mb-8 text-gray-800">
                  欢迎，{user.nickname || user.username}
                </Title>
              ) : (
                <Title level={2} className="mb-8 text-gray-800">
                  欢迎来到笔记应用
                </Title>
              )}
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
                      onClick={() => navigate(`/notes/edit/${item.id}`)}
                    >
                      编辑
                    </Button>
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
    </>
  );
};
export default Home;
