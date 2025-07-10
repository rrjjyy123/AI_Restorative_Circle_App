# AI 회복적 서클 질문 생성기

초등학교 교사를 위한 회복적 정의 기반 서클 질문 생성 애플리케이션입니다.

## 🚀 무료 배포 방법

### Vercel 배포 (추천)

1. **GitHub에 코드 업로드**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

2. **Vercel 배포**
   - [vercel.com](https://vercel.com) 가입
   - "New Project" 클릭
   - GitHub 저장소 연결
   - 환경 변수 설정: `GEMINI_API_KEY`
   - 배포 완료!

### Railway 배포

1. [railway.app](https://railway.app) 가입
2. "New Project" → "Deploy from GitHub repo"
3. 환경 변수 `GEMINI_API_KEY` 설정
4. 배포 완료!

### Render 배포

1. [render.com](https://render.com) 가입
2. "New Web Service" → GitHub 저장소 연결
3. 환경 변수 설정
4. 배포!

## 🔧 환경 변수 설정

배포 시 다음 환경 변수를 설정해야 합니다:

- `GEMINI_API_KEY`: Google Gemini AI API 키

## 📝 사용법

1. 주제 선택 또는 직접 입력
2. "질문 생성하기" 버튼 클릭
3. AI가 생성한 회복적 서클 질문 확인

## 🛠️ 로컬 개발

```bash
npm install
npm start
```

서버가 http://localhost:3000 에서 실행됩니다. 