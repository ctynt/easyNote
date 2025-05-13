import React, { useState, useEffect } from 'react';
import { Layout, Typography, Button, Divider, message } from 'antd';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';

import Navbar from '@/components/Navbar';
import { useStore } from '@/store/userStore';
import { getNotes, deleteNote } from '@/api/noteApi';
import { getCategories, createCategory } from '@/api/categoryApi';
import { useNavigate } from 'react-router-dom';
import NoteList from '@/components/NoteList';
const { Title } = Typography;
import CreateCategoryModal from '@/components/CreateCategoryModal';

const Home = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [createCategoryModal, setCreateCategoryModal] = useState(false);
  // 统计每个分类有多少篇笔记
  const getNoteCountsByCategory = (notes) => {
    const counts = {};
    notes.forEach((note) => {
      const catId = note.category_id;
      if (catId) {
        counts[catId] = (counts[catId] || 0) + 1;
      }
    });
    return counts;
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories(user.id);
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
      message.success('笔记删除成功');
    } catch (error) {
      console.error('Failed to delete note:', error);
      message.error('删除笔记失败');
    }
  };

  const refreshNotesWithCategories = async () => {
    await fetchCategories();
    try {
      const response = await getNotes(user.id);
      setNotes(response.data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      message.error('获取笔记列表失败');
    }
  };

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);

  useEffect(() => {
    refreshNotesWithCategories();
  }, [user]);

  const noteCounts = getNoteCountsByCategory(notes);

  return (
    <Layout>
      <Navbar />
      <Layout style={{ marginLeft: 250 }}>
        <Layout.Content
          className="p-6 bg-gray-50"
          style={{ overflow: 'hidden' }}
        >
          {/* 欢迎语 */}
          <Title level={2} className="mb-8 text-gray-800">
            欢迎，{user?.nickname || user?.username || '笔记用户'}
          </Title>

          {/* 知识库列表 */}
          <div className="flex justify-between items-center mb-4">
            <Title level={3}>知识库列表</Title>
            <Button type="primary" onClick={() => setCreateCategoryModal(true)}>
              创建知识库
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((item) => (
              <div
                onClick={() => navigate(`/notes/categories/${item.id}`)}
                key={item.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
              >
                {item.cover && (
                  <img
                    src={item.cover}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                )}
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">{item.name}</h3>
                  {item.is_public ? (
                    <UnlockOutlined className="text-green-500" />
                  ) : (
                    <LockOutlined className="text-gray-500" />
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">
                    {noteCounts[item.id] || 0} 篇文章
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Divider />

          {/* 最近笔记列表 */}
          <div className="flex justify-between items-center mb-4">
            <Title level={3}>最近笔记</Title>
            <Button type="primary" onClick={() => navigate('/create-note')}>
              创建笔记
            </Button>
          </div>

          <NoteList
            notes={notes}
            categories={categories}
            onDeleteNote={handleDeleteNote} // preview 模式下其实用不到，但为了兼容性可以留着
          />

          {/* 新建知识库弹窗 */}
          <CreateCategoryModal
            open={createCategoryModal}
            onCancel={() => setCreateCategoryModal(false)}
            onSuccess={fetchCategories}
          />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default Home;
