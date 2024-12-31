$(document).ready(function () {
  const dataUrl = 'js/data.json';
  let allRecords = []; // We'll store all fetched records here

  $.getJSON(dataUrl, function (data) {
    const records = data.records || [];
    allRecords = records; // Store for later use

    const neighborhoods = new Set();
    const propertyStatuses = new Set();

    // Extract unique neighborhoods & property statuses
    records.forEach(record => {
      const fields = record.fields;
      // Neighborhoods
      if (fields.Neighborhood_Names) {
        fields.Neighborhood_Names.split(',').forEach(name => {
          neighborhoods.add(name.trim());
        });
      }
      // Property Statuses
      if (fields.Property_StatusStr) {
        propertyStatuses.add(fields.Property_StatusStr.trim());
      }
    });

    // Convert the Sets to Arrays and sort them
    const sortedNeighborhoods = Array.from(neighborhoods).sort();
    const sortedPropertyStatuses = Array.from(propertyStatuses).sort();

    // --- Neighborhood Dropdown ---
    const neighborhoodDropdownHTML = `
      <div class="aa-single-advance-search">
        <select id="neighborhood-select">
          <option value="0" selected>Neighborhood</option>
          ${sortedNeighborhoods
            .map(neighborhood => `<option value="${neighborhood}">${neighborhood}</option>`)
            .join('')}
        </select>
      </div>
    `;

    // --- Property Status Dropdown ---
    const propertyStatusDropdownHTML = `
      <div class="aa-single-advance-search">
        <select id="property-status-select">
          <option value="0" selected>Property Status</option>
          ${sortedPropertyStatuses
            .map(status => `<option value="${status}">${status}</option>`)
            .join('')}
        </select>
      </div>
    `;

    // Initialize the sale-type dropdown with no items (or a default)
    const saleTypeDropdownHTML = `
      <div class="aa-single-advance-search">
        <select id="sale-type-select">
          <option value="0" selected>Sale Type</option>
        </select>
      </div>
    `;

    // Append the dropdowns to their respective containers
    $('#neighborhood-dropdown-container').html(neighborhoodDropdownHTML);
    $('#property-status-dropdown-container').html(propertyStatusDropdownHTML);
    $('#sale-type-dropdown-container').html(saleTypeDropdownHTML);

    // IMPORTANT: Attach event listener AFTER we render the property status dropdown
    $('#property-status-select').on('change', function() {
      const selectedStatus = $(this).val();
      updateSaleTypeDropdown(selectedStatus);
    });
  });

  // This function updates #sale-type-select according to the selected property status
  function updateSaleTypeDropdown(selectedStatus) {
    // If user hasn't chosen a valid status, reset or keep empty
    if (!selectedStatus || selectedStatus === '0') {
      const defaultHTML = `
        <div class="aa-single-advance-search">
          <select id="sale-type-select">
            <option value="0" selected>Sale Type</option>
          </select>
        </div>
      `;
      $('#sale-type-dropdown-container').html(defaultHTML);
      return;
    }

    // Collect all matching Sale_Type values from the records that match selectedStatus
    const matchingSaleTypes = new Set();
    allRecords.forEach(record => {
      const fields = record.fields || {};
      const propertyStatus = (fields.Property_StatusStr || '').trim();
      const saleType = (fields.Sale_Type || '').trim();

      if (propertyStatus === selectedStatus && saleType) {
        matchingSaleTypes.add(saleType);
      }
    });

    // Convert to array & sort
    const sortedSaleTypes = Array.from(matchingSaleTypes).sort();

    // Build new dropdown HTML
    const saleTypeDropdownHTML = `
      <div class="aa-single-advance-search">
        <select id="sale-type-select">
          <option value="0" selected>Sale Type</option>
          ${sortedSaleTypes
            .map(st => `<option value="${st}">${st}</option>`)
            .join('')}
        </select>
      </div>
    `;

    // Replace the existing sale-type dropdown
    $('#sale-type-dropdown-container').html(saleTypeDropdownHTML);
  }
});
