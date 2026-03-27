# FineNuts Coding Convention
> for Markup Languages (HTML/CSS) — ver 1.0

---

## 목차

1. [개요](#1-개요)
2. [네이밍 규칙](#2-네이밍-규칙)
3. [HTML 규칙](#3-html-규칙)
4. [CSS 규칙](#4-css-규칙)

---

## 1. 개요

### 코딩 컨벤션 필요성

마크업 개발은 프런트엔드 페이지의 기본 골격을 형성하기 때문에 디자인, 브라우저, 스크립트, 성능, 접근성 등과 긴밀한 관계가 있다.
코딩 컨벤션은 다음을 목표로 한다.

- 모든 브라우저에서 콘텐츠를 손실 없이, 빠르고 쉽게 전달
- 유지보수 비용 최소화 (최초 개발자가 아닌 사람도 빠르게 이해 가능)
- 프로젝트 멤버 간 코드 공유 및 일관성 유지

> 어떤 컨벤션을 선택하느냐보다 **통일된 기준으로 작성하는 것**이 중요하다.

### 용어 정의

| 용어 | 설명 |
|------|------|
| 요소(Element) | HTML 문서를 구성하는 요소. 시작 태그 + 내용 + 종료 태그로 구성 |
| 애트리뷰트(Attribute) | 요소에 부여하는 특성. 기본값을 선언으로 변경 가능 |
| 선택자(Selector) | 요소에 CSS 스타일을 적용하기 위한 패턴 |
| 속성(Property) | 요소에 부여할 CSS 스타일 특성. 각 속성은 세미콜론(;)으로 구분 |
| 속성 값(Value) | 속성에 부여하는 값 |
| 예약어 | 네이밍 시 의미를 일관되게 표현하기 위해 미리 지정한 언어 규칙 |

---

## 2. 네이밍 규칙

### 공통 규칙

- naming의 **첫 시작에 숫자, 특수문자, 대문자** 사용 지양
  ```
  2list_notice  (x)
  list_notice2  (o)
  ```
- naming은 **`형태_의미_상태`** 순서로 조합하며, **3단계를 넘지 않도록** 권장
  ```
  btn_apply_on, box_news, box_reply_open
  ```
- naming 정의 시 **예약어를 최대한 활용**

---

### id / class 규칙

| 구분 | 방식 | 예시 |
|------|------|------|
| `id` | camelCase | `id="boardView"` |
| `class` | underscore | `class="link_view"` |

- `id`는 **화면에서의 고유 기능**을 명시하도록 naming
  ```
  id="btnSearch"      (x)  -- 범위가 불명확
  id="btnGnbSearch"   (o)  -- 위치+기능 명확
  ```
- `class`는 **요소 기능**을 표현하도록 naming
- `id`는 문서 내 **한 번만** 사용
- `id`와 `class` naming은 가급적 같지 않게 작성

---

### folder / file 규칙

#### HTML
| 프로젝트 규모 | 규칙 |
|------|------|
| 대·중 프로젝트 | 서비스 대분류별 폴더 생성 → 폴더 안에 HTML 파일 생성. 파일명: `의미_상태` |
| 소 프로젝트 | 별도 폴더 없이 한 곳에 생성. 파일명: `serviceName_의미_상태` |

```
대·중:  /대분류명/notice.html
        /대분류명/notice_view.html

소:     /serviceName_intro.html
        /serviceName_intro_write.html
```

#### CSS
| 프로젝트 규모 | 규칙 |
|------|------|
| 대·중 프로젝트 | `common.css` + `serviceName_대분류명.css`. import는 **2개 이하**로 제한 |
| 소 프로젝트 | `common.css` 하나만 생성 |
| 프로모션 | `<head>` 내 internal 방식으로 style 추가 |

```
common.css, serviceName_intro.css
```

#### images
| 프로젝트 규모 | 규칙 |
|------|------|
| 대·중 프로젝트 | `images/common/`, `images/대분류명/` 폴더로 구분 |
| 소 프로젝트 | `images/` 폴더에 모두 생성. 임시 이미지는 `temp/` 폴더 사용 |

- 이미지 서버에 올라간 이미지 수정 시 **덮어쓰기 금지** → 새 파일명으로 생성
  ```
  btn_apply           (기존)
  btn_apply_110922    (수정)
  btn_apply_110922_v2 (재수정)
  ```

---

### 예약어 목록

#### 주 예약어

| 분류 | 주 예약어 | 부가설명 |
|------|-----------|---------|
| 타이틀 | `tit` | 일반적인 타이틀 |
| 영역 | `section` | 제목 태그(Heading Tag)를 지닌 영역 구분 (선택적 사용, 중첩 지양) |
| 영역 | `wrap` | 일반 영역의 묶음 (선택적 사용, 중첩 지양) |
| 영역 | `inner` | 부모 wrapper가 존재하며 자식 묶음이 단독으로 필요한 경우 |
| 내비게이션 | `gnb` | 서비스 전체 내비게이션 |
| 내비게이션 | `lnb` | 지역 내비게이션(gnb 영역) |
| 내비게이션 | `snb` | 사이드 내비게이션(좌측메뉴) |
| 탭 | `tab` | |
| 테이블 | `tbl` | |
| 목록 | `list` | 일반 목록(ul, ol, 리스트 형식의 dl) |
| 폼 | `tf` | textfield (input type=text / textarea) |
| 폼 | `inp` | input type=radio, checkbox, file 등 |
| 폼 | `opt` | selectbox |
| 폼 | `lab` | label |
| 폼 | `fld` | fieldset |
| 버튼 | `btn` | |
| 박스 | `box` | |
| 아이콘 | `ico` | |
| 선 | `line_방향` | 일반 실선 |
| 선 | `line_dot_방향` | 점선 |
| 배경 | `bg` | |
| 섬네일 이미지 | `thumb` | |
| 페이징 | `paging` | |
| 배너 | `bnr` / `banner` | |
| 텍스트 | `txt` | 일반 텍스트 |
| 텍스트 | `txt_bar` | 구분선 텍스트 |
| 텍스트 | `num` | 숫자 사용 시 언더바(underscore) 사용 X. ex) num1, num2 |
| 텍스트 | `copyright` | |
| 텍스트 | `time` | 날짜 및 시간 |
| 강조 | `emph` | |
| 링크 | `link` | 일반 링크 |
| 링크 | `link_more` | 더 보기 링크 |
| 순서 | `fst`, `mid`, `lst` | |
| 팝업 | `popup` | |
| 레이어 | `layer` | |
| 광고 | `ad` | |
| 스페셜 | `spe` | 검색 스페셜 용도 |
| 위젯 | `widget_소재명` | |
| 상세내용 | `desc` | |
| 댓글 | `cmt` | |

#### 보조 예약어

| 분류 | 보조 예약어 | 부가설명 |
|------|------------|---------|
| 공용 | `comm` | 전역으로만 사용 |
| 위치변화 | `top` / `mid` / `bot` / `left` / `right` | |
| 순서변화 | `fst` / `lst` | |
| 그림자 | `shadow` | |
| 화살표 | `arr` | |
| 버튼상태변화 | `nor` | |
| 방향 | `hori` / `vert` | |
| 카테고리 | `cate` | |
| 순위 | `rank` | |

#### 상태 예약어 (suffix)

| 분류 | suffix |
|------|--------|
| 상태변화 | `_on` / `_off` / `_over` / `_hit` / `_focus` / `_active` / `_disabled` |
| 위치변화 | `_top` / `_mid` / `_bot` / `_left` / `_right` / `_center` |
| 순서변화 | `_fst` / `_lst` |
| 이전/다음 | `_prev` / `_next` |

---

## 3. HTML 규칙

### DOCTYPE

```html
<!-- HTML5 (현재 프로젝트 기준) -->
<!doctype html>

<!-- XHTML 권장 -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<!-- HTML 일반 -->
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
  "http://www.w3.org/TR/html4/loose.dtd">
```

### 인코딩

- HTML 문서는 반드시 **인코딩 정보를 선언**
- 기본 인코딩: **utf-8** (다국어 지원, 한글 표현 범위 넓음)
- DB 인코딩 방식과 반드시 협의 후 결정

```html
<!-- HTML5 -->
<meta charset="utf-8">

<!-- HTML4.01 -->
<meta http-equiv="Content-Type" content="text/html;charset=utf-8">

<!-- utf-8 불가 시 -->
<meta http-equiv="Content-Type" content="text/html;charset=euc-kr">
```

### 들여쓰기

- 자식 요소는 **공백 2칸** 들여쓰기
- 반드시 **공백(space)**을 이용 (탭으로 대체 금지)

### 주석

```html
<!-- 시작 주석 -->
<!-- 주석 내용 -->

<!-- 종료 주석 -->
<!-- //주석 내용 -->
```

- 주석 기호와 내용 사이에 **공백 한 칸** 필수
- 시작과 종료 주석의 **내용은 동일**해야 함
- 개발 적용 관련 주석은 **`[D]` 말머리** 사용

```html
<!-- [D] 케이스별 클래스 변화  의사 : my_doctor  변호사 : my_lawyer -->
<!-- [D] 활성된 버튼은 파일명에 _on 추가 <img src="btn_on.gif" ...> -->
```

### Attribute 우선순위

Attribute 값은 **큰따옴표(`""`)** 로 묶는다.

| 순서 | 속성 |
|------|------|
| 1 | `rel` |
| 2 | `type` |
| 3 | `href`, `src` |
| 4 | `width`, `height` |
| 5 | `target` |
| 6 | `id` |
| 7 | `name` |
| 8 | `class` |
| 9 | `style` |
| 10 | `title`, `alt` |
| 11 | 기타 attribute |

```html
<a href="#" target="_blank" id="linkId" class="link" style="display:block;" title="링크가기">링크</a>
<img src="../img.gif" width="100" height="100" id="imgId" class="img" alt="이미지내용" title="이미지툴팁" />
<input type="text" id="tfId" name="tfname" class="tf" style="width:100px;" title="입력창" />
```

### Table

| 요소 | 규칙 |
|------|------|
| `caption` | 마크업 흐름상 `<table>` 최상위에 위치 |
| `summary` | 2단계·3단계 복합 테이블은 구조 기술 필요 (WCAG 2.0 H73) |
| `scope` | `scope="col"` → 세로(column)로, `scope="row"` → 가로(row)로 읽기 |
| `thead`, `tbody`, `tfoot` | 마크업 순서: `thead` → `tfoot` → `tbody` |
| `colgroup` | 사용 권장. 가변 데이터 시에도 사이즈 유지 |
| `<col>` | 보더 없음 → `<col width="">`, 보더 있음 → `<col class="">` + CSS 핸들링 |

---

## 4. CSS 규칙

### 기본 규칙

- `@import` 방식 **사용 금지** (일부 브라우저에서 이미지 로딩 후 적용)
- external 방식에는 **charset 표기**
  ```css
  @charset "utf-8";
  ```
- CSS 로드: `<head>` 상단에 `common.css` → 서비스별 CSS 순서
  ```html
  <link rel="stylesheet" type="text/css" href="common.css" /> <!-- reset, 공통 -->
  <link rel="stylesheet" type="text/css" href="serviceName_top.css" /> <!-- 콘텐츠 -->
  ```

### CSS 작성 형식

```css
/* (x) 개행 방식 */
.gnb_comm {
  overflow:hidden;
  width:978px;
  clear:both;
}

/* (x) 공백 없음 */
.gnb_comm{overflow:hidden;width:978px;clear:both;}

/* (x) 세미콜론 있음 (마지막 속성) */
.gnb_comm {overflow:hidden;width:978px;clear:both;}

/* (o) 올바른 방식: 공백 한 칸, 속성 간 공백 없음, 마지막 세미콜론 생략 */
.gnb_comm {overflow:hidden;width:978px;clear:both}
```

### 선택자 규칙

- CSS 선택자는 **class로 핸들링** (태그네임 핸들링 금지)
- 예외: 사용빈도 높은 `li`, `td`, `th`
- 태그네임과 class **중복 사용 금지**

```css
h3 {font-size:14px}              /* (x) 태그네임 선택자 */
h3.tit {font-size:14px}          /* (x) 태그+클래스 중복 */
.tit {font-size:14px}            /* (o) */
.news li {float:left}            /* (o) 예외 허용 */
.list_view li.fst { }            /* (x) */
.list_view .fst { }              /* (o) */
```

- Indentation Depth: **최대 3 Depth**, **1 Depth 권장**
- 단위: 기본 **절대단위(px)**, 유동적 레이아웃 시 상대단위(em, %)
- 속성선언 따옴표 **사용 금지** (단, 한글폰트·공백표현 시 **홑따옴표** 사용)

```css
.list_news {background:url("/image/box.gif") no-repeat}   /* (x) 큰따옴표 */
.list_news {background:url('/image/box.gif') no-repeat}   /* (x) 홑따옴표 */
.list_news {background:url(/image/box.gif) no-repeat}     /* (o) */
.list_news {font-family: '돋움', Dotum, Arial}             /* (o) 한글폰트 예외 */
```

### CSS 속성 선언 순서

| 순서 | 속성 | 의미 |
|------|------|------|
| 1 | `display` | 표시 (flex, grid, block, inline-block, table) |
| 2 | `flex` / `flex(자식)` | 유연 |
| 3 | `grid` / `grid(자식)` | 격자 |
| 2 | `overflow` | 넘침 |
| 4 | `position` | 위치 |
| 5 | `z-index` | 정렬 |
| 6 | `width` & `height` | 크기 |
| 7 | `margin` & `padding` | 간격 |
| 8 | `border` | 보더 |
| 9 | `background` | 배경 |
| 10 | `font` | 폰트 |
| 11 | 기타 (`color`, `text-decoration`, `clear`...) | 기타 |

### 스타일 선언 세부 규칙

#### font 속성 순서
축약형 사용 금지. 아래 순서로 선언:
```css
.txt {font-family:'굴림',Gulim,sans-serif;font-size:14px;font-weight:bold;color:#333;line-height:1.5}
```
`font-family` → `font-size` → `font-weight` → `color` → `line-height`

#### background-position
```css
.bg {background-position:left top}  /* (x) 문자열 */
.bg {background-position:0 0}       /* (o) 숫자 */
.bg {background-position:100% 50%}  /* (o) % */
```

#### 컬러값
```css
.txt {color:#666666}  /* (x) */
.txt {color:#666}     /* (o) 축약형 사용 */
```

### z-index 가이드

| 용도 | z-index 범위 |
|------|-------------|
| 일반 요소 | 10단위 간격 (기본값: 10) |
| 페이지 단위 최대 | ~999 |
| 팝업 레이어 | 1000부터 시작 |
| 전사공통 서제스트 | 9999 고정 |

### 주석 규칙

```css
/*common*/        /* (x) 공백 없음 */
/* common */      /* (o) 공백 한 칸 */
```

- CSS 주석은 **2 depth까지** 허용 (2 depth 주석은 개행 금지)
- 수정 주석은 **수정날짜**로 시작

```css
/* 2011-11-30 GNB 수정 시작 */
.gnb_comm {overflow:hidden;width:978px;clear:both}
.gnb_comm li {float:left;height:38px}
/* 2011-11-30 GNB 수정 끝 */

.news .on .menu {margin:0 -1px} /* 2011-11-30 수정 */
```

### 필터(핵) 규칙

- `!important` **사용 금지** (렌더링 이슈)
- ie6용 필터: `* html` 필터 사용 (레이아웃 유지 목적, 최소한으로)
  ```css
  .list_news {margin:0 10px 0 0}
  * html .list_news {margin:0 5px 0 0}
  ```
- PNG filter 적용 **금지** (ie6 대응 X)
- 조건부주석(Conditional Comment): **기본 사용 금지** (필요시 별도 논의)

---

## 공통 스타일시트 (Reset CSS)

### PC - Reset.css

```css
/* reset */
body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,textarea,p,blockquote,th,td,input,select,textarea,button {margin:0;padding:0}
fieldset,img {border:0 none}
dl,ul,ol,menu,li {list-style:none}
blockquote, q {quotes: none}
blockquote:before, blockquote:after,q:before, q:after {content:'';content:none}
input,select,textarea,button {vertical-align:middle}
button {border:0 none;background-color:transparent;cursor:pointer}
body {background:#fff}
body,th,td,input,select,textarea,button {font-size:12px;line-height:1.5;font-family:'돋움',dotum,sans-serif;color:#333}
a {color:#333;text-decoration:none}
a:active, a:hover {text-decoration:underline}
address,caption,cite,code,dfn,em,var {font-style:normal;font-weight:normal}
```

### Mobile - Reset.css

```css
/* reset */
body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,textarea,p,blockquote,th,td,input,select,textarea,button {margin:0;padding:0}
fieldset,img {border:0 none}
dl,ul,ol,menu,li {list-style:none}
blockquote, q {quotes:none}
blockquote:before, blockquote:after,q:before, q:after {content:'';content:none}
input,select,textarea,button {font-size:100%;vertical-align:middle}
button {border:0 none;background-color:transparent;cursor:pointer}
table {border-collapse:collapse;border-spacing:0}
body {-webkit-text-size-adjust:none} /* 뷰포트 변환시 폰트크기 자동확대 방지 */
input[type='text'],input[type='password'],input[type='submit'],input[type='search'] {-webkit-appearance:none;border-radius:0}
input:checked[type='checkbox'] {background-color:#666;-webkit-appearance:checkbox}
button,input[type='button'],input[type='submit'],input[type='reset'],input[type='file'] {-webkit-appearance:button;border-radius:0}
input[type='search']::-webkit-search-cancel-button {-webkit-appearance:none}
body {background:#fff}
body,th,td,input,select,textarea,button {font-size:14px;line-height:1.5;font-family:'Malgun Gothic','맑은 고딕',sans-serif;color:#333}
a {color:#333;text-decoration:none}
a:active, a:hover {text-decoration:none}
address,caption,cite,code,dfn,em,var {font-style:normal;font-weight:normal}
```
