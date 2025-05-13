import { useEffect, useState } from 'react';
import { Button, message, Layout } from 'antd';
import { getNotes, deleteNote } from '@/api/noteApi';
import { getCategories } from '@/api/categoryApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import NoteList from '@/components/NoteList';
import React from 'react';

const Notes = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchNotes = async () => {
    try {
      const fetchNotesData = await getNotes(user.id);
      setNotes(fetchNotesData.data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      message.error('获取笔记失败');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      message.error('获取分类失败');
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchNotes();
      fetchCategories();
    }
  }, [user]);

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
      <Layout style={{ marginLeft: 250 }}>
        <Layout.Content
          style={{ padding: '24px', minHeight: '100vh', background: '#fff' }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2>笔记列表</h2>
            <Button type="primary" onClick={() => navigate('/create-note')}>
              创建笔记
            </Button>
          </div>
          <NoteList
            notes={notes}
            categories={categories}
            onDeleteNote={handleDeleteNote}
          />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default Notes;
