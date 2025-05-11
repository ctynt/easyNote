// controllers/uploadController.js
import OSS from "ali-oss";
import multer from "multer";
import path from "path";

// 配置阿里云OSS客户端
const client = new OSS({
  region: process.env.OSS_REGION,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET,
});

// 配置multer中间件，用于处理文件上传
const storage = multer.memoryStorage();
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 限制文件大小为5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("只允许上传JPG、PNG、GIF格式的图片"));
    }
  },
}).single("image");

// 处理图片上传
export const uploadImage = async (req, res) => {
  try {
    const ext = path.extname(req.file.originalname);
    const filename = `${Date.now()}${ext}`;

    const result = await client.put(filename, req.file.buffer);

    res.json({
      success: true,
      url: result.url,
    });
  } catch (error) {
    console.error("Failed to upload image:", error);
    res.status(500).json({
      success: false,
      message: "图片上传失败",
    });
  }
};
