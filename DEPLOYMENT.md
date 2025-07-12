# 배포 가이드

## GitHub 업로드

### 1. Git 저장소 초기화
```bash
git init
git add .
git commit -m "Initial commit: AI 회복적 서클 질문 도우미"
```

### 2. GitHub 저장소 생성
1. GitHub에서 새 저장소 생성
2. 저장소 URL 복사

### 3. 원격 저장소 연결 및 푸시
```bash
git remote add origin https://github.com/your-username/ai-restorative-circle-helper.git
git branch -M main
git push -u origin main
```

## Vercel 배포

### 1. Vercel 계정 생성
1. [Vercel](https://vercel.com)에 가입
2. GitHub 계정 연결

### 2. 프로젝트 배포
1. Vercel 대시보드에서 "New Project" 클릭
2. GitHub 저장소 선택
3. 프로젝트 설정:
   - Framework Preset: Other
   - Build Command: (비워두기)
   - Output Directory: (비워두기)
   - Install Command: (비워두기)

### 3. 환경변수 설정
1. 프로젝트 설정 → Environment Variables
2. 다음 변수 추가:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Google AI Studio에서 발급받은 API 키
   - **Environment**: Production, Preview, Development 모두 선택

### 4. 배포 확인
1. "Deploy" 버튼 클릭
2. 배포 완료 후 제공되는 URL로 접속하여 기능 테스트

## API 키 발급 방법

### Google AI Studio에서 Gemini API 키 발급
1. [Google AI Studio](https://makersuite.google.com/app/apikey) 접속
2. Google 계정으로 로그인
3. "Create API Key" 클릭
4. 생성된 API 키를 복사하여 Vercel 환경변수에 설정

## 문제 해결

### 1. API 호출 실패
- 환경변수가 올바르게 설정되었는지 확인
- API 키가 유효한지 확인
- Vercel 함수 로그 확인

### 2. 프롬프트 파일 로드 실패
- `public/수정사항.txt` 파일이 올바른 위치에 있는지 확인
- 파일 인코딩이 UTF-8인지 확인

### 3. CORS 오류
- Vercel 함수의 CORS 설정 확인
- 브라우저 개발자 도구에서 네트워크 탭 확인

## 보안 주의사항

- API 키는 절대 클라이언트 사이드에 노출하지 마세요
- `.env` 파일은 Git에 커밋하지 마세요
- 프로덕션 환경에서는 HTTPS를 사용하세요

## 성능 최적화

- 이미지 최적화
- CSS/JS 압축
- CDN 사용 고려
- 캐싱 전략 수립 