import pool from "../config/db.js";

// 获取笔记的统计信息（点赞数和收藏数）
export const getNoteStats = async (req, res) => {
  try {
    const { noteId } = req.params;

    // 获取点赞和收藏数量
    const [actionCounts] = await pool.query(
      `SELECT 
        SUM(type = 0) as like_count,
        SUM(type = 1) as favorite_count
      FROM actions 
      WHERE note_id = ?`,
      [noteId]
    );

    res.status(200).json({
      likeCount: actionCounts[0].like_count || 0,
      favoriteCount: actionCounts[0].favorite_count || 0,
    });
  } catch (error) {
    console.error("Get note stats failed:", error);
    res.status(500).json({ error: error.message });
  }
};

// 批量获取多个笔记的统计信息
export const getBatchNoteStats = async (req, res) => {
  try {
    const { noteIds } = req.body;

    if (!Array.isArray(noteIds) || noteIds.length === 0) {
      return res.status(400).json({ error: "Invalid note IDs" });
    }

    // 获取所有笔记的点赞和收藏数量
    const [actionCounts] = await pool.query(
      `SELECT 
        note_id,
        SUM(type = 0) as like_count,
        SUM(type = 1) as favorite_count
      FROM actions 
      WHERE note_id IN (?)
      GROUP BY note_id`,
      [noteIds]
    );

    // 将结果转换为以note_id为键的对象
    const statsMap = actionCounts.reduce((acc, curr) => {
      acc[curr.note_id] = {
        likeCount: curr.like_count || 0,
        favoriteCount: curr.favorite_count || 0,
      };
      return acc;
    }, {});

    // 确保所有请求的笔记ID都有对应的统计数据
    const result = noteIds.reduce((acc, noteId) => {
      acc[noteId] = statsMap[noteId] || { likeCount: 0, favoriteCount: 0 };
      return acc;
    }, {});

    res.status(200).json(result);
  } catch (error) {
    console.error("Get batch note stats failed:", error);
    res.status(500).json({ error: error.message });
  }
};
