import pool from "../config/db.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { userId } = req.params;
    const [result] = await pool.query(
      "INSERT INTO categories (name, user_id) VALUES (?, ?)",
      [name, userId]
    );
    res.status(201).json({ id: result.insertId, name, user_id: userId });
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
    const { name } = req.body;
    await pool.query("UPDATE categories SET name = ? WHERE id = ?", [name, id]);
    res.status(200).json({ id, name });
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
