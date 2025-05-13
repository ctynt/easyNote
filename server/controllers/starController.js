import pool from "../config/db.js";

// 工具函数：统一错误处理
const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: error.message });
};

// 创建收藏夹
export const createStar = async (req, res) => {
  const { name, description, userId } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO stars (name, description, user_id) VALUES (?, ?, ?)",
      [name, description, userId]
    );
    res.status(201).json({
      id: result.insertId,
      name,
      description,
      user_id: userId,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// 获取用户的收藏夹列表
export const getStars = async (req, res) => {
  const { userId } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM stars WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    res.json(rows);
  } catch (error) {
    handleError(res, error);
  }
};

// 获取收藏夹详情
export const getStarById = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM stars WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "收藏夹不存在" });
    }

    res.json(rows[0]);
  } catch (error) {
    handleError(res, error);
  }
};

// 更新收藏夹信息
export const updateStar = async (req, res) => {
  const { id } = req.params;
  const { name, description, userId } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE stars SET name = ?, description = ?  WHERE id = ? AND user_id = ?",
      [name, description, id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "收藏夹不存在" });
    }

    res.json({ id, name, description, user_id: userId });
  } catch (error) {
    handleError(res, error);
  }
};

// 删除收藏夹
export const deleteStar = async (req, res) => {
  const { id, userId } = req.params;

  try {
    await pool.query("DELETE FROM star_content WHERE star_id = ?", [id]);

    const [result] = await pool.query(
      "DELETE FROM stars WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "收藏夹不存在" });
    }

    res.json({ message: "收藏夹删除成功" });
  } catch (error) {
    handleError(res, error);
  }
};

// 添加内容到收藏夹
export const addStarContent = async (req, res) => {
  const { id } = req.params;
  const { note_id, userId } = req.body;

  try {
    const [stars] = await pool.query(
      "SELECT * FROM stars WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (stars.length === 0) {
      return res.status(404).json({ message: "收藏夹不存在" });
    }

    const [existing] = await pool.query(
      "SELECT * FROM star_content WHERE star_id = ? AND note_id = ?",
      [id, note_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "该笔记已在收藏夹中" });
    }

    const [result] = await pool.query(
      "INSERT INTO star_content (star_id, note_id,user_id) VALUES (?, ?,?)",
      [id, note_id, userId]
    );

    res.status(201).json({ star_id: id, note_id, user_id: userId });
  } catch (error) {
    handleError(res, error);
  }
};

// 从收藏夹移除内容
export const removeStarContent = async (req, res) => {
  const { id } = req.params;
  const { noteId, userId } = req.body;

  try {
    const [stars] = await pool.query(
      "SELECT * FROM stars WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (stars.length === 0) {
      return res.status(404).json({ message: "收藏夹不存在" });
    }

    const [result] = await pool.query(
      "DELETE FROM star_content WHERE star_id = ? AND note_id = ?",
      [id, noteId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "内容不存在于该收藏夹" });
    }

    res.json({ message: "内容已从收藏夹移除" });
  } catch (error) {
    handleError(res, error);
  }
};

/// 获取收藏夹内容列表
export const getStarContent = async (req, res) => {
  const { id, userId } = req.params;

  try {
    const [stars] = await pool.query(
      "SELECT * FROM stars WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (stars.length === 0) {
      return res.status(404).json({ message: "收藏夹不存在" });
    }

    const [rows] = await pool.query(
      `SELECT n.*, u.nickname, u.avatar_url 
         FROM star_content sc 
         JOIN notes n ON sc.note_id = n.id 
         JOIN users u ON n.user_id = u.id 
         WHERE sc.star_id = ? 
         ORDER BY sc.created_at DESC`,
      [id]
    );

    res.json(rows);
  } catch (error) {
    handleError(res, error);
  }
};

// 获取笔记的收藏状态
export const getStarsByNoteId = async (req, res) => {
  const { noteId, userId } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT s.* 
       FROM stars s
       JOIN star_content sc ON s.id = sc.star_id
       WHERE sc.note_id = ? AND s.user_id = ?
       ORDER BY s.created_at DESC`,
      [noteId, userId]
    );

    res.json(rows);
  } catch (error) {
    handleError(res, error);
  }
};

// 获取用户所有收藏内容列表
export const getAllStarContent = async (req, res) => {
  const { userId } = req.params;

  try {
    // 获取用户收藏的笔记（来自 star_content 表）
    const [starredContents] = await pool.query(
      `SELECT DISTINCT n.*, u.nickname, u.avatar_url, 'star' as source
         FROM star_content sc
         JOIN notes n ON sc.note_id = n.id
         JOIN users u ON n.user_id = u.id
         WHERE sc.user_id = ?`,
      [userId]
    );

    res.json(starredContents);
  } catch (error) {
    console.error("Get all starred content failed:", error);
    res.status(500).json({ error: error.message });
  }
};
