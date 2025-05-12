import pool from "../config/db.js";

export const createCategory = async (req, res) => {
  try {
    const { name, description, cover, is_public, user_id } = req.body;
    const coverUrl =
      cover || "https://ctynt-oss.oss-cn-hangzhou.aliyuncs.com/%E8%8A%B1.jpg";
    const [result] = await pool.query(
      "INSERT INTO categories (name, user_id, is_public,description,cover) VALUES (?, ?, ?,?,?)",
      [name, user_id, is_public, description, coverUrl]
    );
    res.status(201).json({
      id: result.insertId,
      name,
      user_id,
      is_public,
      description,
      cover: coverUrl,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM categories WHERE user_id = ?",
      [userId]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [
      id,
    ]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, is_public } = req.body;
    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }

    if (is_public !== undefined) {
      updateFields.push("is_public = ?");
      updateValues.push(is_public ? 1 : 0);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    updateValues.push(id);
    await pool.query(
      `UPDATE categories SET ${updateFields.join(", ")} WHERE id = ?`,
      updateValues
    );

    const [updatedCategory] = await pool.query(
      "SELECT * FROM categories WHERE id = ?",
      [id]
    );

    res.status(200).json(updatedCategory[0]);
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

export const getPublicCategories = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        categories.*, 
        users.nickname, 
        users.avatar_url 
      FROM categories
      JOIN users ON categories.user_id = users.id
      WHERE categories.is_public = 1`
    );
    res.status(200).json(rows); // 返回所有公开分类，包含用户信息
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
