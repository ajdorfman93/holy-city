$(document).ready(function () {
  const dataUrl = 'js/data.json';

  $.getJSON(dataUrl, function (data) {
    const records = data.records || [];
    const neighborhoods = new Set();

    // Extract unique neighborhoods from the records
    records.forEach(record => {
      const fields = record.fields;
      if (fields.Neighborhood_Names) {
        fields.Neighborhood_Names.split(',').forEach(name => {
          neighborhoods.add(name.trim());
        });
      }
    });

    // Convert the Set to an Array and sort alphabetically
    const sortedNeighborhoods = Array.from(neighborhoods).sort();

    // Create the dropdown HTML (use the neighborhood name as value)
    const dropdownHTML = `
      <div class="aa-single-advance-search">
        <select id="neighborhood-select">
          <option value="0" selected>Neighborhood</option>
          ${sortedNeighborhoods.map((neighborhood) => `
            <option value="${neighborhood}">${neighborhood}</option>
          `).join('')}
        </select>
      </div>
    `;

    // Append the dropdown to the desired container
    $('#neighborhood-dropdown-container').html(dropdownHTML);
  });
});