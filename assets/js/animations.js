

// PRELOADER



const FRAME_PATH = "assets/animationFrames/preloaderAnimation";
const FRAME_EXT = "png";

// animation frames 
const FRAME_START = 1;
const FRAME_COUNT = 60;

const FPS = 23; // frames per second
const FRAME_DURATION = 1000 / FPS;

// delay timings (ms)
const START_DELAY = 400;     // before animation starts
const END_DELAY = 500;       // after animation finishes
const FADE_DURATION = 600;   // preloader fade out

// frames that should "hold" longer
const DUPLICATE_FRAMES = [
  {frame: 1, extra: 10},
  { frame: 25, extra: 5 },
  { frame: 40, extra: 6 },
  { frame: 43, extra: 19},
  { frame: 44, extra: 3},
  { frame: 45, extra: 2},
  { frame: 51, extra: 5},
  { frame: 52, extra: 3},
  { frame: 53, extra: 5},
  { frame: 54, extra: 4},
  { frame: 56, extra: 3},
  { frame: 58, extra: 11},
  { frame: 59, extra: 2},
];


//text stats

// forward pass text
const FORWARD_TEXT = [
  { text: "Hi! Nice to see you here, let me clean up my desk a bit...", start: 10, end: 34 },
];

// reverse pass text
const REVERSE_TEXT = [
  { text: "I wasn't expecting company, sorry about that...", start: 52, end: 33 },
  { text: "Ok All Done!", start: 20, end: 2 }
];


const frameImg = document.getElementById("preloader-frame");
const textEl = document.getElementById("preloader-text");
const preloaderEl = document.getElementById("preloader");



function buildSequence() {
  const forward = [];

  for (let i = FRAME_START; i <= FRAME_COUNT; i++) {
    forward.push(i);

    const dup = DUPLICATE_FRAMES.find(d => d.frame === i);
    if (dup) {
      for (let j = 0; j < dup.extra; j++) {
        forward.push(i);
      }
    }
  }

  const reverse = forward.slice(0, -1).reverse();

  return {
    forward,
    reverse,
    full: forward.concat(reverse),
    forwardLength: forward.length
  };
}

const sequenceData = buildSequence();
const sequence = sequenceData.full;



function preloadImages(onComplete) {
  let loaded = 0;
  const total = FRAME_COUNT

  for (let i = 1; i <= FRAME_COUNT; i++) {
    const img = new Image();
    img.src = `${FRAME_PATH}/Animation-${i}.${FRAME_EXT}`;
    img.onload = () => {
      loaded++;
      if (loaded === total) onComplete();
    };
  }
}



function updateText(frame, isForward) {
  const states = isForward ? FORWARD_TEXT : REVERSE_TEXT;

  const state = states.find(s =>
    isForward
      ? frame >= s.start && frame <= s.end
      : frame <= s.start && frame >= s.end
  );

  if (!state) {
    if (textEl.classList.contains("active")) {
      textEl.classList.remove("active");
      textEl.classList.add("exit");
    }
    return;
  }

  if (textEl.textContent !== state.text) {
    textEl.classList.remove("active");
    textEl.classList.add("exit");

    setTimeout(() => {
      textEl.textContent = state.text;
      textEl.classList.remove("exit");
      textEl.classList.add("active");
    }, 250);
  }
}


let currentIndex = 0;

function playPreloader(onComplete) {
  const interval = setInterval(() => {
    const frame = sequence[currentIndex];
    const isForward = currentIndex < sequenceData.forwardLength;

    frameImg.src = `${FRAME_PATH}/Animation-${frame}.${FRAME_EXT}`;
    updateText(frame, isForward);

    currentIndex++;

    if (currentIndex >= sequence.length) {
      clearInterval(interval);
      if (onComplete) onComplete();
    }
  }, FRAME_DURATION);
}


preloadImages(() => {
  // set first frame
  frameImg.src = `${FRAME_PATH}/Animation-1.${FRAME_EXT}`;
  frameImg.style.opacity = 1;

  // reset index safely
  currentIndex = 0;

  setTimeout(() => {
    playPreloader(() => {
      setTimeout(() => {
        preloaderEl.style.opacity = 0;

        setTimeout(() => {
          preloaderEl.remove();
          document.body.classList.add("loaded");
        }, FADE_DURATION);

      }, END_DELAY);
    });
  }, START_DELAY);
});


// FOOTER

const FOOTER_FRAME_PATH = "assets/animationFrames/blinkingAnimation";
const FOOTER_FRAME_EXT = "png";

const FOOTER_FRAME_COUNT = 3; // only 3 frames
const FOOTER_FPS = 27;         // base speed
const FOOTER_FRAME_DURATION = 1000 / FOOTER_FPS;

// duplicate frames to hold longer
const FOOTER_DUPLICATE_FRAMES = [
  { frame: 1, extra: 65 },
  { frame: 2, extra: 2 },
  { frame: 3, extra: 2 }, // frame 2 holds 2 extra cycles
];

// build the looping sequence
const footerSequence = [];

for (let i = 1; i <= FOOTER_FRAME_COUNT; i++) {
  footerSequence.push(i);

  const dup = FOOTER_DUPLICATE_FRAMES.find(d => d.frame === i);
  if (dup) {
    for (let j = 0; j < dup.extra; j++) {
      footerSequence.push(i);
    }
  }
}

const footerImg = document.getElementById("footer-frame");
let footerIndex = 0;

// play forever
function playFooterAnimation() {
  setInterval(() => {
    const frame = footerSequence[footerIndex];
    footerImg.src = `${FOOTER_FRAME_PATH}/Blinking_And_Cursor_Interaction-${frame}.${FOOTER_FRAME_EXT}`;

    footerIndex++;
    if (footerIndex >= footerSequence.length) {
      footerIndex = 0; // loop
    }
  }, FOOTER_FRAME_DURATION);
}

// preload images first
function preloadFooterImages(callback) {
  let loadedCount = 0;

  for (let i = 1; i <= FOOTER_FRAME_COUNT; i++) {
    const img = new Image();
    img.src = `${FOOTER_FRAME_PATH}/Blinking_And_Cursor_Interaction-${i}.${FOOTER_FRAME_EXT}`;
    img.onload = () => {
      loadedCount++;
      if (loadedCount === FOOTER_FRAME_COUNT) callback();
    };
  }
}

// start
preloadFooterImages(() => {
  playFooterAnimation();
});
