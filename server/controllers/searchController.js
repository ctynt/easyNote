import pool from "../config/db.js";

// 获取最近的笔记和知识库
export const getRecentItems = async (req, res) => {
  try {
    const { userId } = req.params;

    // 获取最近编辑的3条笔记
    const [recentNotes] = await pool.query(
      `SELECT * FROM notes 
       WHERE user_id = ? 
       ORDER BY updated_at DESC 
       LIMIT 3`,
      [userId]
    );

    // 获取最近创建的3个知识库
    const [recentCategories] = await pool.query(
      `SELECT * FROM categories 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 3`,
      [userId]
    );

    res.status(200).json({
      notes: recentNotes,
      categories: recentCategories,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 搜索笔记和知识库
export const searchItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const { keyword } = req.query;

    // 搜索笔记
    const [notes] = await pool.query(
      `SELECT * FROM notes 
       WHERE user_id = ? 
       AND (title LIKE ? OR content LIKE ?)
       ORDER BY updated_at DESC`,
      [userId, `%${keyword}%`, `%${keyword}%`]
    );

    // 搜索知识库
    const [categories] = await pool.query(
      `SELECT * FROM categories 
       WHERE user_id = ? 
       AND (name LIKE ? OR description LIKE ?)
       ORDER BY created_at DESC`,
      [userId, `%${keyword}%`, `%${keyword}%`]
    );

    res.status(200).json({
      notes,
      categories,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
