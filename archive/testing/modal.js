function openProjectModal(item, index) {
  if (window.__modalOpen) return;
  window.__modalOpen = true;

  lenis.stop();

  const wrapper = document.querySelector(".modal-window-wrapper");
  const content = document.querySelector(".modal-window-content");

  // calculate next project (looping)
  const nextIndex = (index + 1) % spotlightItems.length;
  const nextItem = spotlightItems[nextIndex];

  content.innerHTML = `
    <div class="open-close">
      <span class="close-modal">&times;</span>
    </div>

    <div class="project-head">
      <h4 class="group">${item.group}</h4>

      <div class="title">
        <h1 class="title-name">${item.title}</h1>
        <span class="divider"></span>
      </div>

      <h4 class="class-name">${item.className}</h4>
    </div>

    <div class="modal-img-container">
      <div class="modal-img-wrapper">
        <img src="${item.modalImg}" alt="${item.title}">
      </div>

      <div class="below-image">
        <span class="date">${item.year}</span>
        <span class="tag">${item.tag}</span>
      </div>
    </div>

    <div class="project-description">
      <p>${item.description}</p>
    </div>

    <div class="tools">
      <h3>Tools</h3>
      <ul>
        ${(item.tools
          ? Object.values(item.tools).map(t => `<li>${t}</li>`).join("")
          : ""
        )}
      </ul>
    </div>

    <div class="links">
      ${
        item.projectLink
          ? `
          <div class="view-project">
            <span class="arrow">${arrowSVG()}</span>
            <a href="${item.projectLink}" target="_blank">View Project</a>
          </div>
          `
          : ""
      }

      ${
        item.projectReport?.available
          ? `
          <div class="view-report">
            <span class="arrow">${arrowSVG()}</span>
            <a href="${item.projectReport.link}" target="_blank">View Report</a>
          </div>
          `
          : ""
      }
    </div>

    <div class="next-project">
      <h4 class="next-project-link" data-next="${nextIndex}" style="cursor: pointer;">View Next Project: ${nextItem.title}</h4>
      <span class="divider"></span>
    </div>
  `;

  wrapper.classList.remove("hidden");

  // close modal
  content.querySelector(".close-modal").onclick = closeProjectModal;

  // next project click
  const nextEl = content.querySelector(".next-project-link");
  if (nextEl) {
    nextEl.onclick = () => {
      window.__modalOpen = false; // <--- reset the modal-open flag
      openProjectModal(nextItem, nextIndex);
    };
  }

}