/* ===========================
   공통 JavaScript
   =========================== */

// Document Ready
$(document).ready(function() {
  console.log('페이지 로드 완료');
  console.log('jQuery 버전:', $.fn.jquery);
});

/* ===========================
   공통 유틸 함수
   =========================== */

// 콘솔에 메시지 출력 (개발 중에 사용)
function logMessage(message) {
  console.log('[APP]', message);
}

// 요소 표시
function showElement(selector) {
  $(selector).show();
}

// 요소 숨김
function hideElement(selector) {
  $(selector).hide();
}

// 요소 토글
function toggleElement(selector) {
  $(selector).toggle();
}

// 클래스 추가
function addClass(selector, className) {
  $(selector).addClass(className);
}

// 클래스 제거
function removeClass(selector, className) {
  $(selector).removeClass(className);
}

// 클래스 토글
function toggleClass(selector, className) {
  $(selector).toggleClass(className);
}

/* ===========================
   이벤트 핸들러
   =========================== */

// 여기에 공통 이벤트 핸들러를 추가하세요
$(document).ready(function() {
  // 예: 링크 클릭 이벤트
  // $('a').on('click', function() {
  //   logMessage('링크 클릭됨');
  // });
});
