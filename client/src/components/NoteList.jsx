import React, { useState } from 'react';
import { List, Tag, Button, Modal, Space, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/userStore';

const NoteList = ({ notes, categories, onDeleteNote }) => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={notes}
        className="rounded-lg shadow"
        renderItem={(item) => {
          const category = categories.find(
            (cat) => cat.id === item.category_id,
          );

          return (
            <List.Item
              actions={[
                <Button
                  key="view"
                  type="link"
                  onClick={() => navigate(`/notes/${item.id}`)}
                >
                  查看
                </Button>,
                <Button
                  key="edit"
                  type="link"
                  onClick={() => navigate(`/notes/edit/${item.id}`)}
                >
                  编辑
                </Button>,
                <Button
                  key="delete"
                  type="link"
                  danger
                  onClick={() => {
                    setModalVisible(true);
                    setSelectedNoteId(item.id);
                  }}
                >
                  删除
                </Button>,
              ]}
            >
              <List.Item.Meta
                description={
                  <Row align="middle">
                    <Col flex="300px">
                      <Button
                        type="link"
                        style={{ fontWeight: 500, color: 'black' }}
                        onClick={() => navigate(`/notes/${item.id}`)}
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
                    <Col flex="100px">
                      {category && (
                        <span className="text-gray-500 text-sm ml-4">
                          {user.username} / {category.name}
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

      <Modal
        title="确认删除"
        open={modalVisible}
        onOk={async () => {
          await onDeleteNote(selectedNoteId);
          setModalVisible(false);
          setSelectedNoteId(null);
        }}
        onCancel={() => {
          setModalVisible(false);
          setSelectedNoteId(null);
        }}
      >
        <p>确定要删除这条笔记吗？此操作不可恢复。</p>
      </Modal>
    </>
  );
};

export default NoteList;
