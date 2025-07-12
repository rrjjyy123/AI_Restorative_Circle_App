const { GoogleGenerativeAI } = require('@google/generative-ai');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ message: 'Topic is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ message: 'GEMINI_API_KEY is not set in environment variables.' });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `당신은 한국 초등학교 교실에서 회복적 서클을 진행하는 교사들을 돕는 AI 전문가입니다.\n- 회복적 생활교육, 관계중심 생활교육, 공동체 서클, 회복적 정의 패러다임, 실제 교실 사례 등 국내외 최신 교육자료와 질문 예시를 충분히 반영해 주세요.\n- 학생들의 수준, 분위기, 상황에 따라 질문의 스타일·길이·난이도·감정·상상력 자극 요소 등을 다양하게 섞어 매번 새로운 느낌의 질문 세트를 만들어 주세요.\n- 질문은 단순한 경험 공유를 넘어, 자기이해·타인이해·공동체의식·갈등전환·회복·성장·존중·공감·책임 등 교육적 가치를 담아주세요.\n- 실제 교실의 분위기(예: 활발함, 조용함, 감정이 격한 상황, 신학기, 친구와의 갈등, 학기말 성찰 등)를 매번 임의로 부여해 반영해 주세요.\n- 아래 예시와는 다르게, 창의적이고 현장감 있게 질문 세트를 만들어 주세요.\n- 각 질문 유형별로 2~3개 이상의 예시를 참고하되, 반복되지 않도록 해 주세요.\n\n---\n주제: ${topic}\n\n질문 세트 구성\n1️⃣ [여는 질문] (마음을 여는 질문, ice-breaking, 상상력·공감 자극, 분위기 풀기, 자기소개 등)\n- 2~3개, 학생들이 부담 없이 대답할 수 있는 쉽고 재미있고 긍정적인 질문, 주제와 연관성 있으면 좋음.\n- 예: "오늘 아침에 가장 먼저 떠오른 생각은?", "내가 좋아하는 색깔과 그 이유는?", "만약 동물이 될 수 있다면 어떤 동물이 되고 싶나요?" 등\n\n2️⃣ [주제 질문] (상황 탐색 , 경험 나누기, 감정·관계·갈등·공동체 등 주제별 심화)\n- 3~5개, 학생들이 주제에 대해 깊이 생각하고 서로의 경험을 나눌 수 있도록,\n- 예: "이 주제와 비슷한 경험이 있다면 이야기해 볼까요?", "그 일로 어떤 감정이 들었나요?", "친구라면 어떻게 느꼈을지 상상해 볼까요?", "앞으로 어떻게 하고 싶나요?" 등\n- "무슨 일이 있었나요?", "그 일로 어떤 영향을 받았나요?", "앞으로 어떻게 하고 싶나요?"의 흐름 반영\n\n3️⃣ [닫는 질문] (마무리·성찰, 배운 점, 다짐, 소감, 공동체 강화)\n- 1~2개, 오늘 서클에서 느낀 점, 앞으로의 다짐, 친구·교사·공동체에 대한 생각 등, 주제와 연관성 있으면 좋음.\n- 예: "오늘 서클에서 나눈 이야기 중 가장 기억에 남는 것은?", "서클을 통해 새롭게 알게 된 점이 있나요?", "앞으로 친구들과 더 잘 지내기 위해 내가 할 수 있는 일은?" 등\n\n---\n**질문 생성 조건**\n- 질문마다 번호를 붙이고, [질문 유형]을 제목으로 명확히 표시해 주세요.\n- 응답은 반드시 한국어로 작성해 주세요.\n- 질문 스타일, 어투, 길이, 난이도, 감정 자극, 상상력 자극 등은 매번 다르게 섞어주세요.\n- 학생 참여와 자기표현, 상호 존중, 공감, 책임, 성장, 공동체성, 갈등 전환, 회복 등 교육적 효과가 반영된 질문이 되도록 해 주세요.\n- 실제 교실 상황과 분위기를 충분히 고려해 주세요.\n\n응답은 다음 JSON 형식으로만 반환해주세요. 각 질문은 'question' 필드에 문자열로 포함되어야 합니다.\n{\n  "opening": [{"question": "질문1"}, {"question": "질문2"}],\n  "main": [{"question": "질문1"}, {"question": "질문2"}],\n  "closing": [{"question": "질문1"}, {"question": "질문2"}]\n}`; // JSON 형식으로만 반환하도록 지시

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        // 마크다운 코드 블록 제거
        const cleanedText = text.replace(/```json\n|```/g, '').trim();

        let jsonString = '';
        let braceCount = 0;
        let startIndex = -1;

        // 첫 번째 완전한 JSON 객체 추출
        for (let i = 0; i < cleanedText.length; i++) {
            const char = cleanedText[i];
            if (char === '{') {
                if (startIndex === -1) {
                    startIndex = i;
                }
                braceCount++;
            } else if (char === '}') {
                braceCount--;
            }

            if (startIndex !== -1 && braceCount === 0) {
                jsonString = cleanedText.substring(startIndex, i + 1);
                break; // 첫 번째 완전한 JSON 객체를 찾으면 중단
            }
        }

        if (!jsonString) {
            console.error('Could not extract a complete JSON object from AI response:', cleanedText);
            return res.status(500).json({ message: 'AI model returned malformed JSON or no JSON object.', rawResponse: text });
        }

        // 추출된 JSON 문자열 파싱 시도
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonString);
        } catch (parseError) {
            console.error('Failed to parse extracted JSON string:', jsonString, parseError);
            return res.status(500).json({ message: 'Extracted JSON string is malformed.', rawResponse: text });
        }

        // 각 질문에 category 필드 추가
        const formattedResponse = {
            opening: parsedResponse.opening.map(q => ({ ...q, category: 'AI 생성 여는 질문' })),
            main: parsedResponse.main.map(q => ({ ...q, category: 'AI 생성 주제 질문' })),
            closing: parsedResponse.closing.map(q => ({ ...q, category: 'AI 생성 닫는 질문' }))
        };

        res.status(200).json(formattedResponse);

    } catch (error) {
        console.error('Error generating questions:', error);
        res.status(500).json({ message: 'Failed to generate questions from AI.', error: error.message });
    }
};
