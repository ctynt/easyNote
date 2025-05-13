// src/pages/CategoryNotes.jsx
import React, { useState, useEffect } from 'react';
import CommentList from '@/components/CommentList';
import ActionButtons from '@/components/ActionButtons';
import EditCategoryModal from '@/components/EditCategoryModal';
import {
  List,
  Tag,
  Layout,
  Button,
  Modal,
  Space,
  Typography,
  Collapse,
  Popover,
  message,
  FloatButton,
} from 'antd';
import {
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons';
import TurndownService from 'turndown';
import {
  HomeOutlined,
  TranslationOutlined,
  ShareAltOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { generateShareLink, copyToClipboard } from '@/utils/shareUtils';
import {
  getNotesByCategory,
  deleteNote,
  getNote,
  updateNote,
} from '@/api/noteApi';
import { getCategory, updateCategory } from '@/api/categoryApi';
import { translateText } from '@/api/translateApi';
import { useStore } from '@/store/userStore';
import { useNavigate, useParams } from 'react-router-dom';
import OutlineExtractor from '@/components/OutlineExtractor';
import NoteForm from '@/components/NoteForm';

const CategoryNotes = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [translationVisible, setTranslationVisible] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [isPublic, setIsPublic] = useState();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [categoryData, setCategoryData] = useState();
  // 如果未登录，跳转登录页
  useEffect(() => {
    if (!user || !user.id) {
      navigate('/login');
    }
  }, [user, navigate]);

  // 获取笔记详情
  const fetchNoteDetail = async (noteId) => {
    try {
      const response = await getNote(noteId);
      setSelectedNote(response.data);
    } catch (error) {
      console.error('Failed to fetch note detail:', error);
    }
  };

  const fetchCategoryData = async () => {
    try {
      const response = await getCategory(categoryId);
      setIsPublic(response.data.is_public);
      setCategoryData(response.data);
    } catch (error) {
      console.error('Failed to fetch category data:', error);
    }
  };

  // 获取分类下的笔记
  useEffect(() => {
    const fetchNotesByCategory = async () => {
      try {
        const fetchedNotes = await getNotesByCategory(user.id, categoryId);
        setNotes(fetchedNotes.data);

        // 如果有笔记，自动加载第一篇笔记
        if (fetchedNotes.data && fetchedNotes.data.length > 0) {
          await fetchNoteDetail(fetchedNotes.data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch notes by category:', error);
        alert('获取笔记失败');
      }
    };

    if (user && user.id) {
      fetchNotesByCategory();
      fetchCategoryData();
    }
  }, [user, categoryId]);

  // 删除笔记
  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }
      message.success('笔记删除成功');
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('删除笔记失败');
    }
  };

  // 处理分享功能
  const handleShare = async (noteId) => {
    const shareLink = generateShareLink(noteId);
    const success = await copyToClipboard(shareLink);
    if (success) {
      message.success('分享链接已复制到剪贴板');
    } else {
      message.error('复制失败，请手动复制');
    }
  };

  // 保存更新笔记
  const handleSubmit = async (updatedData) => {
    try {
      const updatedNoteData = {
        ...selectedNote,
        ...updatedData,
        userId: user.id,
      };
      await updateNote(selectedNote.id, updatedNoteData);
      // message.success('笔记更新成功');
      setSelectedNote(updatedNoteData);

      // 刷新笔记列表
      const fetchedNotes = await getNotesByCategory(user.id, categoryId);
      setNotes(fetchedNotes.data);
      setIsEditing(true);
    } catch (error) {
      console.error('Failed to update note:', error);
      message.error('更新笔记失败');
    }
  };

  const handleExitEditing = () => {
    message.success('更新笔记成功');
    setIsEditing(false);
  };

  // 导出 Markdown
  // 处理文本翻译
  const handleTranslate = async () => {
    const selectedText = window.getSelection().toString().trim();
    if (!selectedText) {
      message.warning('请先选择要翻译的文本');
      return;
    }

    try {
      const translation = await translateText(selectedText);
      setTranslatedText(translation);
      setTranslationVisible(true);
    } catch (error) {
      console.error('Translation failed:', error);
      message.error('翻译失败');
    }
  };

  const handleExportMarkdown = () => {
    if (!selectedNote) return;

    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    });

    let mdContent = `# ${selectedNote.title}\n\n`;

    if (selectedNote.tags && selectedNote.tags.length > 0) {
      mdContent += selectedNote.tags.map((tag) => `#${tag}`).join(' ') + '\n\n';
    }

    const markdownBody = turndownService.turndown(selectedNote.content);
    mdContent += markdownBody;

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedNote.title}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    message.success('笔记已导出为Markdown文件');
  };

  console.log('categoryData:', categoryData);
  // 目录项操作
  const renderPopoverContent = (item) => (
    <>
      <Button
        type="link"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/notes/edit/${item.id}`);
        }}
        style={{ marginRight: '8px' }}
      >
        编辑
      </Button>
      <Button
        type="link"
        danger
        onClick={(e) => {
          e.stopPropagation();
          setModalVisible(true);
          setSelectedNoteId(item.id);
        }}
        style={{ marginRight: '8px' }}
      >
        删除
      </Button>
      <Button
        type="link"
        icon={<ShareAltOutlined />}
        onClick={(e) => {
          e.stopPropagation();
          handleShare(item.id);
        }}
        style={{ marginRight: '8px' }}
      >
        分享
      </Button>
    </>
  );

  return (
    <Layout>
      <Layout style={{ display: 'flex', flexDirection: 'row' }}>
        {/* 左侧目录 */}
        <Layout.Sider
          width={300}
          style={{
            background: '#fff',
            borderRight: '1px solid #f0f0f0',
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflowY: 'auto',
          }}
        >
          <div style={{ padding: '16px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="primary"
                icon={<HomeOutlined />}
                onClick={() => navigate('/')}
                style={{ marginBottom: '8px' }}
              >
                返回主页
              </Button>
              <Space
                direction="vertical"
                style={{ width: '100%', marginBottom: '16px' }}
              >
                {categoryData && categoryData.user_id === user.id ? (
                  <div style={{ display: 'flex' }}>
                    <Button
                      className="mr-2"
                      onClick={() => setEditModalVisible(true)}
                    >
                      编辑知识库
                    </Button>
                    <Button
                      onClick={async () => {
                        try {
                          const newIsPublic = !isPublic;
                          const response = await updateCategory(categoryId, {
                            is_public: newIsPublic,
                          });

                          setIsPublic(response.data.is_public);

                          message.success(
                            response.data.is_public
                              ? '分类已设为公开'
                              : '分类已设为私密',
                          );
                        } catch (error) {
                          console.error(
                            'Failed to toggle category visibility:',
                            error,
                          );
                          message.error('切换分类状态失败');
                        }
                      }}
                      icon={isPublic ? <UnlockOutlined /> : <LockOutlined />}
                    >
                      {isPublic ? '设为私密' : '设为公开'}
                    </Button>
                  </div>
                ) : null}
              </Space>
            </Space>
            <Collapse defaultActiveKey={['1']} ghost>
              <Collapse.Panel header="目录" key="1">
                <List
                  itemLayout="horizontal"
                  dataSource={notes}
                  renderItem={(item) => (
                    <List.Item
                      onClick={() => fetchNoteDetail(item.id)}
                      className={
                        selectedNote?.id === item.id
                          ? 'ant-list-item-selected bg-gray-100'
                          : ''
                      }
                      actions={[
                        categoryData && categoryData.user_id === user.id ? (
                          <Popover
                            content={() => renderPopoverContent(item)}
                            trigger="hover"
                          >
                            <span
                              style={{
                                backgroundColor: '#81c784',
                                color: '#fff',
                                padding: '8px 12px',
                                borderRadius: '4px',
                              }}
                            >
                              ⋮
                            </span>
                          </Popover>
                        ) : null,
                      ]}
                    >
                      <List.Item.Meta
                        title={
                          <span
                            style={{ cursor: 'pointer', paddingLeft: '20px' }}
                          >
                            {item.title}
                          </span>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Collapse.Panel>
            </Collapse>
          </div>
        </Layout.Sider>

        {/* 中间内容区 */}
        <Layout.Content
          style={{
            background: '#fff',
            minHeight: '100vh',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {selectedNote ? (
            <>
              <FloatButton.Group
                shape="circle"
                style={{
                  right: 24,
                  bottom: 24,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                <FloatButton
                  icon={<VerticalAlignTopOutlined />}
                  tooltip="回到顶部"
                  onClick={() => {
                    const contentElement =
                      document.querySelector('.article-content');
                    if (contentElement) {
                      contentElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      });
                    }
                  }}
                />
                <FloatButton
                  icon={<VerticalAlignBottomOutlined />}
                  tooltip="到达底部"
                  onClick={() => {
                    const commentsElement =
                      document.querySelector('.article-comments');
                    if (commentsElement) {
                      commentsElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'end',
                      });
                    }
                  }}
                />
                <div style={{ marginTop: '120px' }}>
                  <ActionButtons noteId={selectedNote.id} />
                </div>
              </FloatButton.Group>

              <div
                style={{
                  padding: '12px 24px',
                  borderBottom: '1px solid #f0f0f0',
                  background: '#fff',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography.Title level={3} style={{ margin: 0 }}>
                  {selectedNote.title}
                </Typography.Title>
                <Space>
                  <Button
                    type="text"
                    icon={<ShareAltOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(selectedNote.id);
                    }}
                  >
                    分享
                  </Button>
                  <Button type="text" onClick={handleExportMarkdown}>
                    导出为MD
                  </Button>
                  <Button
                    type="text"
                    icon={<TranslationOutlined />}
                    onClick={handleTranslate}
                  >
                    翻译选中文本
                  </Button>
                  {user.id === selectedNote.userId ? (
                    <>
                      <Button
                        type="text"
                        danger
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalVisible(true);
                          setSelectedNoteId(selectedNote.id);
                        }}
                      >
                        删除
                      </Button>
                      {isEditing ? (
                        <Button type="primary" onClick={handleExitEditing}>
                          退出编辑
                        </Button>
                      ) : (
                        <Button
                          type="primary"
                          onClick={() => setIsEditing(true)}
                        >
                          编辑文档
                        </Button>
                      )}
                    </>
                  ) : null}
                </Space>
              </div>
              {/* 翻译结果弹窗 */}
              <Modal
                title="翻译结果"
                open={translationVisible}
                onCancel={() => setTranslationVisible(false)}
                footer={[
                  <Button
                    key="close"
                    onClick={() => setTranslationVisible(false)}
                  >
                    关闭
                  </Button>,
                ]}
              >
                <Typography.Paragraph>{translatedText}</Typography.Paragraph>
              </Modal>
              <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                <Space size={[0, 8]} wrap className="mb-4">
                  {selectedNote.tags.map((tag) => (
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
                </Space>
                {isEditing ? (
                  <NoteForm
                    initialValues={selectedNote}
                    onSubmit={handleSubmit}
                    submitButtonText="保存笔记"
                  />
                ) : (
                  <>
                    <div
                      className="article-content"
                      dangerouslySetInnerHTML={{ __html: selectedNote.content }}
                    />
                    <div
                      className="article-comments"
                      style={{
                        marginTop: '40px',
                        borderTop: '1px solid #f0f0f0',
                        paddingTop: '24px',
                      }}
                    >
                      <CommentList noteId={selectedNote.id} />
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              请从左侧目录选择一篇文章
            </div>
          )}
        </Layout.Content>

        {/* 右侧大纲 */}
        <Layout.Sider
          width={300}
          style={{
            background: '#fff',
            borderLeft: '1px solid #f0f0f0',
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflowY: 'auto',
          }}
        >
          {selectedNote && (
            <OutlineExtractor
              content={selectedNote.content}
              onHeadingClick={(id) => {
                const element = document.getElementById(id);
                if (element) {
                  element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }
              }}
            />
          )}
        </Layout.Sider>
      </Layout>

      {/* 删除确认弹窗 */}
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
        okText="确认删除"
        cancelText="取消"
      >
        <p>确定要删除这篇笔记吗？操作不可撤销。</p>
      </Modal>
      {/* 编辑知识库弹窗 */}
      <EditCategoryModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onSuccess={() => {
          fetchCategoryData();
        }}
        initialValues={categoryData}
      />
    </Layout>
  );
};

export default CategoryNotes;
