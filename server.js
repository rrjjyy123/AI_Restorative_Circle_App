
const express = require('express');
const path = require('path');
const { onRequest } = require('firebase-functions/v2/https');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// Check for required environment variables
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY environment variable is required!');
  console.error('Please set your Google Gemini API key in the environment variables.');
  process.exit(1);
}

app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from the root directory

// Serve index.html on the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize the Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// API endpoint for generating questions
app.post('/generate-questions', async (req, res) => {
    try {
        const { topic } = req.body;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

        const learningDataSummary = `
        You are an expert assistant for elementary school teachers in Korea, specializing in Restorative Justice and Circle Practices.
        Your knowledge is based on key Korean resources like "Restorative Justice & Discipline Workshop," "Restorative Life Education Manual," and various circle question guides.
        Key Principles:
        - Focus on healing and community restoration, not punishment.
        - Differentiate between retributive justice (who is to blame?) and restorative justice (who was harmed? what is needed for recovery?).
        - Use the 5-step restorative question framework: 1. Situation Understanding, 2. Impact Assessment, 3. Voluntary Responsibility, 4. Relationship Building, 5. Growth Opportunity.
        - Always include "Circle Rules" for a safe environment.
        `;

        const prompt = `
       초등학교 교실에서 회복적 서클을 진행하려는 교사가 질문 세트를 필요로 합니다.
선택한 주제는: "${topic}" 입니다.

당신은 한국 회복적 생활교육의 원칙과 교실 사례에 기반하여 아래의 질문을 만들어 주세요:

1️⃣ 여는 질문 (마음을 여는 질문)

서클의 시작을 부드럽게 하고 신뢰를 쌓을 수 있는 가볍고 즐거운 질문 2~3개를 제시해 주세요.

2️⃣ 주제 질문 (상황을 탐색하는 질문)

학생들이 주제를 깊이 생각하고 서로의 경험과 생각을 나눌 수 있도록 돕는 질문 3~4개를 제시해 주세요.

질문은 "무슨 일이 있었나요?", "그 일로 어떤 영향을 받았나요?", "앞으로 어떻게 하고 싶나요?"의 흐름을 반영해 주세요.

3️⃣ 닫는 질문 (마무리와 성찰 질문)

서클을 마무리하며 학생들이 배운 점과 느낀 점을 돌아볼 수 있도록 하는 질문 1~2개를 제시해 주세요.

응답은 한국어로 작성해 주세요.
각 질문은 번호로 구분해 주시고, **[질문 유형]**을 제목으로 표시해 주세요.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const fixedCircleRules = `-🟢이건 꼭 기억해요
원의 의미 : 우리가 동등하게 하나가 되는 것
서클 : 동그랗게 앉아서 이야기를 나누고 소통하는 모임
토킹피스 : 발언의 기회


-🟢 서클 규칙
① 토킹피스를 가진 사람만 이야기합니다.
② 다른 사람의 이야기를 경청합니다.
③ 서클은 처음부터 끝까지 유지되어야 합니다.
④ 서클에서 나온 이야기는 비밀이 보장됩니다.
`;
        const text = await response.text();
        const combinedText = fixedCircleRules + '\n\n' + text; // Add two newlines for separation
        
        res.json({ questions: combinedText });

    } catch (error) {
        console.error('Error generating questions:', error);
        res.status(500).json({ error: 'Failed to generate questions. Please check the server logs and ensure your API key is correct.' });
    }
});

// New API endpoint for recommending topics
app.get('/recommend-topics', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

        const learningDataSummary = `
        You are an expert assistant for elementary school teachers in Korea, specializing in Restorative Justice and Circle Practices.
        Your knowledge is based on key Korean resources like "Restorative Justice & Discipline Workshop," "Restorative Life Education Manual," and various circle question guides.
        Key Principles:
        - Focus on healing and community restoration, not punishment.
        - Differentiate between retributive justice (who is to blame?) and restorative justice (who was harmed? what is needed for recovery?).
        - Use the 5-step restorative question framework: 1. Situation Understanding, 2. Impact Assessment, 3. Voluntary Responsibility, 4. Relationship Building, 5. Growth Opportunity.
        - Always include "Circle Rules" for a safe environment.
        `;

        const prompt = `
        You are an expert assistant for elementary school teachers in Korea, specializing in Restorative Justice and Circle Practices.
        Based on your knowledge of Korean restorative life education and common issues in elementary schools, please suggest 5-7 relevant and practical topics for restorative circles.
        The topics should be suitable for elementary school students and address common conflicts, emotional regulation, or community building.
        Provide the topics as a numbered list in Korean.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        
        res.json({ topics: text });

    } catch (error) {
        console.error('Error recommending topics:', error);
        res.status(500).json({ error: 'Failed to recommend topics. Please check the server logs and ensure your API key is correct.' });
    }
});

// Export the Express app as a Firebase Function
exports.app = onRequest(app);
