# AI 회복적 서클 질문 생성기

초등학교 교사를 위한 회복적 정의 기반 서클 질문 생성 애플리케이션입니다.

## 폴더 구조

```
AI_Restorative_Circle_App/
  ├── api/
  │    └── index.js         # Express 서버 (Vercel 서버리스 함수)
  ├── index.html            # 메인 웹페이지
  ├── package.json          # 프로젝트 설정 및 의존성
  ├── README.md             # 프로젝트 설명서
  ├── vercel.json           # Vercel 배포 설정
  ├── .gitignore            # GitHub 업로드 제외 파일
  └── .github/              # (있다면) GitHub Actions 등 자동화
```

## 배포 방법 (Vercel)

1. **GitHub에 코드 업로드**
   - 위 폴더 구조대로 정리 후 push
2. **[vercel.com](https://vercel.com) 가입 및 로그인**
3. **New Project → GitHub 저장소 선택**
4. **환경 변수 설정**
   - Name: `GEMINI_API_KEY`
   - Value: (Google AI Studio에서 발급받은 실제 API 키)
5. **Deploy 클릭**
6. 배포 완료 후 제공된 도메인에서 서비스 이용

## 환경 변수
- `GEMINI_API_KEY` : Google Gemini API 키 (반드시 Vercel 대시보드에서 설정)

## 로컬 개발
```bash
npm install
cd api && npm install # (api/index.js에서 별도 의존성 필요시)
# Express 서버 직접 실행은 권장하지 않음 (Vercel 서버리스 구조)
```

## 사용법
1. 웹사이트 접속
2. 주제 선택 또는 직접 입력
3. "질문 생성하기" 버튼 클릭
4. AI가 생성한 회복적 서클 질문 확인

---

### 문의/이슈
- 배포, 환경 변수, 코드 관련 문의는 GitHub Issues 또는 Vercel 배포 로그를 참고하세요. 
