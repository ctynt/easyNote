import axios from "axios";
import md5 from "md5";

// 百度翻译API配置
const BAIDU_API_URL = "https://fanyi-api.baidu.com/api/trans/vip/translate";
const BAIDU_APP_ID = "20250510002353944";
const BAIDU_SECRET_KEY = "TSRayBNHV56ZeMXjh1mM";

// 生成随机字符串
const generateSalt = () => {
  return Math.random().toString(36).substr(2);
};

// 生成签名
const generateSign = (text, salt) => {
  const str = BAIDU_APP_ID + text + salt + BAIDU_SECRET_KEY;
  return md5(str);
};

// 翻译文本控制器
export const translateText = async (req, res) => {
  try {
    const { text, from = "auto", to = "zh" } = req.body;
    const targetLang = to || (text.match(/[\u4e00-\u9fa5]/) ? "en" : "zh");
    const sourceLang = from || (text.match(/[\u4e00-\u9fa5]/) ? "zh" : "en");
    const salt = generateSalt();
    const sign = generateSign(text, salt);

    // 调用百度翻译API进行翻译
    const params = {
      q: text,
      from: sourceLang,
      to: targetLang,
      appid: BAIDU_APP_ID,
      salt,
      sign,
    };
    console.log("请求参数 params:", params);

    const response = await axios.get(BAIDU_API_URL, { params });
    res.json({ translation: response.data.trans_result[0].dst });
  } catch (error) {
    console.error("Translation failed:", error);
    res.status(500).json({ error: "翻译服务出错" });
  }
};
