import pool from "../config/db.js";

// 获取文章评论列表
export const getComments = async (req, res) => {
  try {
    const { note_id } = req.params;
    const [rows] = await pool.query(
      `
      SELECT  
        c.id AS comment_id,  
        c.content,  
        c.user_id,  
        c.created_at,  
        u.nickname,  
        u.avatar_url
      FROM comments c  
      LEFT JOIN users u ON c.user_id = u.id  
      WHERE c.note_id = ?  
      ORDER BY c.created_at DESC
      `,
      [note_id]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('获取评论失败：', error);
    res.status(500).json({ error: error.message });
  }
};


// 添加评论
export const addComment = async (req, res) => {
  try {
    const { note_id, content, user_id } = req.body;
    const result = await pool.query(
      "INSERT INTO comments (note_id, content, user_id) VALUES (?, ?, ?)",
      [note_id, content, user_id]
    );

    // 获取新添加的评论详情（包含用户信息）
    const [newComment] = await pool.query(
      "SELECT c.*, u.username, u.avatar_url FROM comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.id = ?",
      [result.insertId]
    );

    res.json({ success: true, data: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, message: "添加评论失败" });
  }
};

// 删除评论
export const deleteComment = async (req, res) => {
  try {
    const { id} = req.params;

    await pool.query("DELETE FROM comments WHERE id = ?", [id]);
    res.json({ success: true, message: "评论删除成功" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ success: false, message: "删除评论失败" });
  }
};
