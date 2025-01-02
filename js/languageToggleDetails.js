// languageToggle.js
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("language-toggle");
  const englishItems = document.querySelectorAll(".english");
  const hebrewItems = document.querySelectorAll(".hebrew");
  const scriptContainer = document.getElementById("dynamic-script-container");

  /**
   * Loads a list of scripts in sequence. Once all are loaded, runs onComplete.
   */
  const loadScriptsSequentially = (scriptUrls, onComplete) => {
    if (!scriptUrls || !scriptUrls.length) {
      if (onComplete) onComplete();
      return;
    }
    const currentUrl = scriptUrls.shift();
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = currentUrl;
    script.onload = () => {
      // When the current script is fully loaded, move to the next
      loadScriptsSequentially(scriptUrls, onComplete);
    };
    script.onerror = () => {
      console.error(`Failed to load script: ${currentUrl}`);
      // Still move on so the rest can attempt to load
      loadScriptsSequentially(scriptUrls, onComplete);
    };
    scriptContainer.appendChild(script);
  };

  /**
   * Updates the visibility of English/Hebrew elements and loads the correct scripts.
   */
  const updateLanguageDisplay = () => {
    const isEnglish = toggle.checked;

    // Toggle visibility for English/Hebrew text
    englishItems.forEach(item => {
      item.style.display = isEnglish ? "" : "none";
    });
    hebrewItems.forEach(item => {
      item.style.display = isEnglish ? "none" : "";
    });

    // Save preference in localStorage
    localStorage.setItem("language", isEnglish ? "english" : "hebrew");

    // Clear any previously inserted scripts
    scriptContainer.innerHTML = "";

    // Decide which scripts to load
    const scriptsToLoad = isEnglish
      ? ["js/data.js", "js/property_details.js"]
      : ["js/data_hebrew.js", "js/property_details_hebrew.js"];

    // Load them in sequence. After loading, re-initialize the slider
    loadScriptsSequentially([...scriptsToLoad], () => {
      // Make sure the slider was destroyed first if it already exists
      // so we don't double-initialize. You can do a guard like this:
      if ($('.aa-top-slider').hasClass('slick-initialized')) {
        $('.aa-top-slider').slick('unslick');
      }

      // Now call our universal "initializeSlider" which must be
      // defined in slider.js or slider_hebrew.js
      if (typeof initializeSlider === "function") {
        initializeSlider();
      }
    });
  };

  // Listen for manual toggle changes
  toggle.addEventListener("change", updateLanguageDisplay);

  // On page load, check localStorage for saved language preference
  const savedLanguage = localStorage.getItem("language");
  if (savedLanguage === "english") {
    toggle.checked = true;
  } else {
    // Default or "hebrew"
    toggle.checked = false;
  }

  // Finally, apply correct language and load relevant scripts
  updateLanguageDisplay();
});
