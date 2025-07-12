// js/ai-service.js

/**
 * Gemini API 연동 및 프롬프트 관리
 * Vercel Serverless Function을 통해 API 호출
 */

// Gemini API 호출 함수 (Vercel Serverless Function 사용)
export async function generateQuestionsWithGemini(userTopic) {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ topic: userTopic })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'API 호출 실패');
  }
  
  const data = await response.json();
  return data;
} 