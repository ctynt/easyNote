import dotenv from "dotenv";
import OpenAI from "openai";
dotenv.config();

export const chatWithAI = async (req, res) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  });
  try {
    const { question } = req.query;

    const completion = await openai.chat.completions.create({
      model: "qwen-plus", //此处以qwen-plus为例，可按需更换模型名称。模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: question },
      ],
    });

    const answer = completion.choices?.[0]?.message?.content || "无响应";
    console.log("AI Response:", answer);
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: "获取AI回答失败" });
  }
};
