$(document).ready(function() {
  const dataUrl = 'https://holy-city.getgrist.com/api/docs/boNNWd9gfif2YNdvrfcx97/tables/Properties/records';  // Path to the page that outputs JSON
  let allRecords = []; // to hold all fetched properties

  // Fetch the JSON data from data.html
  $.getJSON(dataUrl, function(data) {
    allRecords = data.records || [];
    renderProperties(allRecords);
    renderPopularProperties(allRecords);
  });

  // Event handlers for filters
  $('.aa-advance-search-top').on('change', 'select', applyFilters);
  $('.aa-advance-search-top').on('click', '.aa-search-btn', function(e){
    e.preventDefault();
    applyFilters();
  });

  // Function to apply filters and update the displayed properties
  function applyFilters() {
    // Get filter values from dropdowns
    const selectedNeighborhood = $('.aa-single-advance-search select').eq(0).val(); // Neighborhood dropdown
    const selectedStatus = $('#property-status').val(); // Property Status dropdown
    const selectedRooms = $('.aa-single-advance-search select').eq(2).val(); // Rooms dropdown (3rd select)

    // Filter logic
    let filtered = allRecords;

    // Filter by Neighborhood if not "0"
    // Note: Your data may store Neighborhood as a number. Ensure value types match.
    if (selectedNeighborhood !== "0") {
      const neighborhoodNumber = parseInt(selectedNeighborhood, 10);
      filtered = filtered.filter(rec => rec.fields.Neighborhood === neighborhoodNumber);
    }

    // Filter by Property Status if not "0"
    // In your data, Property_Status might be "Sale", "Rent", etc.
    // The dropdown might have numeric values (1=For Sale, 2=For Rent). Map them accordingly.
    if (selectedStatus !== "0") {
      let statusFilter = "";
      if (selectedStatus === "1") statusFilter = "Sale";
      else if (selectedStatus === "2") statusFilter = "Rent";
      filtered = filtered.filter(rec => (rec.fields.Property_Status || "").toLowerCase() === statusFilter.toLowerCase());
    }

    // Filter by Rooms if not "0"
    // Assuming Bedrooms is a string like "3" and you just want to match or minimum?
    // If you just want exact match:
    if (selectedRooms !== "0") {
      // If selectedRooms > 5 means 5+
      if (selectedRooms === "5") {
        filtered = filtered.filter(rec => parseInt(rec.fields.Bedrooms, 10) >= 5);
      } else {
        filtered = filtered.filter(rec => rec.fields.Bedrooms === selectedRooms);
      }
    }

    // Render filtered properties
    renderProperties(filtered);
  }

  // Function to render properties in the main area
  function renderProperties(records) {
    const $propertiesList = $('.aa-properties-nav');
    $propertiesList.empty();

    records.forEach(function(record) {
      const f = record.fields;

      let tagClass = '';
      if (f.Property_Status && f.Property_Status.toLowerCase() === 'sale') {
        tagClass = 'for-sale';
      } else if (f.Property_Status && f.Property_Status.toLowerCase() === 'rent') {
        tagClass = 'for-rent';
      } else if (f.Property_Status && f.Property_Status.toLowerCase().includes('sold')) {
        tagClass = 'sold-out';
      }

const propertyHTML = `
  <li>
    <article class="aa-properties-item">
      <a class="aa-properties-item-img" href="#">
        <img src="${f.Img_Urls || 'img/default.jpg'}" alt="${f.Name || 'Property'}">
      </a>
      <div class="aa-tag ${tagClass}">
        ${f.Property_Status || ''}
      </div>
      <div class="aa-properties-item-content">
        <div class="aa-properties-info">
          <span>${f.Bedrooms || 'N/A'} Beds</span>
        </div>
        <div class="aa-properties-about">
          <h3><a href="#">${f.Name || 'Untitled Property'}</a></h3>
          <p>${f.Street1 || ''}, ${f.City || ''}, ${f.State || ''}</p>                     
        </div>
        <div class="aa-properties-detial">
          <span class="aa-price">
            ₪${(f.Price ? f.Price.toLocaleString() : 'N/A')}
          </span>
          <a class="aa-secondary-btn" href="#">View Details</a>
        </div>
      </div>
    </article>
  </li>
`;

      $propertiesList.append(propertyHTML);
    });
  }

  // Function to render popular properties in the sidebar
  function renderPopularProperties(records) {
    const $popularPropertiesSidebar = $('.aa-properties-single-sidebar');
    $popularPropertiesSidebar.find('.media').remove();

    records.forEach(function(record) {
      const f = record.fields;
      if (f.Popular_Properties === true) {
        const sidebarItemHTML = `
          <div class="media">
            <div class="media-left">
              <a href="#">
                <img class="media-object" src="${f.Img_Urls || 'img/default.jpg'}" alt="${f.Name || 'Property'}">
              </a>
            </div>
            <div class="media-body">
              <h4 class="media-heading"><a href="#">${f.Name || 'Untitled Property'}</a></h4>
              <p>${f.Street1 || ''}, ${f.City || ''}</p>                
              <span>$${f.Price || 'N/A'}</span>
            </div>              
          </div>
        `;
        $popularPropertiesSidebar.append(sidebarItemHTML);
      }
    });
  }
});
