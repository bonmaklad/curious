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
});
