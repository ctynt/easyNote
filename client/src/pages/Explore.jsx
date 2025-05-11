import React, { useEffect, useState } from 'react';
import { getNotesList } from '../api/noteApi';
import { Card, Avatar, Space, Typography, Row, Col, Layout } from 'antd';
import { MessageOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
const { Text, Title } = Typography;

const Explore = () => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await getNotesList();
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
    fetchNotes();
  }, []);

  const handleNoteClick = (noteId) => {
    navigate(`/notes/${noteId}`);
  };

  return (
    <Layout style={{ backgroundColor: '#f9fafb' }}>
      <Navbar />
      <Layout.Content style={{ marginLeft: '250px' }}>
        <div style={{ padding: '24px' }}>
          <Title level={2}>发现笔记</Title>
          <Row gutter={[16, 16]}>
            {notes.map((note) => (
              <Col xs={24} sm={12} md={8} lg={6} key={note.id}>
                <Card
                  hoverable
                  onClick={() => handleNoteClick(note.id)}
                  style={{ height: '100%' }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Title level={4} ellipsis={{ rows: 2 }}>
                      {note.title}
                    </Title>
                    {/* <Text type="secondary" ellipsis={{ rows: 3 }}>
                      {note.content}
                    </Text> */}
                    <Space
                      style={{ width: '100%', justifyContent: 'space-between' }}
                    >
                      <Space>
                        <Avatar
                          size="small"
                          icon={<UserOutlined />}
                          src={note.avatar_url}
                        />
                        <Text type="secondary">{note.username}</Text>
                      </Space>
                      <Space>
                        <MessageOutlined />
                        <Text type="secondary">{note.comment_count}</Text>
                      </Space>
                    </Space>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default Explore;
