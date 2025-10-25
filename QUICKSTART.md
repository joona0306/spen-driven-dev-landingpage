# 🚀 빠른 시작 가이드

## 📋 체크리스트

프로젝트를 시작하기 전에 다음을 준비하세요:

- ✅ Node.js v18 이상 설치
- ✅ Gmail 계정 (이메일 전송용)
- ✅ 텍스트 에디터 (VSCode 권장)
- ✅ 웹 브라우저 (Chrome, Firefox 등)

## ⚡ 5분 안에 시작하기

### 1️⃣ 백엔드 서버 실행

```bash
# 1. backend 폴더로 이동
cd backend

# 2. 패키지 설치
npm install

# 3. .env 파일 생성 (아래 내용 복사)
# Windows
copy con .env
# Mac/Linux
nano .env
```

**`.env` 파일 내용:**

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

> ⚠️ **중요:** `EMAIL_USER`와 `EMAIL_PASS`를 본인의 Gmail 정보로 변경하세요!
> Gmail 앱 비밀번호는 [여기](https://myaccount.google.com/apppasswords)에서 생성할 수 있습니다.

```bash
# 4. 서버 실행
npm start
```

✅ 성공하면 다음 메시지가 표시됩니다:

```
🚀 Server is running on http://localhost:3000
📧 Contact API: http://localhost:3000/api/contact
💚 Health check: http://localhost:3000/health
```

### 2️⃣ 프론트엔드 실행

**새 터미널 창을 열고:**

#### 방법 1: VSCode Live Server (권장)

1. VSCode에서 `frontend/index.html` 파일 열기
2. 우클릭 → "Open with Live Server"
3. 자동으로 `http://localhost:5500` 또는 `http://127.0.0.1:5500`에서 열림

#### 방법 2: Python HTTP 서버

```bash
cd frontend
python -m http.server 8080
```

#### 방법 3: Node.js http-server

```bash
npx http-server frontend -p 8080
```

### 3️⃣ 브라우저에서 확인

브라우저에서 다음 주소 중 하나를 엽니다:

- `http://localhost:5500` (Live Server)
- `http://localhost:8080` (Python/http-server)

## 🧪 테스트하기

### 1. 웹사이트 탐색

- 스크롤하여 애니메이션 확인
- 네비게이션 링크 클릭
- 모바일 반응형 확인 (브라우저 창 크기 조절)

### 2. 폼 제출 테스트

1. "문의하기" 섹션으로 스크롤
2. 폼 작성:
   - 이름: 홍길동
   - 이메일: test@example.com
   - 전화번호: 010-1234-5678
   - 메시지: 테스트 메시지입니다.
3. "메시지 보내기" 클릭
4. 성공 메시지 확인
5. 설정한 이메일 계정으로 이메일 수신 확인

### 3. 개발자 도구 확인

1. F12 키를 눌러 개발자 도구 열기
2. Console 탭에서 다음 확인:
   ```
   ✓ Page fully loaded
   ✓ All features supported
   🐛 Debug mode enabled
   ```
3. `window.appDebug` 입력하여 디버그 도구 확인

## ⚙️ 커스터마이징

### 회사 정보 변경

`frontend/index.html` 파일에서:

```html
<!-- 회사명 변경 -->
<div class="nav-logo">
  <h2>YourBrand</h2>
  <!-- 여기 수정 -->
</div>

<!-- 타이틀 변경 -->
<title>귀하의 회사명 | 전문 서비스</title>

<!-- 설명 변경 -->
<meta name="description" content="귀하의 회사 설명..." />
```

### 색상 변경

`frontend/css/variables.css` 파일에서:

```css
:root {
  --color-primary-start: #6366f1; /* 원하는 색상으로 변경 */
  --color-primary-end: #8b5cf6;
}
```

### 연락처 정보 변경

`frontend/index.html`의 Contact Section에서:

```html
<a href="mailto:contact@yourdomain.com">contact@yourdomain.com</a>
<a href="tel:+821012345678">010-1234-5678</a>
```

## 🐛 문제 해결

### 포트가 이미 사용중이에요

**백엔드:**

```bash
# .env 파일에서 PORT 변경
PORT=3001
```

**프론트엔드:**

```bash
# 다른 포트 사용
python -m http.server 8081
```

### 이메일이 안 와요

1. 백엔드 터미널에서 에러 메시지 확인
2. `.env` 파일의 이메일 정보 재확인
3. Gmail 앱 비밀번호 재생성
4. 스팸 메일함 확인

### CORS 에러가 나요

`backend/.env`에서:

```env
# 프론트엔드 주소와 일치하는지 확인
CORS_ORIGIN=http://localhost:8080
```

프론트엔드가 다른 포트에서 실행중이라면 해당 포트로 변경하세요.

## 📱 모바일에서 테스트

### 같은 네트워크에서:

1. 컴퓨터의 로컬 IP 주소 확인:

   ```bash
   # Windows
   ipconfig

   # Mac/Linux
   ifconfig
   ```

2. 모바일 브라우저에서 접속:

   ```
   http://192.168.x.x:8080
   ```

   (실제 IP 주소로 변경)

3. `.env`의 CORS_ORIGIN에 모바일 주소 추가:
   ```env
   CORS_ORIGIN=http://localhost:8080,http://192.168.x.x:8080
   ```

## 🎉 다음 단계

프로젝트가 정상적으로 작동한다면:

1. ✅ Google Analytics ID 설정
2. ✅ 실제 회사 정보로 커스터마이징
3. ✅ 이미지/로고 추가 (`frontend/assets/images/`)
4. ✅ 서비스/기능 섹션 내용 수정
5. ✅ SEO 메타 데이터 최적화
6. ✅ 배포 (Netlify, Vercel, Heroku 등)

자세한 내용은 [README.md](./README.md)를 참고하세요!

## 💡 유용한 명령어

```bash
# 백엔드 개발 모드 (자동 재시작)
cd backend && npm run dev

# 백엔드 Health Check
curl http://localhost:3000/health

# API 테스트
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"테스트","email":"test@example.com","message":"테스트 메시지"}'

# 브라우저에서 디버그
# F12 → Console → window.appDebug
```

## 📚 추가 자료

- [완전한 문서](./README.md)
- [프로젝트 스펙](./contact-form-landing-page.plan.md)
- [Nodemailer 공식 문서](https://nodemailer.com/)
- [Express 공식 문서](https://expressjs.com/)

---

문제가 있나요? 🤔 [Issues](https://github.com/yourusername/repo/issues)에 문의해주세요!
