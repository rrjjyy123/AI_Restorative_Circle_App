// js/ui-components.js
import { generateQuestionsWithGemini } from './ai-service.js';

// 대표 상황 예시
const SITUATIONS = [
  '학기 초 관계 형성',
  '학기말 성찰',
  '친구와 다툼',
  '스마트폰 사용 문제',
  '소속감 결핍',
  '새로운 친구 환영',
  '집단 따돌림 예방',
  '학급 규칙 만들기',
  '갈등 상황',
  '직접 입력'
];

// AI 질문 생성 UI 렌더링
export function renderAIQuestionSection() {
  const section = document.getElementById('aiQuestionSection');
  if (!section) return;
  
  section.innerHTML = `
    <h3 style="margin-top:32px;">AI 질문 세트 생성</h3>
    <div class="form-group">
      <label for="aiSituation">학급 상황/주제 선택</label>
      <select id="aiSituation">
        ${SITUATIONS.map(s => `<option value="${s}">${s}</option>`).join('')}
      </select>
      <input id="aiCustomInput" type="text" placeholder="자유주제 입력" style="display:none;margin-top:8px;" />
    </div>
    <button class="btn btn-primary" id="aiGenerateBtn">AI로 질문 세트 만들기</button>
    <div id="aiLoading" style="display:none;margin:16px 0;">질문 생성 중...</div>
    <div id="aiResultCards"></div>
  `;

  // 이벤트 바인딩 - DOM이 생성된 후에 실행
  setTimeout(() => {
    const select = document.getElementById('aiSituation');
    const customInput = document.getElementById('aiCustomInput');
    const generateBtn = document.getElementById('aiGenerateBtn');
    
    if (!select || !customInput || !generateBtn) return;
    
    // 드롭다운 변경 이벤트
    select.addEventListener('change', () => {
      if (select.value === '직접 입력') {
        customInput.style.display = 'block';
        customInput.focus(); // 포커스 이동
      } else {
        customInput.style.display = 'none';
        customInput.value = ''; // 값 초기화
      }
    });

    // 생성 버튼 클릭 이벤트
    generateBtn.addEventListener('click', async () => {
      let topic = select.value;
      if (topic === '직접 입력') {
        topic = customInput.value.trim();
        if (!topic || topic.length < 2) {
          alert('주제를 2글자 이상 입력해 주세요.');
          customInput.focus();
          return;
        }
      }
      await handleAIGenerate(topic);
    });
  }, 100); // 약간의 지연으로 DOM 생성 완료 보장
}

// AI 질문 생성 및 결과 렌더링
async function handleAIGenerate(topic) {
  const loading = document.getElementById('aiLoading');
  const resultDiv = document.getElementById('aiResultCards');
  loading.style.display = 'block';
  resultDiv.innerHTML = '';
  try {
    const data = await generateQuestionsWithGemini(topic);
    // Gemini 응답에서 질문 세트 텍스트 추출 (예상: data.candidates[0].content.parts[0].text)
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) throw new Error('AI 질문 세트 생성 실패');
    renderAICardsFromText(text, resultDiv);
  } catch (e) {
    resultDiv.innerHTML = `<div style="color:red;padding:16px;background:#ffe6e6;border-radius:8px;">AI 질문 생성 실패: ${e.message}</div>`;
  } finally {
    loading.style.display = 'none';
  }
}

// 질문 세트 텍스트를 카드로 렌더링
function renderAICardsFromText(text, container) {
  // 유형별로 파싱 (여는/주제/닫는)
  // 예시: [여는 질문] 1. ...\n2. ...\n[주제 질문] 1. ...
  const sections = text.split(/\n(?=\[.*?질문\])/g);
  container.innerHTML = '';
  sections.forEach(section => {
    const match = section.match(/^\[(.*?)질문\]/);
    const type = match ? match[1].trim() : '';
    const icon = type.includes('여는') ? '🟣' : type.includes('주제') ? '🟢' : type.includes('닫는') ? '🔵' : '🟡';
    const title = match ? match[0] : '';
    const questions = section.replace(/^\[.*?\]\s*/, '').split(/\n\d+\. /).filter(q => q.trim()).map((q, i) => `${i+1}. ${q.trim()}`);
    if (questions.length === 0) return;
    const groupDiv = document.createElement('div');
    groupDiv.className = 'ai-question-group';
    groupDiv.innerHTML = `<div class="ai-question-type">${icon} ${title}</div>`;
    questions.forEach(q => {
      const card = document.createElement('div');
      card.className = 'ai-question-card';
      card.innerHTML = `
        <div class="ai-question-text">${q}</div>
        <button class="btn btn-secondary ai-add-btn">카드에 추가</button>
        <button class="btn btn-secondary ai-copy-btn">복사</button>
      `;
      // 카드에 추가
      card.querySelector('.ai-add-btn').onclick = () => {
        if (window.addToSelected) {
          window.addToSelected({
            id: `ai_${Date.now()}_${Math.random()}`,
            question: q.replace(/^\d+\.\s*/, ''),
            category: type + ' (AI)'
          });
        }
      };
      // 복사
      card.querySelector('.ai-copy-btn').onclick = () => {
        navigator.clipboard.writeText(q.replace(/^\d+\.\s*/, ''));
        alert('질문이 복사되었습니다!');
      };
      groupDiv.appendChild(card);
    });
    container.appendChild(groupDiv);
  });
}

// 빈카드 탭 진입 시 AI UI 자동 렌더링
function initializeAI() {
  // DOM이 로드된 후에 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAIQuestionSection);
  } else {
    renderAIQuestionSection();
  }
}

// 전역으로 노출 (HTML에서 호출 가능하도록)
window.renderAIQuestionSection = renderAIQuestionSection;

// 초기화 실행
initializeAI(); 