
// slider

gsap.registerPlugin(ScrollTrigger);


// NOTE: These values are interconnected - when speed changes, it affects when images finish their movement, which also affects the gap between images. When you change the number of items in spotlightItems array, you'll need to adjust these config settings together. Test different combinations until you find the right balance that looks good.
const config = {
  gap: 0.08,
  speed: 0.3,
  arcRadius: 500, // arc images follow
};

// import from spotlightItem.js

import { spotlightItems } from "./spotlightItem.js";

console.log(spotlightItems);




const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

const titlesContainer = document.querySelector(".spotlight-titles");
const imagesContainer = document.querySelector(".spotlight-images");
const spotlightHeader = document.querySelector(".spotlight-header");
const titlesContainerElement = document.querySelector(".spotlight-titles-container");
const introTextElements = document.querySelectorAll(".spotlight-intro-text");
const spotlightBackdrop = document.querySelector(".spotlight-backdrop");

const imageElements = [];


spotlightItems.forEach((item, index) => {
  const tile = document.createElement("div");
  tile.className = "spotlight-tile";
  tile.dataset.index = index;

  const title = document.createElement("h1");
  title.textContent = item.title;

  const subtitle = document.createElement("p");
  subtitle.className = "spotlight-subtitle";
  subtitle.textContent = `${item.year} | ${item.tag}`;

  tile.appendChild(title);
  tile.appendChild(subtitle);

  if (index === 0) tile.style.opacity = "1";
  titlesContainer.appendChild(tile);

  // click → modal (stub for now)
  tile.addEventListener("click", () => {
    openProjectModal(item, index);
  });

  const imgWrapper = document.createElement("div");
  imgWrapper.className = "spotlight-img";
  const imgElement = document.createElement("img");
  imgElement.src = item.img;
  imgWrapper.appendChild(imgElement);
  imagesContainer.appendChild(imgWrapper);
  imageElements.push(imgWrapper);
});

/*
spotlightItems.forEach((item, index) => {
  const titleElement = document.createElement("h1");
  titleElement.textContent = item.name;
  if (index === 0) titleElement.style.opacity = "1";
  titlesContainer.appendChild(titleElement);

  const imgWrapper = document.createElement("div");
  imgWrapper.className = "spotlight-img";
  const imgElement = document.createElement("img");
  imgElement.src = item.img;
  imgElement.alt = "";
  imgWrapper.appendChild(imgElement);
  imagesContainer.appendChild(imgWrapper);
  imageElements.push(imgWrapper);
});
*/

const titleElements = titlesContainer.querySelectorAll(".spotlight-tile");
let currentActiveIndex = 0;

const containerWidth = window.innerWidth * 0.3;
const containerHeight = window.innerHeight;
//coordinates for the bezier curve path
const arcStartX = containerWidth - 220;
const arcStartY = -200;
const arcEndY = containerHeight + 200;
const arcControlPointX = arcStartX + config.arcRadius;
const arcControlPointY = containerHeight / 2;

function getBezierPosition(t) {
  const x =
    (1 - t) * (1 - t) * arcStartX +
    2 * (1 - t) * t * arcControlPointX +
    t * t * arcStartX;
  const y =
    (1 - t) * (1 - t) * arcStartY +
    2 * (1 - t) * t * arcControlPointY +
    t * t * arcEndY;
  return { x, y };
}

function getImgProgressState(index, overallProgress) {
  const startTime = index * config.gap;
  const endTime = startTime + config.speed;

  if (overallProgress < startTime) return -1;
  if (overallProgress > endTime) return 2;

  return (overallProgress - startTime) / config.speed;
}

imageElements.forEach((img) => gsap.set(img, { opacity: 0 }));

ScrollTrigger.create({
  trigger: ".spotlight",
  start: "top top",
  end: `+=${window.innerHeight * 10}px`,
  pin: true,
  pinSpacing: true,
  scrub: 1,
  onUpdate: (self) => {
    const progress = self.progress;

    const backdropActive =
      progress > 0.23 && progress <= 0.95;
      spotlightBackdrop.classList.toggle("active", backdropActive);


    if (progress <= 0.2) {
      const animationProgress = progress / 0.2; //normailizing scroll progress between 0 and 0.2

      //moving text
      const moveDistance = window.innerWidth * 0.6;
      gsap.set(introTextElements[0], {
        x: -animationProgress * moveDistance,
      });
      gsap.set(introTextElements[1], {
        x: animationProgress * moveDistance,
      });
      gsap.set(introTextElements[0], { opacity: 1 });
      gsap.set(introTextElements[1], { opacity: 1 });

      gsap.set(".spotlight-bg-img", {
        transform: `scale(${animationProgress})`,
      });
      gsap.set(".spotlight-bg-img img", {
        transform: `scale(${1.5 - animationProgress * 0.5})`,
      });

      imageElements.forEach((img) => gsap.set(img, { opacity: 0 }));
      spotlightHeader.style.opacity = "0";
      gsap.set(titlesContainerElement, {
        "--before-opacity": "0",
        "--after-opacity": "0",
      });
    } else if (progress > 0.2 && progress <= 0.25) {
      gsap.set(".spotlight-bg-img", { transform: "scale(1)" });
      gsap.set(".spotlight-bg-img img", { transform: "scale(1)" });

      gsap.set(introTextElements[0], { opacity: 0 });
      gsap.set(introTextElements[1], { opacity: 0 });

      imageElements.forEach((img) => gsap.set(img, { opacity: 0 }));
      spotlightHeader.style.opacity = "1";
      gsap.set(titlesContainerElement, {
        "--before-opacity": "1",
        "--after-opacity": "1",
      });
    } else if (progress > 0.25 && progress <= 0.95) {
      gsap.set(".spotlight-bg-img", { transform: "scale(1)" });
      gsap.set(".spotlight-bg-img img", { transform: "scale(1)" });

      gsap.set(introTextElements[0], { opacity: 0 });
      gsap.set(introTextElements[1], { opacity: 0 });

      spotlightHeader.style.opacity = "1";
      gsap.set(titlesContainerElement, {
        "--before-opacity": "1",
        "--after-opacity": "1",
      });


      const switchProgress = (progress - 0.25) / 0.7;
      const viewportHeight = window.innerHeight;
      const titlesContainerHeight = titlesContainer.scrollHeight;
      const startPosition = viewportHeight;
      const targetPosition = -titlesContainerHeight;
      const totalDistance = startPosition - targetPosition;
      const currentY = startPosition - switchProgress * totalDistance;

      gsap.set(".spotlight-titles", {
        transform: `translateY(${currentY}px)`,
      });

      imageElements.forEach((img, index) => {
        const imageProgress = getImgProgressState(index, switchProgress);

        if (imageProgress < 0 || imageProgress > 1) {
          gsap.set(img, { opacity: 0 });
        } else {
          const pos = getBezierPosition(imageProgress);
          gsap.set(img, {
            x: pos.x - 100,
            y: pos.y - 75,
            opacity: 1,
          });
        }
      });

      const viewportMiddle = viewportHeight / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      titleElements.forEach((title, index) => {
        const titleRect = title.getBoundingClientRect();
        const titleCenter = titleRect.top + titleRect.height / 2;
        const distanceFromCenter = Math.abs(titleCenter - viewportMiddle);

        if (distanceFromCenter < closestDistance) {
          closestDistance = distanceFromCenter;
          closestIndex = index;
        }
      });

      if (closestIndex !== currentActiveIndex) {
        if (titleElements[currentActiveIndex]) {
          titleElements[currentActiveIndex].style.opacity = "0.25";
        }
        titleElements[closestIndex].style.opacity = "1";
        document.querySelector(".spotlight-bg-img img").src =
          spotlightItems[closestIndex].img;
        currentActiveIndex = closestIndex;
      }
    } else if (progress > 0.95) {
      spotlightHeader.style.opacity = "0";
      gsap.set(titlesContainerElement, {
        "--before-opacity": "0",
        "--after-opacity": "0",
      });
    }
  },
});




gsap.utils.toArray(".outro").forEach(el => {
  gsap.from(el, {
    opacity: 0,
    y: 40,
    duration: .9,
    delay: 0.7,
    ease: "power2.out",
    scrollTrigger: {
      trigger: el,
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });
});




// modal window

function arrowSVG() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="79" height="15" viewBox="0 0 79 15" fill="none">
      <path d="M78.1145 8.07106C78.505 7.68054 78.505 7.04737 78.1145 6.65685L71.7505 0.292885C71.36 -0.0976396 70.7268 -0.0976396 70.3363 0.292885C69.9458 0.683409 69.9458 1.31657 70.3363 1.7071L75.9931 7.36395L70.3363 13.0208C69.9458 13.4113 69.9458 14.0445 70.3363 14.435C70.7268 14.8255 71.36 14.8255 71.7505 14.435L78.1145 8.07106ZM0 7.36395V8.36395H77.4074V7.36395V6.36395H0V7.36395Z"
        fill="#373636" fill-opacity="0.8"/>
    </svg>`;
}


function openProjectModal(item, index) {
  if (window.__modalOpen) return;
  window.__modalOpen = true;

  lenis.stop();
  // adding to get rid of outer scrollbar
  document.documentElement.classList.add("modal-open");


  const wrapper = document.querySelector(".modal-window-wrapper");
  const content = document.querySelector(".modal-window-content");
  const backdrop = document.querySelector(".modal-backdrop");

  const nextIndex = (index + 1) % spotlightItems.length;
  const nextItem = spotlightItems[nextIndex];

  content.innerHTML = `
    <div class="close-modal">
        <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="-19.04 0 75.803 75.803">
                <g id="Group_64" data-name="Group 64" transform="translate(-624.082 -383.588)">
                  <path id="Path_56" data-name="Path 56"
                      d="M660.313,383.588a1.5,1.5,0,0,1,1.06,2.561l-33.556,33.56a2.528,2.528,0,0,0,0,3.564l33.556,33.558a1.5,1.5,0,0,1-2.121,2.121L625.7,425.394a5.527,5.527,0,0,1,0-7.807l33.556-33.559A1.5,1.5,0,0,1,660.313,383.588Z" fill="#000"/>
                </g>
           </svg>
        </span>
      </div>


    <div class="project-header">
      <h5 id="project-type">${item.group}</h5>
      <div class="project-title">
        <div class="project-name"><h2>${item.title}</h2></div>
        <div class="class-name"><h5 id="class-name">${item.className}</h5></div>
      </div>
    </div>

    <div class="modal-img-container">
      <div class="modal-img-wrapper">
        <img src="${item.modalImg}" alt="${item.title}">
      </div>
      <div class="below-img-content">
        <div class="tag"><p>${item.year}</p></div>
        <div class="tag"><p>${item.tag}</p></div>
      </div>
    </div>

    <div class="project-description">
      <p>${item.description}</p>
    </div>

    ${
    item.tools?.available && item.tools.list.length
      ? `
        <div class="tools">
          <div class="tools-title">
            <h4 id="tools-title">resources used</h4>
          </div>
          <ul>
            ${item.tools.list.map(tool => `<li>${tool}</li>`).join("")}
          </ul>
        </div>
      `
      : ""
    }


    <div class="links">
      ${
        item.projectLink
          ? `<div class="modal-link">
              <span class="arrow">${arrowSVG()}</span>
              <a href="${item.projectLink}" target="_blank">View Project</a>
            </div>`
          : ""
      }
      ${
        item.projectReport?.available
          ? `<div class="modal-link">
              <span class="arrow">${arrowSVG()}</span>
              <a href="${item.projectReport.link}" target="_blank">View Report</a>
            </div>`
          : ""
      }
    </div>

    <div class="next-project">
      <h4 class="next-project-link" style ="cursor: pointer;" data-next="${nextIndex}">
        View Next Project: ${nextItem.title}
      </h4>
      <span class="divider"></span>
    </div>
  `;

  wrapper.classList.remove("hidden");

  content.querySelector(".close-modal").onclick = closeProjectModal;
  backdrop.onclick = closeProjectModal;

  content.querySelector(".next-project-link")?.addEventListener("click", e => {
    const i = Number(e.currentTarget.dataset.next);
    closeProjectModal();
    requestAnimationFrame(() => openProjectModal(spotlightItems[i], i));
  });
}

function closeProjectModal() {
  const wrapper = document.querySelector(".modal-window-wrapper");
  const content = document.querySelector(".modal-window-content");

  wrapper.classList.add("hidden");
  content.innerHTML = "";
  document.documentElement.classList.remove("modal-open");
  lenis.start();
  window.__modalOpen = false;
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && window.__modalOpen) {
    closeProjectModal();
  }
});


