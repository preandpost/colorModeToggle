function colorModeToggle() {
  const htmlElement = document.documentElement;
  let toggleEl;

  function setColors(colorObject, animate) {
    if (typeof gsap !== "undefined" && animate) {
      gsap.to(htmlElement, {
        ...colorObject,
        duration: 0.5,
        ease: "power1.out",
      });
    } else {
      Object.keys(colorObject).forEach(function (key) {
        htmlElement.style.setProperty(key, colorObject[key]);
      });
    }
  }

  function goDark(dark, animate) {
    const scriptTag = document.querySelector("[tr-color-vars]");
    if (!scriptTag) {
      console.warn("Script tag with tr-color-vars attribute not found");
      return;
    }

    const cssVariables = scriptTag.getAttribute("tr-color-vars");
    if (!cssVariables.length) {
      console.warn("Value of tr-color-vars attribute not found");
      return;
    }

    let lightColors = {};
    let darkColors = {};
    cssVariables.split(",").forEach(function (item) {
      let lightValue = getComputedStyle(htmlElement).getPropertyValue(`--color--${item}`).trim();
      let darkValue = getComputedStyle(htmlElement).getPropertyValue(`--dark--${item}`).trim();
      if (lightValue.length) {
        if (!darkValue.length) darkValue = lightValue;
        lightColors[`--color--${item}`] = lightValue;
        darkColors[`--color--${item}`] = darkValue;
      }
    });

    if (!Object.keys(lightColors).length) {
      console.warn("No variables found matching tr-color-vars attribute value");
      return;
    }

    if (dark) {
      localStorage.setItem("dark-mode", "true");
      htmlElement.classList.add("dark-mode");
      setColors(darkColors, animate);
    } else {
      localStorage.setItem("dark-mode", "false");
      htmlElement.classList.remove("dark-mode");
      setColors(lightColors, animate);
    }

    updateModeText(); // Update text after mode change
    updateButtonColors(); // Update button colors after mode change
  }

  function updateModeText() {
    const modeText = document.getElementById("modeText");
    if (!modeText) {
      console.warn("Mode text element not found");
      return;
    }

    const darkClass = htmlElement.classList.contains("dark-mode");
    modeText.textContent = darkClass ? "Light mode" : "Dark mode";
  }

  function updateButtonColors() {
    const darkClass = htmlElement.classList.contains("dark-mode");
    toggleEl.forEach(function (element) {
      element.style.backgroundColor = darkClass ? darkColors['--color--background'] : lightColors['--color--background'];
      element.style.color = darkClass ? darkColors['--color--text'] : lightColors['--color--text'];
    });
  }

  function checkPreference(e) {
    goDark(e.matches, false);
  }

  const colorPreference = window.matchMedia("(prefers-color-scheme: dark)");
  colorPreference.addEventListener("change", (e) => {
    checkPreference(e);
  });

  let storagePreference = localStorage.getItem("dark-mode");
  if (storagePreference !== null) {
    storagePreference === "true" ? goDark(true, false) : goDark(false, false);
  } else {
    checkPreference(colorPreference);
  }

  window.addEventListener("DOMContentLoaded", (event) => {
    updateModeText(); // Set initial text
    updateButtonColors(); // Set initial button colors
    toggleEl = document.querySelectorAll("[tr-color-toggle]");
    toggleEl.forEach(function (element) {
      element.addEventListener("click", function () {
        let darkClass = htmlElement.classList.contains("dark-mode");
        darkClass ? goDark(false, true) : goDark(true, true);
      });
    });
  });
}

colorModeToggle();
