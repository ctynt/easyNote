import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Modal } from 'antd';
import { HomeOutlined, BookOutlined, FolderOutlined } from '@ant-design/icons';

import { useStore } from '@/store/userStore';

const { Sider } = Layout;
const Navbar = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

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

  const selectedKeys = React.useMemo(() => {
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
  });

  return (
    <Sider
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
      }}
    >
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', margin: 0 }}>笔记应用</h1>
      </div>
      <Menu
        theme="dark"
        mode="vertical"
        selectedKeys={selectedKeys}
        style={{ borderRight: 0 }}
        items={[
          {
            key: 'home',
            label: '首页',
            icon: <HomeOutlined />,
            onClick: () => navigate('/'),
          },
          {
            key: 'categories',
            label: '分类',
            icon: <FolderOutlined />,
            onClick: () => navigate('/categories'),
          },
          {
            key: 'notes',
            label: '笔记',
            icon: <BookOutlined />,
            onClick: () => navigate('/notes'),
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
