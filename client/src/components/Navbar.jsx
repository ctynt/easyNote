import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Modal } from 'antd';
import { HomeOutlined, BookOutlined, FolderOutlined } from '@ant-design/icons';
import { getCategories } from '@/api/categoryApi';
import { useStore } from '@/store/userStore';

const { Sider } = Layout;

const Navbar = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [openKeys, setOpenKeys] = useState([]); // 👈 控制展开子菜单

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

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
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        backgroundColor: '#fff',
      }}
    >
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <h1 style={{ color: '#333', margin: 0 }}>笔记应用</h1>
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
