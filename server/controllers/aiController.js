import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY;
const API_URL =
  "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation";

export const chatWithAI = async (req, res) => {
  try {
    const { question } = req.body;

    const response = await axios.post(
      API_URL,
      {
        model: "qwen-turbo",
        input: {
          messages: [
            {
              role: "user",
              content: question,
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${DASHSCOPE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const answer = response.data.output.text;
    res.json({ answer });
  } catch (error) {
    console.error("AI API调用失败:", error);
    res.status(500).json({ error: "获取AI回答失败" });
  }
};
