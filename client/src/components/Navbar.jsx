import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Modal, Input, List, message } from 'antd';
import AIHelper from './AIHelper';
import UserProfileForm from './UserProfileForm';
import {
  HomeOutlined,
  FileTextOutlined,
  CompassOutlined,
  LogoutOutlined,
  StarOutlined,
  RobotOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { getCategories } from '@/api/categoryApi';
import { getRecentItems, searchItems } from '@/api/searchApi';
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
  const [searchResults, setSearchResults] = useState({
    notes: [],
    categories: [],
  });
  const [searching, setSearching] = useState(false);
  const [recentItems, setRecentItems] = useState({ notes: [], categories: [] });
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [aiHelperVisible, setAiHelperVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, recentItemsRes] = await Promise.all([
          getCategories(user.id),
          getRecentItems(user.id),
        ]);
        setCategories(categoriesRes.data);
        setRecentItems(recentItemsRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async () => {
    if (!searchKeyword.trim()) return;
    setSearching(true);
    try {
      const response = await searchItems(user.id, searchKeyword);
      setSearchResults(response.data);
    } catch (error) {
      console.error('搜索失败:', error);
      message.error('搜索失败');
    } finally {
      setSearching(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchKeyword(e.target.value);
    setSearchResults({ notes: [], categories: [] });
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
          src={user?.avatar_url}
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
            key: '/',
            label: '首页',
            icon: <HomeOutlined />,
            onClick: () => navigate('/'),
          },
          {
            key: '/',
            label: '搜索',
            icon: <SearchOutlined />,
            onClick: () => setSearchModalVisible(true),
          },
          {
            key: '/notes',
            label: '笔记',
            icon: <FileTextOutlined />,
            onClick: () => navigate('/notes'),
          },
          {
            key: '/stars',
            label: '收藏',
            icon: <StarOutlined />,
            onClick: () => navigate('/stars'),
          },
          {
            key: '/explore',
            label: '发现',
            icon: <CompassOutlined />,
            onClick: () => navigate('/explore'),
          },
          {
            key: 'ai-helper',
            label: 'AI助手',
            icon: <RobotOutlined />,
            onClick: () => setAiHelperVisible(true),
          },
          {
            key: 'logout',
            label: '退出登录',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
          },
        ]}
      />

      <AIHelper
        visible={aiHelperVisible}
        onClose={() => setAiHelperVisible(false)}
      />

      <Modal
        title="搜索"
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
          placeholder="输入关键词搜索笔记/知识库"
          value={searchKeyword}
          onChange={handleSearchInputChange}
          onSearch={handleSearch}
          loading={searching}
          enterButton
        />
        <div style={{ marginTop: '16px' }}>
          {!searchKeyword && (
            <>
              <h3>最近编辑的笔记</h3>
              <List
                itemLayout="horizontal"
                dataSource={recentItems.notes}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
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
                      }
                    />
                  </List.Item>
                )}
              />

              <h3 style={{ marginTop: '16px' }}>最近创建的知识库</h3>
              <List
                itemLayout="horizontal"
                dataSource={recentItems.categories}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Button
                          type="link"
                          style={{ fontWeight: 500, color: 'black' }}
                          onClick={() => {
                            navigate(`/notes/categories/${item.id}`);
                            setSearchModalVisible(false);
                          }}
                        >
                          {item.name}
                        </Button>
                      }
                    />
                  </List.Item>
                )}
              />
            </>
          )}

          {searchKeyword && (
            <>
              <h3>笔记</h3>
              <List
                itemLayout="horizontal"
                dataSource={searchResults.notes}
                loading={searching}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
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
                      }
                    />
                  </List.Item>
                )}
              />

              <h3 style={{ marginTop: '16px' }}>知识库</h3>
              <List
                itemLayout="horizontal"
                dataSource={searchResults.categories}
                loading={searching}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Button
                          type="link"
                          style={{ fontWeight: 500, color: 'black' }}
                          onClick={() => {
                            navigate(`/notes/categories/${item.id}`);
                            setSearchModalVisible(false);
                          }}
                        >
                          {item.name}
                        </Button>
                      }
                    />
                  </List.Item>
                )}
              />
            </>
          )}
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
    </Sider>
  );
};

export default Navbar;
