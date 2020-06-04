import { resultCases } from "./resultCases";

const selectBtn = document.querySelectorAll(".button");
const first = document.querySelector(".slide:nth-child(1)");

const selectNums = [];
const nextSlideEvent = (
  duration = 0,
  opacityDuration = 0,
  isSlide = false,
  vertical = false,
  event = null
) => {
  if (event) {
    const { id: parent } = event.target.parentNode.dataset;
    const { id: child } = event.target.dataset;
    if (parent) {
      selectNums.push(parent);
    } else if (child) {
      selectNums.push(child);
    }
  }
  // 매 함수 호출시마다 브라우저 width 길이를 업뎃함 -> 애니메이션 변수로 사용하기떄문
  const WINDOW = vertical ? window.innerHeight : window.innerWidth;
  const PREV = "prev";
  const ACTIVE = "active";
  const NEXT = "next";
  const activeEl = document.getElementById(ACTIVE);
  const nextEl = document.getElementById(NEXT);
  const prevEl = document.getElementById(PREV);
  if (!activeEl) {
    first.id = ACTIVE;
    first.style.zIndex = 1;
    first.style.opacity = 1;
    first.style.pointerEvents = "initial";
    first.nextElementSibling.id = NEXT;
  } else {
    if (prevEl) {
      prevEl.removeAttribute("id");
    }
    activeEl.id = PREV;
    nextEl.id = ACTIVE;
    first.removeAttribute("style");
    activeEl.style.pointerEvents = "none";
    const loadingScreen = nextEl.className.includes("loading");
    const resultScreen = nextEl.className.includes("result");
    activeEl.animate(
      // 실행 시점에선 nextEl은 Prev 상태의 Element를 가리킴
      {
        transform: resultScreen ? [] : isSlide ? (vertical ? [] : []) : [],
        zIndex: [1, 1],
        opacity: [1, 0],
      },
      { duration: duration ? duration - 200 : 0, fill: "forwards" }
    );
    nextEl.animate(
      // 실행 시점에선 nextEl은 현재 Active 상태의 Element를 가리킴
      {
        transform: resultScreen
          ? []
          : isSlide
          ? vertical
            ? [`translateY(-${WINDOW}px)`, `translateY(0)`]
            : [`translateX(${WINDOW}px)`, `translateX(0)`]
          : [],
        zIndex: [1, 2],
        opacity: [0, 1],
      },
      {
        duration: duration ? duration : 0,
        fill: "forwards",
        delay: resultScreen
          ? opacityDuration
          : loadingScreen
          ? opacityDuration + 300
          : vertical
          ? opacityDuration - 300
          : opacityDuration - 200,
      }
    );
    // select 버튼 이벤트 nesting 오류 fix
    setTimeout(
      () => (nextEl.style.pointerEvents = "initial"),
      opacityDuration + 500
    );

    if (!nextEl.nextElementSibling) {
      first.id = NEXT;
    } else {
      nextEl.nextElementSibling.id = NEXT;
    }
    // loading finish animation
    if (loadingScreen) {
      const loadingEl = document.getElementById("jsLoadingAnimation");
      const resultGoEl = document.getElementById("jsResultBtn");
      setTimeout(() => {
        loadingEl.innerHTML = "<span>분석 완료</span>";
        resultGoEl.style.opacity = "1";
        resultGoEl.style.pointerEvents = "initial";
      }, 4000);
    }
    // result image convert
    if (selectNums.length === 12) {
      setTimeout(() => {
        resultCases(selectNums);
      }, opacityDuration);
    }
  }
};

let lastTouchEnd = 0;

const touchEndPrevent = (event) => {
  const now = new Date().getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
};

const touchStartPrevent = (event) => {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
};

const init = () => {
  document.documentElement.addEventListener(
    "touchstart",
    touchStartPrevent,
    false
  );
  document.documentElement.addEventListener("touchend", touchEndPrevent, false);
  nextSlideEvent();
  selectBtn.forEach(
    (button) =>
      button.addEventListener("click", (event) =>
        nextSlideEvent(600, 800, true, false, event)
      ) // 애니메이션 속도, 딜레이시간, 슬라이드 온오프(기본 fasle)
  );
};

init();
