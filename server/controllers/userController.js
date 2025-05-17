import pool from "../config/db.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
 
    // 验证必填字段
    if (!username || !email || !password) {
      return res.status(400).json({ error: "用户名、邮箱和密码为必填项" });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "邮箱格式不正确" });
    }

    // 检查用户名是否已存在
    const [existingUsername] = await pool.query(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );
    if (existingUsername.length > 0) {
      return res.status(400).json({ error: "用户名已被使用" });
    }

    // 检查邮箱是否已存在
    const [existingEmail] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existingEmail.length > 0) {
      return res.status(400).json({ error: "邮箱已被注册" });
    }

    const nickname = username;
    const avatar_url =
      "https://ctynt-oss.oss-cn-hangzhou.aliyuncs.com/origin.png";

    const [result] = await pool.query(
      "INSERT INTO users (username,email,password,nickname,avatar_url) VALUES(?,?,?,?,?)",
      [username, email, password, nickname, avatar_url]
    );
    res
      .status(201)
      .json({ id: result.insertId, username, email, nickname, avatar_url });
  } catch (error) {
    res.status(500).json({ error: "注册失败，请稍后重试" });
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
