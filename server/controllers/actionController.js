import pool from "../config/db.js";

// 获取笔记的点赞和收藏数量
export const getActionCounts = async (req, res) => {
  try {
    const { noteId } = req.params;
    const [counts] = await pool.query(
      `SELECT 
        SUM(type = 0) as like_count,
        SUM(type = 1) as favorite_count
      FROM actions 
      WHERE note_id = ?`,
      [noteId]
    );

    res.status(200).json({
      likeCount: counts[0].like_count || 0,
      favoriteCount: counts[0].favorite_count || 0,
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

// controllers/actionController.js
export const getActionStatus = async (req, res) => {
  try {
    const { userId, noteId } = req.params; // 👈 param 名字和 router 一致

    console.log(`查询状态 -> note_id: ${noteId} user_id: ${userId}`);

    const [actions] = await pool.query(
      "SELECT type FROM actions WHERE user_id = ? AND note_id = ?",
      [userId, noteId]
    );

    const status = {
      liked: false,
      favorited: false,
    };

    actions.forEach((action) => {
      if (action.type === 0) status.liked = true;
      if (action.type === 1) status.favorited = true;
    });

    res.status(200).json(status);
  } catch (error) {
    console.error("Get action status failed:", error);
    res.status(500).json({ error: error.message });
  }
};
