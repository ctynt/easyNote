import pool from "../config/db.js";

// 获取单篇笔记的统计信息（点赞数来自 actions 表，收藏数来自 star_content 表）
export const getNoteStats = async (req, res) => {
  try {
    const { noteId } = req.params;

    // 获取点赞数量
    const [likeRows] = await pool.query(
      `SELECT COUNT(*) AS like_count
       FROM actions 
       WHERE note_id = ? AND type = 0`,
      [noteId]
    );

    // 获取收藏数量（去重用户 ID）
    const [starRows] = await pool.query(
      `SELECT COUNT(DISTINCT user_id) AS favorite_count
       FROM star_content
       WHERE note_id = ?`,
      [noteId]
    );

    console.log(
      "likeCount",
      likeRows[0].like_count,
      "favoriteCount",
      starRows[0].favorite_count
    );

    res.status(200).json({
      likeCount: likeRows[0].like_count || 0,
      favoriteCount: starRows[0].favorite_count || 0,
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

    // 获取点赞数量（type = 0）
    const [likeCounts] = await pool.query(
      `SELECT 
        note_id,
        COUNT(*) AS like_count
       FROM actions
       WHERE note_id IN (?) AND type = 0
       GROUP BY note_id`,
      [noteIds]
    );

    // 获取收藏数量（每个用户只计一次）
    const [favoriteCounts] = await pool.query(
      `SELECT 
        sc.note_id,
        COUNT(DISTINCT s.user_id) AS favorite_count
       FROM star_content sc
       JOIN stars s ON sc.star_id = s.id
       WHERE sc.note_id IN (?)
       GROUP BY sc.note_id`,
      [noteIds]
    );

    // 合并结果
    const statsMap = {};

    likeCounts.forEach(({ note_id, like_count }) => {
      if (!statsMap[note_id]) statsMap[note_id] = {};
      statsMap[note_id].likeCount = like_count;
    });

    favoriteCounts.forEach(({ note_id, favorite_count }) => {
      if (!statsMap[note_id]) statsMap[note_id] = {};
      statsMap[note_id].favoriteCount = favorite_count;
    });

    // 构造完整结果，确保每个 noteId 都有值
    const result = noteIds.reduce((acc, noteId) => {
      acc[noteId] = {
        likeCount: statsMap[noteId]?.likeCount || 0,
        favoriteCount: statsMap[noteId]?.favoriteCount || 0,
      };
      return acc;
    }, {});

    res.status(200).json(result);
  } catch (error) {
    console.error("Get batch note stats failed:", error);
    res.status(500).json({ error: error.message });
  }
};
