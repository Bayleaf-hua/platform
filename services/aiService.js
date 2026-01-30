const axios = require('axios');
const fs = require('fs');
const path = require('path');

// DeepSeek API配置
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';

// 读取品牌数据用于构建知识库
function getBrandsData() {
    try {
        const dataPath = path.join(__dirname, '..', 'data', 'brands.json');
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('读取品牌数据失败:', error);
        return [];
    }
}

// 构建系统提示词，包含老字号知识库
function buildSystemPrompt() {
    const brands = getBrandsData();
    
    // 构建品牌信息摘要
    const brandsInfo = brands.map(brand => {
        let info = `品牌名称：${brand.name}\n`;
        info += `类别：${brand.category}\n`;
        info += `创立时间：${brand.founded}\n`;
        info += `所在地：${brand.location || '未知'}\n`;
        info += `简介：${brand.description}\n`;
        if (brand.history) {
            info += `历史：${brand.history}\n`;
        }
        if (brand.keywords && brand.keywords.length > 0) {
            info += `关键词：${brand.keywords.join('、')}\n`;
        }
        if (brand.features && brand.features.length > 0) {
            info += `特色：${brand.features.join('、')}\n`;
        }
        return info;
    }).join('\n---\n\n');
    
    return `你是一位专业的老字号文化传承助手，专门回答关于中华老字号品牌的问题。

以下是平台收录的老字号品牌信息：

${brandsInfo}

请根据以上信息回答用户的问题。要求：
1. 回答要准确、专业，基于提供的品牌信息
2. 如果问题涉及的信息不在上述品牌列表中，请礼貌地说明
3. 回答要简洁明了，突出老字号的文化价值和历史意义
4. 使用中文回答
5. 如果用户询问的品牌不在列表中，可以简要介绍该品牌（如果确实存在），但说明平台目前没有收录详细信息

请开始回答用户的问题：`;
}

/**
 * 调用DeepSeek API进行对话
 * @param {string} userMessage - 用户消息
 * @param {Array} conversationHistory - 对话历史记录
 * @returns {Promise<string>} - AI回复
 */
async function chatWithDeepSeek(userMessage, conversationHistory = []) {
    if (!DEEPSEEK_API_KEY) {
        throw new Error('未配置DeepSeek API密钥，请在.env文件中设置DEEPSEEK_API_KEY');
    }

    try {
        // 构建消息列表
        const messages = [];
        
        // 添加系统提示词（只在第一次对话时添加）
        if (conversationHistory.length === 0) {
            messages.push({
                role: 'system',
                content: buildSystemPrompt()
            });
        }
        
        // 添加历史对话
        conversationHistory.forEach(msg => {
            messages.push({
                role: msg.role,
                content: msg.content
            });
        });
        
        // 添加当前用户消息
        messages.push({
            role: 'user',
            content: userMessage
        });

        // 调用DeepSeek API
        const response = await axios.post(
            DEEPSEEK_API_URL,
            {
                model: 'deepseek-chat', // DeepSeek的模型名称
                messages: messages,
                temperature: 0.7,
                max_tokens: 2000,
                stream: false
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                },
                timeout: 30000 // 30秒超时
            }
        );

        // 提取回复内容
        if (response.data && response.data.choices && response.data.choices.length > 0) {
            return response.data.choices[0].message.content.trim();
        } else {
            throw new Error('DeepSeek API返回格式异常');
        }
    } catch (error) {
        console.error('DeepSeek API调用失败:', error.response?.data || error.message);
        
        // 处理不同类型的错误
        if (error.response) {
            const status = error.response.status;
            if (status === 401) {
                throw new Error('API密钥无效，请检查DEEPSEEK_API_KEY配置');
            } else if (status === 429) {
                throw new Error('API请求频率过高，请稍后再试');
            } else if (status === 500) {
                throw new Error('DeepSeek服务暂时不可用，请稍后再试');
            } else {
                throw new Error(`API请求失败: ${error.response.data?.error?.message || error.message}`);
            }
        } else if (error.code === 'ECONNABORTED') {
            throw new Error('请求超时，请稍后再试');
        } else {
            throw new Error(`网络错误: ${error.message}`);
        }
    }
}

module.exports = {
    chatWithDeepSeek,
    buildSystemPrompt
};
