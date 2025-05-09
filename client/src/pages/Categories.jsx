import React, { useState, useEffect } from 'react';
import { List, Card, Layout } from 'antd';
import { getCategories } from '@/api/categoryApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const category = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        alert('获取分类失败');
      }
    };
    fetchCategoriesData();
  }, []);

  return (
    <>
      <Layout>
        <Navbar />
        <Layout style={{ marginLeft: 200 }}>
          <Layout.Content
            className="p-6 bg-gray-50"
            style={{ overflow: 'hidden' }}
          >
            <h1>分类列表</h1>
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={categories}
              renderItem={(item) => (
                <Card hoverable className="m-2">
                  <Card.Meta title={item.name} />
                  <a href={`/notes/categories/${item.id}`}>查看分类笔记</a>
                </Card>
              )}
            />
          </Layout.Content>
        </Layout>
      </Layout>
    </>
  );
};

export default category;
