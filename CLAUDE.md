# HTML5 프로젝트 설정

## 개발 환경
- **프로젝트 타입**: HTML5 정적 웹사이트
- **언어**: HTML5, CSS3, JavaScript (jQuery)
- **OS**: Windows 10 Pro

## 폴더 구조

```
test-html/
├── index.html                         # HTML5 진입점 (파일 인덱스)
├── html/                              # HTML 페이지 폴더
│   ├── main.html                      # FunETF PC 메인 페이지
│   ├── main_mo.html                   # FunETF 모바일 메인 페이지
│   └── guide/                         # UI 컴포넌트 가이드 페이지
│       ├── select.html
│       ├── input.html
│       ├── button.html
│       ├── tab.html
│       ├── checkbox.html
│       └── icon.html
├── css/
│   ├── common.css                     # 공통 CSS (리셋, 레이아웃, 반응형, 모바일 헤더/네비)
│   ├── main.css                       # 모바일 메인 페이지 전용 CSS
│   └── jquery-ui-1.14.1.min.css       # jQuery UI 테마 CSS
├── img/                               # 이미지 폴더
│   ├── common/                        # 공통 이미지 (로고, 아이콘 등)
│   ├── contents/                      # 컨텐츠별 이미지
│   │   └── [page-name]/               # 페이지별 이미지 폴더
│   └── lib/                           # 외부 라이브러리 이미지
│       └── jquery-ui/                 # jQuery UI 아이콘 이미지
└── js/
    ├── common.js                      # 공통 JavaScript (유틸, 이벤트 핸들러)
    └── lib/
        ├── jquery-3.7.1.min.js        # jQuery 라이브러리
        ├── jquery-ui-1.14.1.min.js    # jQuery UI 라이브러리
        └── echarts-5.6.1.min.js       # ECharts 차트 라이브러리
```

## 언어 및 커뮤니케이션 규칙
- **기본 응답 언어**: 한국어
- **코드 주석**: 한국어로 작성
- **커밋 메시지**: 한국어로 작성 (해당 시 적용)
- **문서화**: 한국어로 작성
- **변수명/함수명**: 영어 (코드 표준 준수)

## 코딩 스타일
- **들여쓰기**: 2칸 (HTML, CSS, JavaScript)
- **네이밍**:
  - 변수/함수: `camelCase`
  - CSS 클래스: `kebab-case`
  - ID: `camelCase`

## 기술 스택
- **마크업**: HTML5
- **스타일**: CSS3 (Flexbox, Grid, Media Queries)
- **스크립트**:
  - jQuery 3.7.1
  - jQuery UI 1.14.1 (datepicker, dialog, tabs 등)
  - Apache ECharts 5.6.1 (차트)
- **기타**: 바닐라 JavaScript 권장 (필요시 jQuery 활용)

## 파일 관리 규칙

### CSS
- **공통 CSS**: `css/common.css`에 리셋, 레이아웃, 공통 컴포넌트 스타일 작성
- **페이지별 전용 CSS**: 필요시 `css/[page-name].css` 생성 가능
  - 예: `css/main.css` (모바일 메인 페이지 전용)
- CSS는 반응형 디자인 기준으로 작성 필수 (모바일-퍼스트 접근)

### JavaScript
- 공통 함수: `js/common.js` 작성
- 외부 라이브러리: `js/lib/` 폴더에만 저장
- 페이지별 전용 JS: `js/[page-name].js` 생성 가능
- jQuery 선택 후 작성 권장

### HTML
- **진입점**: `index.html` (루트 디렉토리)
- **하위 페이지**: `html/` 폴더에 저장
  - 가이드 페이지: `html/guide/` 폴더
  - 추가 페이지별 폴더: `html/[page-name]/` (필요시)
- 모든 HTML 페이지는 공통 메타 태그, 스타일 시트, 스크립트 로드 필수

### 이미지
- **공통 이미지** (로고, 헤더, 푸터 등): `img/common/` 폴더
  - 모든 페이지에서 사용하는 이미지
  - 예: `img/common/logo.png`, `img/common/header-bg.jpg`
- **컨텐츠별 이미지**: `img/contents/[page-name]/` 폴더
  - 특정 페이지에서만 사용하는 이미지
  - 페이지명은 영문 소문자 (하이픈 사용, 예: `about`, `gallery`)
  - 예: `img/contents/gallery/photo-1.jpg`
- **외부 라이브러리 이미지**: `img/lib/[plugin-name]/` 폴더
  - 각 플러그인별 폴더 생성 (예: `img/lib/jquery-ui/`, `img/lib/bootstrap/`)
  - 플러그인 폴더명: 영문 소문자 (하이픈 사용)
- **지원 형식**: PNG, JPG, SVG, WebP 등
- **네이밍**: `kebab-case` (예: `hero-banner.png`, `icon-menu.svg`)
- **최적화**: 웹 사용에 적합한 크기와 포맷으로 저장
- **HTML에서 참조**:
  - 공통 이미지: `<img src="img/common/[image-name]" alt="설명" />`
  - 컨텐츠 이미지: `<img src="img/contents/[page-name]/[image-name]" alt="설명" />`
  - 라이브러리 이미지: `<img src="img/lib/[plugin-name]/[image-name]" alt="설명" />`

## 외부 라이브러리 추가 규칙
- **JS 위치**: 모든 외부 라이브러리는 `js/lib/` 폴더에 저장
- **CSS 위치**: 라이브러리 CSS는 `css/` 폴더에 저장 (또는 HTML에서 CDN 링크)
- **이미지 위치**: 라이브러리 이미지는 `img/lib/[plugin-name]/` 폴더에 저장
  - 플러그인명은 영문 소문자 (하이픈 사용)
  - 예: `img/lib/jquery-ui/`, `img/lib/bootstrap/`, `img/lib/font-awesome/`
- **네이밍**:
  - JS: `[library-name]-[version].min.js` (예: `bootstrap-5.3.0.min.js`)
  - 이미지: 각 플러그인 폴더 내 `kebab-case` (예: `img/lib/jquery-ui/spinner-icon.png`)
- **로드 순서**:
  1. jQuery (필수)
  2. jQuery UI
  3. 기타 라이브러리 (ECharts 등)
  4. 공통 JS (common.js)

## 주의사항
- 외부 라이브러리는 항상 최소화 버전(minified) 사용
- `js/lib/`에 저장된 라이브러리만 `index.html`에서 로드
- `img/lib/`에 저장된 이미지만 라이브러리 이미지로 인정
- 반응형 디자인은 필수 (모바일-퍼스트 접근)
- console 오류 없이 로드되도록 주의

## 개발 가이드
1. `css/common.css`에서 리셋 스타일 및 공통 레이아웃 유지
2. `js/common.js`에서 공통 유틸 함수 관리
3. 새 기능 추가 시 해당 페이지별 CSS/JS 파일 생성 가능
4. jQuery 활용 시 DOM 조작은 `common.js`의 유틸 함수 활용

## 검증
- `index.html` 브라우저 열기 → 콘솔 오류 없음 확인
- 브라우저 콘솔:
  - `$.fn.jquery` 입력 → `"3.7.1"` 출력 확인
  - `$.ui.version` 입력 → `"1.14.1"` 출력 확인 (jQuery UI가 로드된 경우)
