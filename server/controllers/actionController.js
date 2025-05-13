import pool from "../config/db.js";

// 获取笔记的点赞和收藏数量
export const getActionCounts = async (req, res) => {
  try {
    const { noteId } = req.params;

    // 获取点赞数量（type = 0）
    const [likes] = await pool.query(
      `SELECT COUNT(*) AS like_count
       FROM actions 
       WHERE note_id = ? AND type = 0`,
      [noteId]
    );

    // 获取收藏数量，从 star_content 中统计，去重用户
    const [favorites] = await pool.query(
      `SELECT COUNT(DISTINCT s.user_id) AS favorite_count
       FROM star_content sc
       JOIN stars s ON sc.star_id = s.id
       WHERE sc.note_id = ?`,
      [noteId]
    );

    res.status(200).json({
      likeCount: likes[0].like_count || 0,
      favoriteCount: favorites[0].favorite_count || 0,
    });
  } catch (error) {
    console.error("Get action counts failed:", error);
    res.status(500).json({ error: error.message });
  }
};

// 创建或取消操作（点赞/收藏）
export const createAction = async (req, res) => {
  try {
    const { note_id, type, user_id } = req.body;

    const [existing] = await pool.query(
      "SELECT id FROM actions WHERE user_id = ? AND note_id = ? AND type = ?",
      [user_id, note_id, type]
    );

    if (existing.length > 0) {
      await pool.query("DELETE FROM actions WHERE id = ?", [existing[0].id]);
      res.status(200).json({ message: "操作已取消", status: false });
    } else {
      await pool.query(
        "INSERT INTO actions (user_id, note_id, type) VALUES (?, ?, ?)",
        [user_id, note_id, type]
      );
      res.status(201).json({ message: "操作成功", status: true });
    }
  } catch (error) {
    console.error("Action operation failed:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getActionStatus = async (req, res) => {
  try {
    const { userId, noteId } = req.params;

    console.log(`查询状态 -> note_id: ${noteId} user_id: ${userId}`);

    // 查询点赞状态（actions 表）
    const [likeRows] = await pool.query(
      "SELECT 1 FROM actions WHERE user_id = ? AND note_id = ? AND type = 0 LIMIT 1",
      [userId, noteId]
    );

    // 查询收藏状态（star_content 表）
    const [starRows] = await pool.query(
      "SELECT 1 FROM star_content WHERE user_id = ? AND note_id = ? LIMIT 1",
      [userId, noteId]
    );

    const status = {
      liked: likeRows.length > 0,
      favorited: starRows.length > 0,
    };

    res.status(200).json(status);
  } catch (error) {
    console.error("Get action status failed:", error);
    res.status(500).json({ error: error.message });
  }
};
