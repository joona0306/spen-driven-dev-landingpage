# 📧 Contact Form Landing Page

전문적인 서비스와 혁신적인 솔루션을 제공하는 랜딩페이지입니다. 다이나믹한 UI/UX와 함께 Node.js + Nodemailer를 활용한 이메일 전송 기능을 제공합니다.

## ✨ 주요 기능

### 프론트엔드

- 🎨 **다이나믹 UI/UX**: 그라디언트 애니메이션, 패럴랙스 효과
- 📱 **완벽한 반응형**: 모바일 First 디자인
- ✅ **실시간 폼 검증**: 클라이언트 측 유효성 검사
- 🎭 **인터랙티브 애니메이션**: 스크롤 트리거, 호버 효과, 카운터 애니메이션
- ♿ **접근성 준수**: WCAG 2.1 Level AA
- 🚀 **성능 최적화**: Lazy loading, 애니메이션 최적화
- 📊 **Google Analytics 4**: 페이지 추적 및 커스텀 이벤트
- 🔧 **순수 JavaScript**: ES6+ 문법 사용, **Class 미사용** (함수형 프로그래밍 패턴)

### 백엔드

- 🔐 **보안**: Rate limiting, Input validation, XSS 방지
- 📧 **이메일 전송**: Nodemailer + Gmail SMTP
- ✉️ **이메일 템플릿**: HTML 템플릿 지원
- 🛡️ **에러 처리**: 완벽한 에러 핸들링

### SEO

- 🔍 **검색 엔진 최적화**: Meta tags, Open Graph, Twitter Cards
- 📄 **Structured Data**: JSON-LD 스키마
- 🗺️ **Sitemap & Robots.txt**: 크롤링 최적화

## 📁 프로젝트 구조

```
spec-driven-dev/
├── backend/                  # Node.js 백엔드
│   ├── config/
│   │   └── nodemailer.js    # Nodemailer 설정
│   ├── controllers/
│   │   └── emailController.js
│   ├── middleware/
│   │   ├── validator.js     # 입력값 검증
│   │   └── rateLimiter.js   # Rate limiting
│   ├── routes/
│   │   └── contact.js       # Contact API
│   ├── templates/
│   │   └── email.html       # 이메일 템플릿
│   ├── server.js            # Express 서버
│   ├── package.json
│   └── .gitignore
│
├── frontend/                 # 프론트엔드
│   ├── css/
│   │   ├── variables.css    # CSS 변수
│   │   ├── reset.css        # CSS Reset
│   │   ├── base.css         # 기본 스타일
│   │   ├── components.css   # 컴포넌트
│   │   ├── animations.css   # 애니메이션
│   │   └── responsive.css   # 반응형
│   ├── js/
│   │   ├── utils.js         # 유틸리티
│   │   ├── animations.js    # 애니메이션 컨트롤러
│   │   ├── form.js          # 폼 컨트롤러
│   │   ├── analytics.js     # GA4 추적
│   │   └── main.js          # 메인 앱
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── index.html
│   ├── sitemap.xml
│   └── robots.txt
│
└── README.md
```

## 🚀 시작하기

### 사전 요구사항

- Node.js v18 이상
- npm 또는 yarn
- Gmail 계정 (이메일 전송용)

### 1. 저장소 클론

```bash
git clone <repository-url>
cd spec-driven-dev
```

### 2. 백엔드 설정

#### 2.1 패키지 설치

```bash
cd backend
npm install
```

#### 2.2 환경 변수 설정

`.env` 파일을 생성하고 다음 정보를 입력하세요:

```env
PORT=3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com
EMAIL_TO=contact@yourdomain.com
CORS_ORIGIN=http://localhost:8080
NODE_ENV=development
```

> **Gmail 앱 비밀번호 생성 방법:**
>
> 1. [Google 계정](https://myaccount.google.com/) 접속
> 2. 보안 > 2단계 인증 활성화
> 3. 앱 비밀번호 생성
> 4. 생성된 비밀번호를 `EMAIL_PASS`에 입력

#### 2.3 백엔드 서버 실행

```bash
# 프로덕션 모드
npm start

# 개발 모드 (nodemon 사용)
npm run dev
```

서버가 `http://localhost:3000`에서 실행됩니다.

### 3. 프론트엔드 설정

#### 3.1 Live Server 설치 (VSCode)

VSCode Extension: [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

또는 다른 방법으로 HTTP 서버 실행:

```bash
# Python 3
cd frontend
python -m http.server 8080

# Node.js http-server
npx http-server frontend -p 8080
```

#### 3.2 프론트엔드 열기

브라우저에서 `http://localhost:8080` 접속

### 4. Google Analytics 설정 (선택사항)

1. [Google Analytics](https://analytics.google.com/) 에서 GA4 속성 생성
2. 측정 ID 복사 (G-XXXXXXXXXX)
3. `frontend/index.html`에서 다음 부분을 수정:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-XXXXXXXXXX"); <!-- 여기에 측정 ID 입력 -->
</script>
```

## 📝 사용 방법

### 폼 필드

| 필드     | 타입     | 필수 | 검증 규칙             |
| -------- | -------- | ---- | --------------------- |
| 이름     | text     | ✅   | 2자 이상, 한글/영문만 |
| 이메일   | email    | ✅   | RFC 5322 표준         |
| 전화번호 | tel      | ❌   | 010-1234-5678 형식    |
| 회사명   | text     | ❌   | 100자 이하            |
| 메시지   | textarea | ✅   | 10-500자              |

### API 엔드포인트

#### POST /api/contact

**Request Body:**

```json
{
  "name": "홍길동",
  "email": "test@example.com",
  "phone": "010-1234-5678",
  "company": "회사명",
  "message": "문의 내용입니다."
}
```

**Response (성공):**

```json
{
  "success": true,
  "message": "문의사항이 성공적으로 전송되었습니다."
}
```

**Response (실패):**

```json
{
  "success": false,
  "message": "오류 메시지",
  "errors": [
    {
      "field": "email",
      "message": "올바른 이메일 형식이 아닙니다."
    }
  ]
}
```

#### GET /health

서버 상태 확인

```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## 🎨 커스터마이징

### 색상 변경

`frontend/css/variables.css` 파일에서 색상 변수 수정:

```css
:root {
  --color-primary-start: #6366f1;
  --color-primary-end: #8b5cf6;
  --color-secondary: #ec4899;
  /* ... */
}
```

### 폰트 변경

`frontend/index.html`의 Google Fonts 링크 변경 후, `variables.css`에서:

```css
:root {
  --font-primary: "Your Font", sans-serif;
}
```

### 애니메이션 속도 조정

`frontend/css/variables.css`:

```css
:root {
  --transition-fast: 0.15s ease-in-out;
  --transition-base: 0.2s ease-in-out;
  --transition-normal: 0.3s ease-in-out;
  --transition-slow: 0.5s ease-in-out;
}
```

### SEO 메타 데이터 수정

`frontend/index.html`의 `<head>` 섹션 수정:

```html
<title>귀하의 타이틀</title>
<meta name="description" content="귀하의 설명" />
<meta property="og:title" content="..." />
<!-- ... -->
```

## 🛡️ 보안

### 구현된 보안 기능

- ✅ Input Validation (서버 측)
- ✅ XSS 방지 (입력값 sanitization)
- ✅ Rate Limiting (15분당 3회)
- ✅ CORS 설정
- ✅ HTTPS 권장 (프로덕션)
- ✅ 환경 변수로 민감 정보 관리

### 권장사항

1. **프로덕션 환경**에서는 반드시 HTTPS 사용
2. `.env` 파일은 절대 Git에 커밋하지 않기
3. Gmail 앱 비밀번호 사용 (일반 비밀번호 X)
4. CORS Origin을 실제 도메인으로 제한
5. Rate Limit 값을 필요에 따라 조정

## 🧪 테스트

### 백엔드 테스트

```bash
# Health check
curl http://localhost:3000/health

# Contact API 테스트
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "홍길동",
    "email": "test@example.com",
    "message": "테스트 메시지입니다."
  }'
```

### 프론트엔드 테스트

1. 브라우저 개발자 도구 열기 (F12)
2. Console 탭에서 디버그 도구 확인:
   ```javascript
   window.appDebug;
   ```
3. 폼 제출 테스트

## 📊 성능 최적화

### 구현된 최적화

- ✅ CSS/JS 파일 분리
- ✅ 이미지 lazy loading
- ✅ Intersection Observer 사용
- ✅ 이벤트 throttle/debounce
- ✅ Will-change 속성 사용
- ✅ 애니메이션 GPU 가속

### Lighthouse 점수 목표

- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

## 🌐 브라우저 지원

- Chrome (최신 2버전)
- Firefox (최신 2버전)
- Safari (최신 2버전)
- Edge (최신 2버전)
- ❌ IE11 (지원 안 함)

## 🐛 문제 해결

### 이메일이 전송되지 않아요

1. `.env` 파일의 Gmail 계정 정보 확인
2. Gmail 앱 비밀번호 사용 확인
3. Gmail 2단계 인증 활성화 확인
4. 서버 콘솔 로그 확인

### CORS 오류가 발생해요

1. 백엔드 `.env`의 `CORS_ORIGIN` 확인
2. 프론트엔드와 백엔드 포트 확인
3. 브라우저 콘솔에서 정확한 오류 메시지 확인

### 애니메이션이 작동하지 않아요

1. 브라우저가 Intersection Observer를 지원하는지 확인
2. `prefers-reduced-motion` 설정 확인
3. JavaScript 콘솔 오류 확인

### Rate Limit 오류

15분 대기 후 다시 시도하거나, 개발 중이라면 `backend/middleware/rateLimiter.js`에서 제한 완화

## 📦 배포

### 프론트엔드 배포 (Netlify 추천)

1. **Netlify에 가입**: [netlify.com](https://netlify.com)
2. **새 사이트 생성**: "New site from Git"
3. **GitHub 저장소 연결**
4. **빌드 설정**:
   - Build command: (비워두기)
   - Publish directory: `frontend`
5. **배포 완료 후 도메인 확인**

### 백엔드 배포 (Railway 추천)

1. **Railway에 가입**: [railway.app](https://railway.app)
2. **새 프로젝트 생성**: "Deploy from GitHub repo"
3. **저장소 선택 후 `backend` 폴더 선택**
4. **환경 변수 설정**:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=noreply@yourdomain.com
   EMAIL_TO=contact@yourdomain.com
   CORS_ORIGIN=https://your-frontend-domain.netlify.app
   NODE_ENV=production
   ```
5. **배포 완료 후 백엔드 URL 확인**

### 배포 후 설정

1. **프론트엔드 API URL 수정**:

   ```javascript
   // frontend/js/form.js에서
   let apiEndpoint = "https://your-backend.railway.app/api/contact";
   ```

2. **CORS 설정 확인**: 백엔드에서 프론트엔드 도메인 허용

3. **이메일 설정 확인**: Gmail 앱 비밀번호 사용

### 배포 후 체크리스트

- [ ] 프론트엔드 API 엔드포인트 URL 업데이트 (`frontend/js/form.js`)
- [ ] CORS Origin 업데이트 (백엔드 `.env`)
- [ ] Google Analytics ID 업데이트
- [ ] Sitemap URL 업데이트
- [ ] Open Graph 이미지 업로드
- [ ] SSL 인증서 확인

## 📄 라이선스

MIT License

## 🤝 기여

이슈와 PR은 언제나 환영합니다!

## 📞 지원

문제가 있으시다면 [Issues](https://github.com/yourusername/repo/issues)를 통해 문의해주세요.

---

**Built with ❤️ using Vanilla JavaScript, Node.js, and Nodemailer**
