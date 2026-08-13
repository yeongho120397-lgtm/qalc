# QALC

Quick. Easy. Calculate.

통화·길이·무게 변환 웹 서비스.

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저: http://localhost:5173

## 웹 배포

이 프로젝트는 **이미 웹앱**입니다. 빌드하면 `dist/` 폴더가 생성됩니다.

```bash
npm run build
npm run preview   # 로컬에서 배포본 미리보기
```

### Vercel (권장)

1. GitHub에 푸시
2. [vercel.com](https://vercel.com) → Import Project
3. Framework: Vite, Build: `npm run build`, Output: `dist`

`vercel.json` 포함되어 있어 SPA 라우팅도 준비되어 있습니다.

### Netlify

- Build command: `npm run build`
- Publish directory: `dist`

### 기타

`dist/` 폴더를 Cloudflare Pages, GitHub Pages 등 정적 호스팅에 올리면 됩니다.

## 웹 / 모바일

- PC·모바일 브라우저 모두 대응
- 홈 화면 추가(PWA manifest 포함)
- Safari·Chrome 교차 확인 권장

## 스택

- Vite + React + TypeScript + CSS
