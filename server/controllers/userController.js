import pool from "../config/db.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, nickname, avatar_url } = req.body;
    nickname = username;
    avatar_url = "https://ctynt-oss.oss-cn-hangzhou.aliyuncs.com/origin.png";
    const [result] = await pool.query(
      "INSERT INTO users (username,email,password,nickname) VALUES(?,?,?)",
      [username, email, password, nickname]
    );
    res.status(201).json({ id: result.insertId, username, email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username  = ? AND password = ? ",
      [username, password]
    );
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(401).json({ error: "Invalid  credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM users WHERE id =?", [id]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, nickname, avatar_url } = req.body;

    await pool.query(
      "UPDATE users SET username = ?, email = ?, nickname = ?, avatar_url = ? WHERE id = ?",
      [username, email, nickname, avatar_url, id]
    );

    res.status(200).json({ id, username, email, nickname, avatar_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
