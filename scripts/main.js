document.addEventListener("DOMContentLoaded", () => {
  if (typeof window.initializeCuriousPage === "function") {
    window.initializeCuriousPage();
  } else if (window.defaultContent) {
    const elements = document.querySelectorAll("[data-content-key]");
    elements.forEach((element) => {
      const key = element.getAttribute("data-content-key");
      const type = element.getAttribute("data-content-type") || "text";
      const value = key && key.split(".").reduce((acc, part) => (acc ? acc[part] : null), window.defaultContent);
      if (!value) return;
      if (type === "image" && element.tagName === "IMG") {
        element.setAttribute("src", value);
      } else if (type === "background") {
        // Set both CSS variable and direct background-image as a compatibility fallback
        element.style.setProperty("--section-bg", `url('${value}')`);
        element.style.backgroundImage = `url('${value}')`;
      } else {
        element.textContent = value;
      }
    });
  }

  // Global scroll control: down through sections, then back to top on last section (HOW TO SERVE)
  const scrollControl = document.querySelector("[data-scroll-control]");
  const scrollContainer = document.querySelector(".page");
  if (scrollControl && scrollContainer) {
    function getSections() {
      return Array.from(document.querySelectorAll(".section"));
    }

    function getCurrentSectionIndex(sections) {
      const scrollY = scrollContainer.scrollTop;
      const viewportHeight = scrollContainer.clientHeight;
      const center = scrollY + viewportHeight / 2;
      let closestIndex = 0;
      let closestDelta = Infinity;
      sections.forEach((section, index) => {
        const top = section.offsetTop;
        const middle = top + section.offsetHeight / 2;
        const delta = Math.abs(middle - center);
        if (delta < closestDelta) {
          closestDelta = delta;
          closestIndex = index;
        }
      });
      return closestIndex;
    }

    function isOnLastSection() {
      const last = document.querySelector(".section--how-to-serve");
      if (!last) return false;

      return scrollContainer.scrollTop >= last.offsetTop - scrollContainer.clientHeight / 2;
    }


    function updateScrollControlState() {
      const sections = getSections();
      if (!sections.length) return;

      const onLast = isOnLastSection(sections);
      scrollControl.classList.toggle("page-scroll--up", onLast);
      scrollControl.setAttribute(
        "aria-label",
        onLast ? "Back to top" : "Scroll to discover more"
      );
    }

    scrollControl.addEventListener("click", () => {
      const sections = getSections();
      if (!sections.length) return;

      const onLast = isOnLastSection(sections);
      if (onLast) {
        scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const index = getCurrentSectionIndex(sections);
        const target = sections[index + 1];
        if (target) {
          scrollContainer.scrollTo({ top: target.offsetTop, behavior: "smooth" });
        }
      }
    });

    scrollContainer.addEventListener("scroll", updateScrollControlState, { passive: true });
    window.addEventListener("resize", updateScrollControlState);
    updateScrollControlState();
  }

  // Footer back-to-top control (sits above scroll arrow)
  const footerBackToTop = document.querySelector("[data-footer-back-to-top]");
  if (footerBackToTop) {
    footerBackToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
