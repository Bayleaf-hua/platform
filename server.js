require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { chatWithDeepSeek } = require('./services/aiService');

const app = express();
const PORT = process.env.PORT || 3000;

// 存储对话历史（实际应用中应使用数据库或Redis）
const conversationHistory = new Map();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 读取品牌数据
function getBrandsData() {
    try {
        const dataPath = path.join(__dirname, 'data', 'brands.json');
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('读取品牌数据失败:', error);
        return [];
    }
}

// 读取时间线数据
function getTimelineData() {
    try {
        const dataPath = path.join(__dirname, 'data', 'timeline.json');
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('读取时间线数据失败:', error);
        return [];
    }
}

// API路由

// 获取所有品牌
app.get('/api/brands', (req, res) => {
    const brands = getBrandsData();
    res.json(brands);
});

// 搜索品牌
app.get('/api/brands/search', (req, res) => {
    const query = req.query.q || '';
    const brands = getBrandsData();
    
    if (!query) {
        return res.json(brands);
    }
    
    const queryLower = query.toLowerCase();
    const filtered = brands.filter(brand => 
        brand.name.toLowerCase().includes(queryLower) ||
        brand.category.toLowerCase().includes(queryLower) ||
        brand.description.toLowerCase().includes(queryLower) ||
        (brand.keywords && brand.keywords.some(kw => kw.toLowerCase().includes(queryLower)))
    );
    
    res.json(filtered);
});

// 根据ID获取品牌详情
app.get('/api/brands/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const brands = getBrandsData();
    const brand = brands.find(b => b.id === id);
    
    if (!brand) {
        return res.status(404).json({ error: '品牌未找到' });
    }
    
    res.json(brand);
});

// 获取时间线数据
app.get('/api/timeline', (req, res) => {
    const timeline = getTimelineData();
    res.json(timeline);
});

// 聊天接口（集成DeepSeek AI）
app.post('/api/chat', async (req, res) => {
    const { message, sessionId } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: '消息不能为空' });
    }
    
    // 使用sessionId来管理对话历史，如果没有则使用默认值
    const sid = sessionId || 'default';
    
    try {
        // 获取当前会话的历史记录
        let history = conversationHistory.get(sid) || [];
        
        // 限制历史记录长度，避免token过多
        if (history.length > 10) {
            history = history.slice(-10); // 只保留最近10轮对话
        }
        
        // 调用DeepSeek API
        const aiResponse = await chatWithDeepSeek(message, history);
        
        // 更新对话历史
        history.push(
            { role: 'user', content: message },
            { role: 'assistant', content: aiResponse }
        );
        conversationHistory.set(sid, history);
        
        // 返回响应
        res.json({ 
            response: aiResponse,
            timestamp: new Date().toISOString(),
            sessionId: sid
        });
    } catch (error) {
        console.error('AI服务错误:', error.message);
        
        // 返回友好的错误信息
        res.status(500).json({ 
            error: error.message || 'AI服务暂时不可用，请稍后再试',
            timestamp: new Date().toISOString()
        });
    }
});

// 清除对话历史接口（可选）
app.post('/api/chat/clear', (req, res) => {
    const { sessionId } = req.body;
    const sid = sessionId || 'default';
    
    conversationHistory.delete(sid);
    res.json({ 
        message: '对话历史已清除',
        timestamp: new Date().toISOString()
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
