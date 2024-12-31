$(document).ready(function () {
  const dataUrl = 'js/data.json';

  $.getJSON(dataUrl, function (data) {
    const records = data.records || [];
    const neighborhoods = new Set();
    const propertyStatuses = new Set();

    // Extract unique neighborhoods and property statuses from the records
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

    // Append the dropdowns to their respective containers
    $('#neighborhood-dropdown-container').html(neighborhoodDropdownHTML);
    $('#property-status-dropdown-container').html(propertyStatusDropdownHTML);
  });
});
