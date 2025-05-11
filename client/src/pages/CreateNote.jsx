import React, { useState } from 'react';
import { Layout, message, Button } from 'antd';
import { marked } from 'marked';
import { createNote } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import NoteForm from '@/components/NoteForm';

const CreateNote = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [formData, setFormData] = useState(null);

  const handleImportMarkdown = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;

      // 解析Markdown内容
      const lines = content.split('\n');
      let title = '';
      let tags = [];
      let mdContent = content;

      // 尝试提取标题（假设第一行是标题）
      if (lines.length > 0 && lines[0].startsWith('# ')) {
        title = lines[0].substring(2).trim();
        mdContent = lines.slice(1).join('\n').trim();
      }

      // 尝试提取标签（假设标签格式为 #tag1 #tag2）
      const tagLineIndex = lines.findIndex(
        (line) =>
          line.trim() &&
          line
            .split(' ')
            .every((word) => word.startsWith('#') && word.length > 1),
      );

      if (tagLineIndex > 0) {
        const tagLine = lines[tagLineIndex];
        tags = tagLine
          .split(' ')
          .filter((word) => word.startsWith('#') && word.length > 1)
          .map((tag) => tag.substring(1));

        // 从内容中移除标签行
        const contentLines = [...lines];
        contentLines.splice(tagLineIndex, 1);
        mdContent = contentLines.join('\n');
      }

      // 使用marked库将Markdown转换为HTML
      const htmlContent = marked(mdContent, {
        headerIds: false, // 不添加ID到标题
        mangle: false, // 不转义HTML
      });

      // 设置表单数据
      const importedNote = {
        title: title || '',
        content: htmlContent,
        tags: tags,
      };

      setFormData(importedNote);
      message.success('Markdown文件已导入');
    };

    reader.readAsText(file);
    // 重置文件输入，以便可以重复选择同一文件
    event.target.value = '';
  };

  const handleSubmit = async (values) => {
    try {
      const noteData = {
        ...values,
        userId: user.id,
      };
      await createNote(noteData);
      message.success('笔记创建成功');
      navigate('/notes');
    } catch (error) {
      console.error('Failed to create note:', error);
      message.error('创建笔记失败');
    }
  };

  return (
    <Layout>
      <Navbar />
      <Layout.Content className="p-4" style={{ marginLeft: '200px' }}>
        <div className="flex justify-between items-center mb-6">
          <h1>创建笔记</h1>
          <div>
            <Button
              type="primary"
              onClick={() => document.getElementById('import-md-input').click()}
              style={{ marginRight: '8px' }}
            >
              导入MD
            </Button>
            <input
              id="import-md-input"
              type="file"
              accept=".md"
              style={{ display: 'none' }}
              onChange={handleImportMarkdown}
            />
          </div>
        </div>
        <div style={{ padding: '24px', background: '#fff' }}>
          <NoteForm
            onSubmit={handleSubmit}
            submitButtonText="创建笔记"
            initialValues={formData}
          />
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default CreateNote;
