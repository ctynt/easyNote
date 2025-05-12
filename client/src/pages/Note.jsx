import React, { useState, useEffect } from 'react';
import { Tag, Layout, Button, message, Divider } from 'antd';
import ActionButtons from '@/components/ActionButtons';
import { ShareAltOutlined } from '@ant-design/icons';
import { getNote } from '@/api/noteApi';
import { generateShareLink, copyToClipboard } from '@/utils/shareUtils';
import { useStore } from '@/store/userStore';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import TiptapViewer from '@/components/TiptapViewer';
import OutlineExtractor from '@/components/OutlineExtractor';
import TurndownService from 'turndown';
import CommentList from '@/components/CommentList';

const { Content, Sider } = Layout;

const Note = () => {
  const { user: currentUser } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [note, setNote] = useState(null);

  // 导出笔记为Markdown文件
  // 处理分享功能
  const handleShare = async () => {
    const shareLink = generateShareLink(id);
    const success = await copyToClipboard(shareLink);
    if (success) {
      message.success('分享链接已复制到剪贴板');
    } else {
      message.error('复制失败，请手动复制');
    }
  };

  const handleExportMarkdown = () => {
    if (!note) return;

    // 创建turndown实例用于HTML到Markdown的转换
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    });

    // 创建一个Markdown内容
    let mdContent = `# ${note.title}\n\n`;

    // 添加标签
    if (note.tags && note.tags.length > 0) {
      mdContent += note.tags.map((tag) => `#${tag}`).join(' ') + '\n\n';
    }

    // 将HTML内容转换为Markdown
    const markdownBody = turndownService.turndown(note.content);
    mdContent += markdownBody;

    // 创建Blob并下载
    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    message.success('笔记已导出为Markdown文件');
  };

  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [navigate, currentUser]);

  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        const fetchedNote = await getNote(id);
        setNote(fetchedNote.data);
      } catch (error) {
        console.error('Failed to fetch note details:', error);
        alert('获取笔记详情失败');
        navigate('/notes');
      }
    };

    fetchNoteDetails();
  }, [id, navigate]);

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
        <Content style={{ display: 'flex' }}>
          <div
            className="content-container"
            style={{
              flex: 1,
              overflow: 'auto',
              padding: '24px',
              background: '#f5f5f5',
            }}
          >
            <div className="flex justify-between items-center">
              <div style={{ marginBottom: '10px' }}>
                {note.user_id === currentUser?.id ? (
                  <>
                    <Button
                      icon={<ShareAltOutlined />}
                      onClick={handleShare}
                      style={{ marginRight: '8px' }}
                    >
                      分享
                    </Button>
                    <Button
                      type="text"
                      onClick={() => navigate(`/notes/edit/${id}`)}
                      style={{ fontSize: '16px' }}
                    >
                      编辑笔记
                    </Button>

                    <Button
                      type="text"
                      onClick={handleExportMarkdown}
                      style={{ fontSize: '16px', marginLeft: '10px' }}
                    >
                      导出为MD
                    </Button>
                  </>
                ) : null}
              </div>
            </div>

            <div
              style={{
                background: '#fff',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
              }}
            >
              <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>
                {note.title}
              </h1>
              <Divider style={{ margin: '12px 0' }} />
              <div style={{ marginTop: '16px', marginLeft: '10px' }}>
                {note.tags &&
                  note.tags.map((tag) => (
                    <Tag
                      color="cyan"
                      key={tag}
                      style={{
                        margin: '4px',
                        borderRadius: '12px',
                        padding: '4px 12px',
                      }}
                    >
                      {tag}
                    </Tag>
                  ))}
              </div>
              <TiptapViewer content={note.content} />
              <Divider style={{ margin: '24px 0' }} />
              <CommentList noteId={id} />
            </div>
          </div>

          <Sider
            width={250}
            theme="light"
            style={{
              borderLeft: '1px solid #f0f0f0',
              background: '#fff',
              overflow: 'auto',
              padding: '16px',
            }}
          >
            <OutlineExtractor
              content={note.content}
              onHeadingClick={(id) => {
                const element = document.getElementById(id);
                if (element) {
                  element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start', // 将目标元素顶部对齐
                    inline: 'nearest',
                  });

                  // 可选：如果需要额外的顶部边距
                  setTimeout(() => {
                    window.scrollBy(0, -20); // 向上滚动20px
                  }, 200); // 延迟使其生效
                }
              }}
            />
          </Sider>
        </Content>
      </Layout>
      <ActionButtons noteId={note.id} />
    </Layout>
  );
};

export default Note;
