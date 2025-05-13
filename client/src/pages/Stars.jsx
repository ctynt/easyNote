import React, { useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  List,
  Tag,
  Button,
  message,
  Col,
  Row,
  Popover,
  Modal,
  Form,
  Input,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import {
  getStars,
  getStarContents,
  getAllStarContents,
  updateStar,
  deleteStar,
} from '@/api/starApi';

const Stars = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [stars, setStars] = useState([]);
  const [selectedStar, setSelectedStar] = useState('all');
  const [starContents, setStarContents] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentStar, setCurrentStar] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchStars();
  }, [user, navigate]);

  useEffect(() => {
    if (selectedStar === 'all') {
      fetchAllStarContents();
    } else if (selectedStar) {
      fetchStarContents();
    }
  }, [selectedStar]);

  const fetchStars = async () => {
    try {
      const response = await getStars(user.id);
      setStars(response.data);
    } catch (error) {
      console.error('Failed to fetch stars:', error);
      message.error('获取收藏夹失败');
    }
  };

  const fetchStarContents = async () => {
    try {
      const response = await getStarContents(selectedStar, user.id);
      setStarContents(response.data);
    } catch (error) {
      console.error('Failed to fetch star contents:', error);
      message.error('获取收藏内容失败');
    }
  };

  const fetchAllStarContents = async () => {
    try {
      const response = await getAllStarContents(user.id);
      setStarContents(response.data);
    } catch (error) {
      console.error('Failed to fetch all star contents:', error);
      message.error('获取全部收藏内容失败');
    }
  };

  const handleEditStar = (star) => {
    setCurrentStar(star);
    form.setFieldsValue({
      name: star.name,
      description: star.description,
    });
    setEditModalVisible(true);
  };

  const handleUpdateStar = async (values) => {
    try {
      await updateStar(currentStar.id, {
        name: values.name,
        description: values.description,
        userId: user.id,
      });

      message.success('更新收藏夹成功');
      setEditModalVisible(false);
      form.resetFields();
      fetchStars();
    } catch (error) {
      console.error('Failed to update star:', error);
      message.error('更新收藏夹失败');
    }
  };

  const handleDeleteStar = async (starId) => {
    try {
      await deleteStar(user.id, starId);
      message.success('删除收藏夹成功');
      if (selectedStar === starId) {
        setSelectedStar('all');
      }
      console.log('请求路径：', `/stars/delete/${user.id}/${starId}`);

      fetchStars();
    } catch (error) {
      console.log('请求路径：', `/stars/delete/${user.id}/${starId}`);
      console.error('Failed to delete star:', error);
      message.error('删除收藏夹失败');
    }
  };

  const menuItems = [
    { key: 'all', label: '全部收藏' },
    ...stars.map((star) => ({
      key: star.id,
      label: (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{star.name}</span>
          <Popover
            content={
              <div>
                <Button
                  className="me-2"
                  type="text"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditStar(star);
                  }}
                >
                  编辑
                </Button>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    Modal.confirm({
                      title: '确认删除',
                      content: '确定要删除这个收藏夹吗？',
                      onOk: () => handleDeleteStar(star.id),
                    });
                  }}
                >
                  删除
                </Button>
              </div>
            }
            trigger="hover"
            placement="right"
          >
            <Button
              type="text"
              size="small"
              onClick={(e) => e.stopPropagation()}
              style={{ marginLeft: 8 }}
            >
              :
            </Button>
          </Popover>
        </div>
      ),
    })),
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />

      <Layout style={{ marginLeft: 250 }}>
        <Layout.Sider
          width={200}
          style={{
            background: '#fff',
            padding: '24px 0',
            borderRight: '1px solid #f0f0f0',
          }}
        >
          <h2 className="mt-5 font-500 ml-2 mb-2">收藏</h2>
          <Menu
            mode="inline"
            selectedKeys={[selectedStar]}
            items={menuItems}
            onClick={({ key }) => setSelectedStar(key)}
          />
        </Layout.Sider>
        <Layout.Content style={{ padding: '24px', background: '#fff' }}>
          <List
            itemLayout="horizontal"
            dataSource={starContents}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    key="view"
                    type="link"
                    onClick={() => navigate(`/notes/${item.id}`)}
                  >
                    查看
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  description={
                    <Row align="middle" style={{ width: '100%' }} wrap={false}>
                      <Col flex="none">
                        <Button
                          type="link"
                          style={{
                            fontWeight: 500,
                          }}
                          onClick={() => navigate(`/notes/${item.id}`)}
                        >
                          {item.title}
                        </Button>
                      </Col>
                      <Col flex="auto">
                        <div
                          style={{
                            marginLeft: '16px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.tags.map((tag) => (
                            <Tag
                              key={tag}
                              color="cyan"
                              style={{
                                margin: '0 4px',
                                borderRadius: '12px',
                                padding: '4px 12px',
                                display: 'inline-block',
                              }}
                            >
                              {tag}
                            </Tag>
                          ))}
                        </div>
                      </Col>
                    </Row>
                  }
                />
              </List.Item>
            )}
          />
        </Layout.Content>
      </Layout>

      <Modal
        title="编辑收藏夹"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
        }}
        onOk={form.submit}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateStar}>
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入收藏夹名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Stars;
