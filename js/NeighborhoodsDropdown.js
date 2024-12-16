$(document).ready(function () {
  const dataUrl = 'https://holy-city.getgrist.com/api/docs/boNNWd9gfif2YNdvrfcx97/tables/Properties/records';

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

    // Create the dropdown HTML
    const dropdownHTML = `
      <div class="aa-single-advance-search">
        <select>
          <option value="0" selected>Neighborhood</option>
          ${sortedNeighborhoods.map((neighborhood, index) => `
            <option value="${index + 1}">${neighborhood}</option>
          `).join('')}
        </select>
      </div>
    `;

    // Append the dropdown to the desired container
    $('#neighborhood-dropdown-container').html(dropdownHTML);
  });
});
