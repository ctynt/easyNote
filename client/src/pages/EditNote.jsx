import React, { useState, useEffect } from 'react';
import { Layout, message, Button } from 'antd';
import { getNote, updateNote } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import NoteForm from '@/components/NoteForm';

const EditNote = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);

  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        const fetchedNote = await getNote(id);
        setNote(fetchedNote.data);
      } catch (error) {
        console.error('Failed to fetch note details:', error);
        message.error('获取笔记详情失败');
        navigate('/notes');
      }
    };

    fetchNoteDetails();
  }, [id, navigate]);

  const handleSubmit = async (values) => {
    try {
      const updatedNoteData = {
        ...values,
        content: EditorContent,
        tags,
        userId: user.id,
      };
      await updateNote(id, updatedNoteData);
      // message.success('笔记更新成功');
      // navigate(`/notes/${id}`);
    } catch (error) {
      console.error('Failed to update note:', error);
      message.error('更新笔记失败');
    }
  };

  const handleExitEditing = () => {
    message.success('笔记更新成功');
    navigate(`/notes/${id}`);
  };

  if (!note) return <div>Loading...</div>;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Layout
        style={{
          marginLeft: 250,
          height: '100vh',
        }}
      >
        <Layout.Content style={{ padding: '24px', background: '#f5f5f5' }}>
          <div style={{ padding: '24px', backgroundColor: '#fff' }}>
            <NoteForm initialValues={note} onSubmit={handleSubmit} />
            <Button onClick={handleExitEditing} style={{ marginLeft: '20px' }}>
              保存笔记
            </Button>
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default EditNote;
