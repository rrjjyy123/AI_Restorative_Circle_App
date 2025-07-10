const express = require('express');
const path = require('path');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// Check for required environment variables
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY environment variable is required!');
  console.error('Please set your Google Gemini API key in the environment variables.');
  // Vercel에서는 process.exit(1) 대신 에러 응답
  app.use((req, res) => res.status(500).json({ error: 'GEMINI_API_KEY environment variable is required!' }));
}

app.use(express.json());
app.use(express.static(path.join(__dirname, '../'))); // Serve static files from root

// Serve index.html on the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Initialize the Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// API endpoint for generating questions
app.post('/generate-questions', async (req, res) => {
    try {
        const { topic } = req.body;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
      당신은 한국 초등학교 교실에서 회복적 서클을 진행하는 교사들을 돕는 AI 전문가입니다.

- 회복적 생활교육, 관계중심 생활교육, 공동체 서클, 회복적 정의 패러다임, 실제 교실 사례 등 국내외 최신 교육자료와 질문 예시를 충분히 반영해 주세요.
- 학생들의 수준, 분위기, 상황에 따라 질문의 스타일·길이·난이도·감정·상상력 자극 요소 등을 다양하게 섞어 매번 새로운 느낌의 질문 세트를 만들어 주세요.
- 질문은 단순한 경험 공유를 넘어, 자기이해·타인이해·공동체의식·갈등전환·회복·성장·존중·공감·책임 등 교육적 가치를 담아주세요.
- 실제 교실의 분위기(예: 활발함, 조용함, 감정이 격한 상황, 신학기, 친구와의 갈등, 학기말 성찰 등)를 매번 임의로 부여해 반영해 주세요.
- 아래 예시와는 다르게, 창의적이고 현장감 있게 질문 세트를 만들어 주세요.
- 각 질문 유형별로 2~3개 이상의 예시를 참고하되, 반복되지 않도록 해 주세요.

---
선택한 주제: "${topic}"

질문 세트 구성
1️⃣ [여는 질문] (마음을 여는 질문, ice-breaking, 상상력·공감 자극, 분위기 풀기, 자기소개 등)  
- 2~3개, 학생들이 부담 없이 대답할 수 있는 쉽고 재미있고 긍정적인 질문  
- 예: "오늘 아침에 가장 먼저 떠오른 생각은?", "내가 좋아하는 색깔과 그 이유는?", "만약 동물이 될 수 있다면 어떤 동물이 되고 싶나요?" 등

2️⃣ [주제 질문] (상황 탐색, 경험 나누기, 감정·관계·갈등·공동체 등 주제별 심화)  
- 3~4개, 학생들이 주제에 대해 깊이 생각하고 서로의 경험을 나눌 수 있도록  
- 예: "이 주제와 비슷한 경험이 있다면 이야기해 볼까요?", "그 일로 어떤 감정이 들었나요?", "친구라면 어떻게 느꼈을지 상상해 볼까요?", "앞으로 어떻게 하고 싶나요?" 등  
- "무슨 일이 있었나요?", "그 일로 어떤 영향을 받았나요?", "앞으로 어떻게 하고 싶나요?"의 흐름 반영

3️⃣ [닫는 질문] (마무리·성찰, 배운 점, 다짐, 소감, 공동체 강화)  
- 1~2개, 오늘 서클에서 느낀 점, 앞으로의 다짐, 친구·교사·공동체에 대한 생각 등  
- 예: "오늘 서클에서 나눈 이야기 중 가장 기억에 남는 것은?", "서클을 통해 새롭게 알게 된 점이 있나요?", "앞으로 친구들과 더 잘 지내기 위해 내가 할 수 있는 일은?" 등

---
**질문 생성 조건**
- 질문마다 번호를 붙이고, [질문 유형]을 제목으로 명확히 표시해 주세요.
- 응답은 반드시 한국어로 작성해 주세요.
- 질문 스타일, 어투, 길이, 난이도, 감정 자극, 상상력 자극 등은 매번 다르게 섞어주세요.
- 학생 참여와 자기표현, 상호 존중, 공감, 책임, 성장, 공동체성, 갈등 전환, 회복 등 교육적 효과가 반영된 질문이 되도록 해 주세요.
- 실제 교실 상황과 분위기를 충분히 고려해 주세요.

---
**참고 예시** (반드시 예시와 다르게, 새로운 질문 세트를 창의적으로 만들어 주세요.)

[여는 질문]
- 오늘 아침에 가장 먼저 떠오른 생각은 무엇이었나요?
- 만약 오늘을 색깔로 표현한다면 어떤 색일까요? 그 이유는?
- 내가 가장 좋아하는 음식은 무엇인가요?

[주제 질문]
- 이 주제와 비슷한 경험이 있다면 이야기해 볼까요?
- 그 일로 어떤 감정이 들었나요?
- 친구라면 어떻게 느꼈을지 상상해 볼까요?
- 앞으로 내가 실천해보고 싶은 점은 무엇인가요?

[닫는 질문]
- 오늘 서클에서 나눈 이야기 중 가장 기억에 남는 것은 무엇인가요?
- 서클을 통해 새롭게 알게 된 점이 있나요?
- 앞으로 친구들과 더 잘 지내기 위해 내가 할 수 있는 일은 무엇인가요?

---
**서클 규칙(질문 세트 앞에 반드시 포함)**
-🟢이건 꼭 기억해요  
원의 의미 : 우리가 동등하게 하나가 되는 것  
서클 : 동그랗게 앉아서 이야기를 나누고 소통하는 모임  
토킹피스 : 발언의 기회

-🟢 서클 규칙  
① 토킹피스를 가진 사람만 이야기합니다.  
② 다른 사람의 이야기를 경청합니다.  
③ 서클은 처음부터 끝까지 유지되어야 합니다.  
④ 서클에서 나온 이야기는 비밀이 보장됩니다.

---

`;
        const result = await model.generateContent(prompt);
        const text = await result.text();
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
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
        const text = await result.text();
        res.json({ topics: text });

    } catch (error) {
        console.error('Error recommending topics:', error);
        res.status(500).json({ error: 'Failed to recommend topics. Please check the server logs and ensure your API key is correct.' });
    }
});

module.exports = app; 
