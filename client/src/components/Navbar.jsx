import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  Modal,
  Input,
  List,
  Tag,
  Space,
  Row,
  Col,
  message,
} from 'antd';
import UserProfileForm from './UserProfileForm';
import {
  HomeOutlined,
  BookOutlined,
  FolderOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { getCategories } from '@/api/categoryApi';
import { getNotes } from '@/api/noteApi';
import { useStore } from '@/store/userStore';

const { Sider } = Layout;

const Navbar = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [openKeys, setOpenKeys] = useState([]); // 👈 控制展开子菜单
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories(user.id);
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = async () => {
    if (!searchKeyword.trim()) return;
    setSearching(true);
    try {
      const response = await getNotes(user.id);
      const filteredNotes = response.data.filter(
        (note) =>
          note.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          note.content.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          note.tags.some((tag) =>
            tag.toLowerCase().includes(searchKeyword.toLowerCase()),
          ),
      );
      setSearchResults(filteredNotes);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleLogout = () => {
    Modal.confirm({
      title: '确认退出',
      content: '确定要退出登录吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        logout();
        navigate('/login');
      },
    });
  };

  // 选中高亮
  const selectedKeys = React.useMemo(() => {
    if (location.pathname.startsWith('/notes/categories/')) {
      return [`category-${location.pathname.split('/').pop()}`];
    }
    switch (location.pathname) {
      case '/':
        return ['home'];
      case '/categories':
        return ['categories'];
      case '/notes':
        return ['notes'];
      default:
        return [];
    }
  }, [location.pathname]);

  // 点击 SubMenu 展开/收起
  const handleOpenChange = (keys) => {
    // 只允许展开一个 SubMenu，其他收起（accordion 效果）
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey === 'categories') {
      setOpenKeys(keys);
    } else {
      setOpenKeys([]);
    }
  };

  return (
    <Sider
      width={250}
      style={{
        height: '100vh',

        position: 'fixed',
        left: 0,
        backgroundColor: '#fff',
      }}
    >
      <div
        style={{
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <h1 style={{ color: '#333', margin: 0 }}>EasyNote</h1>
        <img
          src={user.avatar_url}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            cursor: 'pointer',
          }}
          onClick={() => setProfileModalVisible(true)}
        />
      </div>
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        style={{
          borderRight: 0,
          backgroundColor: '#fff',
          color: '#333',
        }}
        items={[
          {
            key: 'home',
            label: '首页',
            icon: <HomeOutlined />,
            onClick: () => navigate('/'),
          },
          {
            key: 'search',
            label: '搜索',
            icon: <SearchOutlined />,
            onClick: () => setSearchModalVisible(true),
          },
          {
            key: 'categories',
            label: '知识库',
            icon: <FolderOutlined />,
            children: categories.map((category) => ({
              key: `category-${category.id}`,
              label: category.name,
              onClick: () => navigate(`/notes/categories/${category.id}`),
            })),
          },
          {
            key: 'notes',
            label: '笔记',
            icon: <BookOutlined />,
            onClick: () => navigate('/notes'),
          },
          {
            key: 'explore',
            label: '逛逛',
            icon: <BookOutlined />,
            onClick: () => navigate('/explore'),
          },
        ]}
      />

      <Modal
        title="搜索笔记"
        open={searchModalVisible}
        onCancel={() => {
          setSearchModalVisible(false);
          setSearchKeyword('');
          setSearchResults([]);
        }}
        footer={null}
        width={800}
      >
        <Input.Search
          placeholder="输入关键词搜索笔记"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onSearch={handleSearch}
          loading={searching}
          enterButton
        />
        <div style={{ marginTop: '16px' }}>
          <List
            itemLayout="horizontal"
            dataSource={searchResults}
            loading={searching}
            renderItem={(item) => {
              const category = categories.find(
                (cat) => cat.id === item.category_id,
              );

              return (
                <List.Item>
                  <List.Item.Meta
                    description={
                      <Row align="middle">
                        <Col flex="300px">
                          <Button
                            type="link"
                            style={{ fontWeight: 500, color: 'black' }}
                            onClick={() => {
                              navigate(`/notes/${item.id}`);
                              setSearchModalVisible(false);
                            }}
                          >
                            {item.title}
                          </Button>
                        </Col>
                        <Col flex="auto">
                          <Space size={[4, 8]} wrap>
                            {item.tags.map((tag) => (
                              <Tag key={tag}>{tag}</Tag>
                            ))}
                          </Space>
                        </Col>
                        <Col flex="auto">
                          {category && (
                            <span className="text-gray-500 text-sm ml-4 mr-4">
                              {user.nickname} / {category.name}
                            </span>
                          )}
                        </Col>
                      </Row>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </div>
      </Modal>

      {/* 用户信息编辑弹窗 */}
      <Modal
        title="编辑个人信息"
        open={profileModalVisible}
        onCancel={() => setProfileModalVisible(false)}
        footer={null}
      >
        <UserProfileForm
          onSuccess={() => {
            setProfileModalVisible(false);
          }}
        />
      </Modal>

      {user && (
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <Button type="link" onClick={handleLogout} style={{ color: 'white' }}>
            退出登录
          </Button>
        </div>
      )}
    </Sider>
  );
};

export default Navbar;
