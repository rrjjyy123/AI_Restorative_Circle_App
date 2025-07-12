# AI 회복적 서클 질문 도우미

AI 기반 회복적 서클 질문 세트 생성 기능이 추가된 웹 애플리케이션입니다.

## 🎯 주요 기능

### 기존 기능
- **서클 질문카드**: 여는 질문, 자신과의 관계, 타인과의 관계, 공동체와의 관계, 닫는 질문
- **카드 선택 및 관리**: 드래그앤드롭으로 순서 변경, 슬라이드쇼 진행
- **공동체 놀이**: 다양한 놀이 활동 가이드
- **사용자 질문 추가**: 직접 질문카드 작성

### AI 기능 (신규)
- **AI 질문 세트 생성**: 교실 상황에 맞는 맞춤형 질문 자동 생성
- **상황별 프리셋**: 학기 초 관계 형성, 친구와 다툼, 스마트폰 사용 문제 등
- **자유주제 입력**: 원하는 주제로 질문 세트 생성
- **질문 카드 추가**: 생성된 질문을 선택하여 카드에 추가

## 🚀 설치 및 실행

### 1. 저장소 클론
```bash
git clone [repository-url]
cd ai-restorative-circle-helper
```

### 2. API 키 설정

#### 로컬 개발
1. `env.example`을 `.env`로 복사
2. `.env` 파일에 Gemini API 키 입력:
```
GEMINI_API_KEY=your_actual_api_key_here
```

#### Vercel 배포
1. Vercel 대시보드 → 프로젝트 → Settings → Environment Variables
2. `GEMINI_API_KEY` 변수 추가
3. Production, Preview, Development 환경 모두 설정

### 3. 실행
```bash
# 로컬 서버 실행 (Live Server 등)
# 또는 Vercel 배포
```

## 🔧 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **AI API**: Google Gemini API
- **배포**: Vercel
- **버전 관리**: Git

## 📁 파일 구조

```
├── index.html              # 메인 HTML 파일
├── js/
│   ├── ai-service.js       # Gemini API 연동
│   └── ui-components.js    # AI UI 컴포넌트
├── css/
│   └── ai-components.css   # AI 관련 스타일
├── 수정사항.txt            # AI 프롬프트 (public 폴더로 이동)
├── vercel.json            # Vercel 배포 설정
├── .gitignore             # Git 무시 파일
├── env.example            # 환경변수 예시
└── README.md              # 프로젝트 설명
```

## 🎨 사용 방법

### AI 질문 생성
1. "빈카드 작성" 탭 클릭
2. "AI 질문 세트 생성" 섹션에서 상황 선택 또는 직접 입력
3. "AI로 질문 세트 만들기" 버튼 클릭
4. 생성된 질문 중 원하는 것 선택하여 카드에 추가

### 기존 기능
- 각 카테고리별 질문카드 선택
- 선택된 카드 순서 변경 (드래그앤드롭)
- 슬라이드쇼로 진행 (클릭 또는 키보드)
- 사용자 질문 직접 작성

## 🔒 보안

- API 키는 환경변수로 관리
- `.env` 파일은 Git에서 제외
- Vercel 환경변수로 안전한 배포

## 📝 라이선스

오픈소스 프로젝트입니다.

## 🤝 기여

버그 리포트나 기능 제안은 이슈로 등록해 주세요.

---

**개발자**: 관계중심 생활교육 전문가  
**버전**: 2.0 (AI 기능 추가)  
**최종 업데이트**: 2024.07.12 