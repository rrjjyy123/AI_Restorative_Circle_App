// api/gemini.js
// Vercel Serverless Function - Gemini API 프록시

export default async function handler(req, res) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // 프롬프트 텍스트 로드
    const fs = require('fs');
    const path = require('path');
    
    let promptText = '';
    try {
      // Vercel에서 public 폴더의 파일에 접근
      promptText = fs.readFileSync(path.join(process.cwd(), 'public', '수정사항.txt'), 'utf8');
    } catch (error) {
      console.error('프롬프트 파일 읽기 실패:', error);
      return res.status(500).json({ error: '프롬프트를 불러올 수 없습니다.' });
    }

    const fullPrompt = promptText.replace('{유저가 선택/입력한 상황}', topic);

    // Gemini API 호출
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API 키가 설정되지 않았습니다.' });
    }

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API 오류:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `Gemini API 호출 실패: ${response.status}` 
      });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('서버 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
} 