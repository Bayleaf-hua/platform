# 老字号文化传承平台

一个展示和传承中华老字号文化的全栈Web应用平台。

## 功能特性

- 🏛️ **品牌名录展示**：展示多个中华老字号品牌的基本信息
- 🔍 **智能搜索**：支持按品牌名称、类别、关键词等搜索
- 📜 **历史时间线**：展示老字号品牌的历史发展时间线
- 💬 **智能问答助手**：基于DeepSeek AI模型，提供专业的老字号文化问答服务
- 📱 **响应式设计**：适配各种设备屏幕

## 技术栈

### 后端
- Node.js
- Express.js
- DeepSeek AI API（智能问答）
- JSON数据存储（后续可升级为数据库）

### 前端
- HTML5
- CSS3
- Bootstrap 5
- 原生JavaScript

## 项目结构

```
.
├── server.js              # 后端服务器主文件
├── package.json           # 项目依赖配置
├── .env.example           # 环境变量配置示例
├── services/              # 服务模块目录
│   └── aiService.js       # DeepSeek AI服务模块
├── data/                  # 数据文件目录
│   ├── brands.json        # 品牌数据
│   └── timeline.json      # 时间线数据
├── public/                # 前端静态文件目录
│   └── index.html         # 前端主页面
└── README.md              # 项目说明文档
```

## 安装与运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置DeepSeek API密钥

创建 `.env` 文件（参考 `.env.example`），并配置您的DeepSeek API密钥：

```bash
# 复制示例文件
cp .env.example .env

# 编辑.env文件，填入您的API密钥
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

**获取DeepSeek API密钥：**
1. 访问 [DeepSeek平台](https://platform.deepseek.com/)
2. 注册/登录账号
3. 在控制台创建API密钥
4. 将密钥填入 `.env` 文件

### 3. 启动服务器

```bash
npm start
```

或者使用开发模式（自动重启）：

```bash
npm run dev
```

### 4. 访问应用

打开浏览器访问：http://localhost:3000

## API接口说明

### 获取所有品牌
```
GET /api/brands
```

### 搜索品牌
```
GET /api/brands/search?q=关键词
```

### 获取品牌详情
```
GET /api/brands/:id
```

### 获取时间线数据
```
GET /api/timeline
```

### 聊天接口（DeepSeek AI）
```
POST /api/chat
Body: { 
    "message": "用户消息",
    "sessionId": "会话ID（可选）" 
}
Response: { 
    "response": "AI回复内容", 
    "timestamp": "时间戳",
    "sessionId": "会话ID"
}

# 清除对话历史
POST /api/chat/clear
Body: { "sessionId": "会话ID（可选）" }
```

## 后续开发计划

- [x] 接入DeepSeek AI模型，实现智能问答
- [ ] 添加数据库支持（MySQL/MongoDB）
- [ ] 添加用户系统
- [ ] 添加品牌图片上传功能
- [ ] 添加地图功能，展示老字号地理位置
- [ ] 添加更多品牌数据
- [ ] 优化UI/UX设计

## 注意事项

- **DeepSeek API密钥**：必须配置有效的API密钥才能使用智能问答功能
- **API费用**：DeepSeek API按使用量计费，请关注使用情况
- **数据存储**：数据存储在JSON文件中，生产环境建议使用数据库
- **对话历史**：当前使用内存存储对话历史，服务器重启后会丢失（生产环境建议使用Redis或数据库）
- **Node.js版本**：确保Node.js版本 >= 14.0.0

## DeepSeek AI配置说明

### 模型信息
- **模型名称**：deepseek-chat
- **API地址**：https://api.deepseek.com/v1/chat/completions
- **知识库**：系统会自动将品牌数据注入到AI的上下文，确保回答准确性

### 系统提示词
AI助手会自动加载所有品牌信息作为知识库，包括：
- 品牌名称、类别、创立时间
- 品牌历史、特色、关键词
- 地理位置等信息

这样可以确保AI回答的准确性和专业性。

## 许可证

ISC
