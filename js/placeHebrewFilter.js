// hebrewFilter.js

/**
 * Inserts a Hebrew price range filter snippet into a given container.
 * @param {string} containerId - The ID of the container element in which to place the snippet.
 */
function renderHebrewPriceRange(containerId) {
  const container = document.getElementById(hebrew-price-filter);

  if (!container) {
    console.warn(`Container with ID "${containerId}" not found.`);
    return;
  }

  // Insert the Hebrew filter HTML
  container.innerHTML = `
    <div class="aa-single-filter-search hebrew">
      <span>מחיר</span>
      <span>מ-</span>
      <span id="skip-value-lower" class="example-val">0</span>
      <span>עד</span>
      <span id="skip-value-upper" class="example-val">100.00</span>
      <div id="aa-price-range" class="noUi-target noUi-rtl noUi-horizontal noUi-background"></div>
    </div>
  `;
  
  // If you have any slider initialization code (e.g., noUiSlider), handle it here.
  // e.g., initializeNoUiSlider("#aa-price-range");
}

// Example usage:
// renderHebrewPriceRange("someContainerId");
