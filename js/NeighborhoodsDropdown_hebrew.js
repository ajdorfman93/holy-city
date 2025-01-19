$(document).ready(function () {
  const dataUrl = 'json/data.json';
  let allRecords = [];
  // We'll keep track of the current sale type as a global variable.
  // If you need it elsewhere, make it window.currentSaleType or similar.
  let currentSaleType = "";

  // Fetch data
  $.getJSON(dataUrl, function (data) {
    const records = data.records || [];
    allRecords = records;

    const neighborhoods = new Set();
    const propertyStatuses = new Set();

    // Extract unique neighborhoods & property statuses
    records.forEach(record => {
      const fields = record.fields || {};

      // Neighborhoods
      if (fields.Neighborhood_Hebrew) {
        fields.Neighborhood_Hebrew.split(',').forEach(name => {
          neighborhoods.add(name.trim());
        });
      }

      // Property Statuses
      if (fields.Property_Status_Hebrew) {
        propertyStatuses.add(fields.Property_Status_Hebrew.trim());
      }
    });

    // Convert the Sets to Arrays and sort them
    const sortedNeighborhoods = Array.from(neighborhoods).sort();
    const sortedPropertyStatuses = Array.from(propertyStatuses).sort();

    // --- Neighborhood Dropdown ---
    const neighborhoodDropdownHTML = `
      <div class="aa-single-advance-search2 hebrew">
        <select id="neighborhood-select">
          <option value="0" selected>שכונה</option>
          ${sortedNeighborhoods
            .map(neighborhood => `<option value="${neighborhood}">${neighborhood}</option>`)
            .join('')}
        </select>
      </div>
    `;

    // --- Property Status Dropdown ---
    const propertyStatusDropdownHTML = `
      <div class="aa-single-advance-search2 hebrew">
        <select id="property-status-select">
          <option value="0" selected>סטטוס נכס</option>
          ${sortedPropertyStatuses
            .map(status => `<option value="${status}">${status}</option>`)
            .join('')}
        </select>
      </div>
    `;

    // Insert the dropdowns into the page
    $('#neighborhood-dropdown-container').html(neighborhoodDropdownHTML);
    $('#property-status-dropdown-container').html(propertyStatusDropdownHTML);

    // Whenever property status changes, we figure out the associated sale type:
    $('#property-status-select').on('change', function() {
      const selectedStatus = $(this).val();
      updateSaleTypeValue(selectedStatus);
    });
  });

  /**
   * updateSaleTypeValue(selectedStatus)
   * ----------------------------------
   * Finds the Sale_Type from the records that match the chosen property status
   * and sets currentSaleType. If multiple Sale Types exist, picks the first one.
   * Optionally, call updatePriceRangeBasedOnSaleType(currentSaleType) (defined in custom.js).
   */
  function updateSaleTypeValue(selectedStatus) {
    // If user hasn't chosen a valid status, reset and exit
    if (!selectedStatus || selectedStatus === '0') {
      currentSaleType = "";
      // If you need to reset your slider, do so here:
      if (typeof updatePriceRangeBasedOnSaleType === 'function') {
        updatePriceRangeBasedOnSaleType(currentSaleType);
      }
      return;
    }

    // Gather all matching Sale_Type values from records that match this property status
    const matchingSaleTypes = new Set();
    allRecords.forEach(record => {
      const fields = record.fields || {};
      const propertyStatus = (fields.Property_Status_Hebrew || '').trim();
      const saleType = (fields.Sale_Type || '').trim();

      if (propertyStatus === selectedStatus && saleType) {
        matchingSaleTypes.add(saleType);
      }
    });

    // Convert to an array & sort
    const sortedSaleTypes = Array.from(matchingSaleTypes).sort();

    // If there are multiple possible sale types, you could store them all or pick the first.
    // For now, let's pick the first.
    currentSaleType = sortedSaleTypes[0] || "";

    // If you want to update the slider or filters in custom.js:
    if (typeof updatePriceRangeBasedOnSaleType === 'function') {
      updatePriceRangeBasedOnSaleType(currentSaleType);
    }
  }
});
