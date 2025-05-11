import React from 'react';
import { useEffect, useState } from 'react';
import { message, Layout } from 'antd';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Categories = () => {
  const navigate = useNavigate();
  const { user } = useStore();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate]);

  return (
    <Layout>
      <Navbar />
      <Layout style={{ marginLeft: 200 }}>
        <Layout.Content
          style={{ padding: '24px', minHeight: '100vh', background: '#fff' }}
        >
          heel
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default Categories;
