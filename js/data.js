$(document).ready(function() {
  // ---------------------------------------------------------------------------
  // The path to your JSON file. We add a query parameter to "bust" cache issues.
  // If GitHub Pages or your local environment has a different structure, adjust
  // this path so it correctly points to the json/data.json file.
  // ---------------------------------------------------------------------------
  const dataUrl = 'json/data.json?v=' + new Date().getTime();

  // ---------------------------------------------------------------------------
  // Define global variables to manage the data, sorting, pagination, etc.
  // ---------------------------------------------------------------------------
  let allRecords = [];
  let currentSort = 'default'; // possible values: 'default', 'name', 'price', 'date'
  let currentShow = 6;         // how many items to show per page
  let currentPage = 1;         // current pagination page
  let totalPages = 1;

  // ---------------------------------------------------------------------------
  // Wrap the AJAX call in .done() and .fail() so we can detect errors.
  // Use console.log to confirm success/fail scenarios.
  // ---------------------------------------------------------------------------
  $.getJSON(dataUrl)
    .done(function(data) {
      console.log('✅ JSON fetched successfully.', data);

      const records = data.records || [];
      // Filter only those that should Display
      allRecords = records.filter(rec => rec.fields.Display === true);
      
      // Apply filters and render as soon as data is ready
      applyFilters();
      renderPopularProperties(allRecords);
    })
    .fail(function(jqxhr, textStatus, error) {
      console.error('❌ Failed to load JSON data:', textStatus, error);
      // For debugging: Make sure the file path is correct and the server is running
    });


  // Filters (Neighborhood, Status, Rooms)
  $('.aa-advance-search-top').on('change', 'select', applyFilters);
  $('.aa-advance-search-top').on('click', '.aa-search-btn', function(e) {
    e.preventDefault();
    applyFilters();
  });

  // Sort and Show event handlers
  $('.aa-sort-form select').on('change', function() {
    const val = $(this).val();
    if (val === '1') currentSort = 'default';
    else if (val === '2') currentSort = 'name';
    else if (val === '3') currentSort = 'price';
    else if (val === '4') currentSort = 'date';
    currentPage = 1; 
    applyFilters();
  });

  $('.aa-show-form select').on('change', function() {
    const val = $(this).val();
    if (val === '1') currentShow = 6;
    else if (val === '2') currentShow = 12;
    else if (val === '3') currentShow = 24;
    currentPage = 1; 
    applyFilters();
  });

  // Use event delegation for pagination links
  $(document).on('click', '.pagination a', function(e) {
    e.preventDefault();
    const page = parseInt($(this).data('page'), 10);
    if (page > 0 && page <= totalPages) {
      currentPage = page;
      applyFilters();
    }
  });

  // Make applyFilters globally accessible
  window.applyFilters = applyFilters;

  function applyFilters() {
    const selectedNeighborhood = $('#neighborhood-select').val();
    const selectedStatus = $('#property-status-select').val();
    const selectedRooms = $('.aa-single-advance-search select').eq(2).val();

    let filtered = allRecords.slice();

    // CHANGED: If "0", it means no neighborhood filter. Otherwise, filter by name.
    if (selectedNeighborhood !== "0") {
      filtered = filtered.filter(rec => {
        if (!rec.fields.Neighborhood_Names) return false;
        // Convert Neighborhood_Names to an array of trimmed names
        const nNames = rec.fields.Neighborhood_Names
          .split(',')
          .map(str => str.trim());
        // Return true if it includes the selected neighborhood
        return nNames.includes(selectedNeighborhood);
      });
    }

    // Status (compare strings, e.g. "Sale", "Rent")
    if (selectedStatus !== '0') {
      filtered = filtered.filter(rec =>
        (rec.fields.Property_StatusStr || '').toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    // Rooms
    if (selectedRooms !== "0") {
      if (selectedRooms === "5") {
        filtered = filtered.filter(rec => parseInt(rec.fields.Bedrooms, 10) >= 5);
      } else {
        filtered = filtered.filter(rec => rec.fields.Bedrooms === selectedRooms);
      }
    }

    // Price filtering (using priceMin, priceMax from custom.js)
    filtered = filtered.filter(rec => {
      const price = parseFloat(rec.fields.Price) || 0;
      return price >= priceMin && price <= priceMax;
    });

    // Sorting
    filtered = applySorting(filtered, currentSort);

    // Pagination
    const totalItems = filtered.length;
    totalPages = Math.ceil(totalItems / currentShow);
    if (currentPage > totalPages) currentPage = 1;

    const startIndex = (currentPage - 1) * currentShow;
    const endIndex = startIndex + currentShow;
    const limited = filtered.slice(startIndex, endIndex);

    renderProperties(limited);
    renderPagination(totalPages, currentPage);
  }

  function applySorting(records, sortType) {
    if (sortType === 'name') {
      records.sort((a, b) => {
        const nameA = (a.fields.Name || '').toLowerCase();
        const nameB = (b.fields.Name || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
    } else if (sortType === 'price') {
      records.sort((a, b) => {
        const priceA = parseFloat(a.fields.Price) || 0;
        const priceB = parseFloat(b.fields.Price) || 0;
        return priceA - priceB;
      });
    } else if (sortType === 'date') {
      records.sort((a, b) => {
        const dateA = a.fields.DateStr ? new Date(a.fields.DateStr) : new Date(0);
        const dateB = b.fields.DateStr ? new Date(b.fields.DateStr) : new Date(0);
        return dateA - dateB;
      });
    }
    return records;
  }

  function renderProperties(records) {
    const $propertiesList = $('.aa-properties-nav');
    $propertiesList.empty();
  
    records.forEach(function(record) {
      const f = record.fields || {};
      const statusText = f.Property_StatusStr || ''; // Display exactly what's in JSON

      // Determine the appropriate image section (with or without link) 
      // and the overlay if "Sold_or_Rented" is true
      let imageSection, nameSection;

      if (f.Sold_or_Rented) {
        // Offmarket: no link, darkened image, overlay text
        imageSection = `
          <div class="aa-properties-item-img offmarket">
            <img 
              src="${f.Img_Urls ? f.Img_Urls.split(',')[0].trim() : 'img/default.jpg'}" 
              alt="${f.Name || 'Property'}"
            >
            <div class="offmarket-text">${f.Offmarket}</div>
          </div>
        `;
        nameSection = `<span class="property-name">${f.Name || 'Untitled Property'}</span>`;
      } else {
        // Normal: clickable link to details
        imageSection = `
          <a class="aa-properties-item-img" href="property_details.html?id=${record.id}">
            <img 
              src="${f.Img_Urls ? f.Img_Urls.split(',')[0].trim() : 'img/default.jpg'}" 
              alt="${f.Name || 'Property'}"
            >
          </a>
        `;
        nameSection = `
          <a href="property_details.html?id=${record.id}">
            ${f.Name || 'Untitled Property'}
          </a>
        `;
      }

      const propertyHTML = `
        <li>
          <article class="aa-properties-item">
            ${imageSection}
            <!-- Just the single 'aa-tag' class; the text is from Property_StatusStr -->
            <div class="aa-tag">${statusText}</div>
            <div class="aa-properties-item-content">
              <h3>
                ${nameSection}
              </h3>
              <p>${f.Street1 || ''}, ${f.Neighborhood_Names || ''}</p>
              <span class="aa-price">
                ₪${f.Price ? parseInt(f.Price, 10).toLocaleString() : 'N/A'}
              </span>
            </div>
          </article>
        </li>
      `;

      $propertiesList.append(propertyHTML);
    });
  }

  function renderPopularProperties(records) {
    const $popularPropertiesSidebar = $('.aa-properties-single-sidebar');
    $popularPropertiesSidebar.find('.media').remove();

    records.forEach(function(record) {
      const f = record.fields;
      if (f.Popular_Properties === true) {
        // Similar "Sold_or_Rented" check for popular properties
        let imageSection, nameSection;
        if (f.Sold_or_Rented) {
          // Offmarket: no link, darkened image, overlay text
          imageSection = `
            <div class="media-left offmarket">
              <img class="media-object" 
                   src="${f.Img_Urls ? f.Img_Urls.split(',')[0].trim() : 'img/default.jpg'}" 
                   alt="${f.Name || 'Property'}">
              <div class="offmarket-text">${f.Offmarket}</div>
            </div>
          `;
          nameSection = `<span class="property-name">${f.Name || 'Untitled Property'}</span>`;
        } else {
          // Normal: clickable link to details
          imageSection = `
            <div class="media-left">
              <a href="property_details.html?id=${record.id}">
                <img class="media-object" 
                     src="${f.Img_Urls ? f.Img_Urls.split(',')[0].trim() : 'img/default.jpg'}" 
                     alt="${f.Name || 'Property'}">
              </a>
            </div>
          `;
          nameSection = `
            <a href="property_details.html?id=${record.id}">
              ${f.Name || 'Untitled Property'}
            </a>
          `;
        }

        const sidebarItemHTML = `
          <div class="media">
            ${imageSection}
            <div class="media-body">
              <h4 class="media-heading">
                ${nameSection}
              </h4>
              <p>${f.Street1 || ''}</p>
              <span>₪${(f.Price ? parseInt(f.Price).toLocaleString() : 'N/A')}</span>
            </div>              
          </div>
        `;
        $popularPropertiesSidebar.append(sidebarItemHTML);
      }
    });
  }

  function renderPagination(totalPages, currentPage) {
    const $pagination = $('.pagination');
    $pagination.empty();

    if (totalPages <= 1) return;

    const prevDisabled = currentPage === 1 ? 'disabled' : '';
    $pagination.append(`<li class="${prevDisabled}"><a href="#" data-page="${currentPage - 1}">&laquo;</a></li>`);

    for (let i = 1; i <= totalPages; i++) {
      const activeClass = i === currentPage ? 'active' : '';
      $pagination.append(`<li class="${activeClass}"><a href="#" data-page="${i}">${i}</a></li>`);
    }

    const nextDisabled = currentPage === totalPages ? 'disabled' : '';
    $pagination.append(`<li class="${nextDisabled}"><a href="#" data-page="${currentPage + 1}">&raquo;</a></li>`);
  }
});
