import React from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginUser } from '@/api/userApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login = () => {
  const { setUser } = useStore();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      const response = await loginUser(values);
      setUser(response.data);
      message.success('登录成功');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      message.error('用户名或密码错误');
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{
        backgroundImage: 'linear-gradient(to top right, #208cb6, #f886b3)',
      }}
    >
      <div
        className="flex flex-row bg-white bg-opacity-10 rounded-xl shadow-lg backdrop-blur-md border border-white border-opacity-30 overflow-hidden"
        style={{ height: '400px' }} // 整体高度 450px
      >
        {/* 图片区域 */}
        <img
          src="https://ctynt-oss.oss-cn-hangzhou.aliyuncs.com/blueSky/bg1.jpg"
          alt="背景图"
          style={{
            width: '400px',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* 登录框 */}
        <div
          className="p-8 flex flex-col justify-center"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
            width: '400px',
            height: '100%',
          }}
        >
          <Title
            level={2}
            className="text-center mb-6"
            style={{ color: 'white' }}
          >
            登录
          </Title>
          <Form name="login_form" onFinish={onSubmit} className="space-y-6">
            <Form.Item
              name="username"
              initialValue="ctynt"
              rules={[{ required: true, message: '请输入用户名！' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </Form.Item>
            <Form.Item
              name="password"
              initialValue="123456"
              rules={[{ required: true, message: '请输入密码！' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </Form.Item>
            <Button type="primary" className="w-full py-2" htmlType="submit">
              登录
            </Button>
          </Form>
          <div className="text-center mt-4 text-white">
            还没有账号？
            <a
              href="/register"
              style={{ color: '#fff', textDecoration: 'underline' }}
            >
              去注册
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
