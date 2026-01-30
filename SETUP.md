# DeepSeek AI 快速配置指南

## 步骤1：获取DeepSeek API密钥

1. 访问 [DeepSeek平台](https://platform.deepseek.com/)
2. 注册或登录您的账号
3. 进入控制台，创建新的API密钥
4. 复制您的API密钥（格式类似：`sk-xxxxxxxxxxxxx`）

## 步骤2：配置环境变量

在项目根目录创建 `.env` 文件：

```bash
# Windows系统
copy env.example.txt .env

# Linux/Mac系统
cp env.example.txt .env
```

然后编辑 `.env` 文件，将 `your_deepseek_api_key_here` 替换为您的实际API密钥：

```
DEEPSEEK_API_KEY=sk-your-actual-api-key-here
```

## 步骤3：安装依赖并启动

```bash
# 安装依赖
npm install

# 启动服务器
npm start
```

## 步骤4：测试AI功能

1. 打开浏览器访问：http://localhost:3000
2. 点击右下角的"💬 老字号问答助手"按钮
3. 尝试提问，例如：
   - "瑞蚨祥是什么品牌？"
   - "全聚德的历史是什么？"
   - "有哪些茶叶类的老字号？"

## 常见问题

### Q: 提示"未配置DeepSeek API密钥"
A: 请检查 `.env` 文件是否存在，并且 `DEEPSEEK_API_KEY` 已正确配置。

### Q: 提示"API密钥无效"
A: 请确认API密钥是否正确，是否从DeepSeek平台正确复制。

### Q: 提示"请求频率过高"
A: DeepSeek API有速率限制，请稍等片刻后再试。

### Q: 如何清除对话历史？
A: 在聊天窗口中点击垃圾桶图标（🗑️）即可清除当前会话的历史记录。

## API费用说明

DeepSeek API按使用量计费，具体价格请参考：
- [DeepSeek定价页面](https://platform.deepseek.com/pricing)

建议在开发阶段关注API使用量，避免产生意外费用。
