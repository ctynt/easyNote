import React, { useEffect, useState } from 'react';
import { getNotesList } from '../api/noteApi';
import { getBatchNoteStats } from '../api/statsApi';
import { getPublicCategories } from '../api/categoryApi';
import { Card, Avatar, Space, Typography, Row, Col, Layout } from 'antd';
import {
  MessageOutlined,
  UserOutlined,
  LikeOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TurndownService from 'turndown';
const { Text, Title } = Typography;

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

const removeMarkdownSyntax = (text) => {
  return text
    .replace(/#{1,6}\s/g, '') // 移除标题标记
    .replace(/[\*_]{1,3}([^\*_]+)[\*_]{1,3}/g, '$1') // 移除加粗和斜体
    .replace(/^[\-\*\+]\s/gm, '') // 移除列表标记
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // 移除链接，保留文本
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // 移除代码块
    .replace(/^>\s/gm, '') // 移除引用标记
    .trim();
};

const Explore = () => {
  const [notes, setNotes] = useState([]);
  const [noteStats, setNoteStats] = useState({});
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesResponse, categoriesResponse] = await Promise.all([
          getNotesList(),
          getPublicCategories(),
        ]);
        setNotes(notesResponse.data);
        setCategories(categoriesResponse.data);

        // 获取所有笔记的统计数据
        const noteIds = notesResponse.data.map((note) => note.id);
        const statsResponse = await getBatchNoteStats(noteIds);
        setNoteStats(statsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleNoteClick = (noteId) => {
    navigate(`/notes/${noteId}`);
  };

  return (
    <Layout style={{ backgroundColor: '#f9fafb' }}>
      <Navbar />
      <Layout.Content style={{ marginLeft: '250px' }}>
        <div style={{ padding: '24px' }}>
          <Title level={2}>发现知识库</Title>
          <Row gutter={[16, 16]} className="mb-8">
            {categories.map((category) => (
              <Col xs={24} sm={12} md={8} lg={6} key={category.id}>
                <Card
                  hoverable
                  onClick={() => navigate(`/notes/categories/${category.id}`)}
                  cover={
                    category.cover && (
                      <img
                        alt={category.name}
                        src={category.cover}
                        style={{ height: 200, objectFit: 'cover' }}
                      />
                    )
                  }
                >
                  <Card.Meta
                    title={category.name}
                    description={
                      <div>
                        <p className="text-gray-600">{category.description}</p>
                        <Space className="mt-2">
                          <Avatar
                            size="small"
                            src={category.avatar_url}
                            icon={<UserOutlined />}
                          />
                          <Text type="secondary">{category.nickname}</Text>
                        </Space>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>

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
                    <Text type="secondary" ellipsis={{ rows: 3 }}>
                      {removeMarkdownSyntax(
                        turndownService.turndown(note.content),
                      )}
                    </Text>
                    <Space
                      style={{ width: '100%', justifyContent: 'space-between' }}
                    >
                      <Space>
                        <Avatar
                          size="small"
                          icon={<UserOutlined />}
                          src={note.avatar_url}
                        />
                        <Text type="secondary">{note.nickname}</Text>
                      </Space>
                      <Space>
                        <Space>
                          <MessageOutlined />
                          <Text type="secondary">{note.comment_count}</Text>
                        </Space>
                        <Space>
                          <LikeOutlined />
                          <Text type="secondary">
                            {noteStats[note.id]?.likeCount || 0}
                          </Text>
                        </Space>
                        <Space>
                          <StarOutlined />
                          <Text type="secondary">
                            {noteStats[note.id]?.favoriteCount || 0}
                          </Text>
                        </Space>
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
