$(document).ready(function() {
  const dataUrl = 'https://holy-city.getgrist.com/api/docs/boNNWd9gfif2YNdvrfcx97/tables/Properties/records';
  let allRecords = [];

  let currentSort = 'default'; // 'default', 'name', 'price', 'date'
  let currentShow = 6;         // items per page
  let currentPage = 1;         // current page
  let totalPages = 1;

  // Fetch data
  $.getJSON(dataUrl, function(data) {
    allRecords = data.records || [];
    applyFilters(); 
    renderPopularProperties(allRecords);
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
    const selectedNeighborhood = $('.aa-single-advance-search select').eq(0).val();
    const selectedStatus = $('#property-status').val();
    const selectedRooms = $('.aa-single-advance-search select').eq(2).val();

    let filtered = allRecords.slice();

    // Neighborhood
    if (selectedNeighborhood !== "0") {
      const neighborhoodNumber = parseInt(selectedNeighborhood, 10);
      filtered = filtered.filter(rec => rec.fields.Neighborhood === neighborhoodNumber);
    }

    // Status
    if (selectedStatus !== "0") {
      let statusFilter = "";
      if (selectedStatus === "1") statusFilter = "Sale";
      else if (selectedStatus === "2") statusFilter = "Rent";
      filtered = filtered.filter(rec => (rec.fields.Property_Status || "").toLowerCase() === statusFilter.toLowerCase());
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
    // Default means no re-sorting
    return records;
  }

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
                <p>${f.Street1 || ''}, ${f.Neighborhood_Names || ''}</p>                     
              </div>
              <div class="aa-properties-detial">
                <span class="aa-price">
                  ₪${(f.Price ? parseInt(f.Price).toLocaleString() : 'N/A')}
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
              <p>${f.Street1 || ''}, ${f.Neighborhood || ''}</p>                
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

    if (totalPages <= 1) return; // No pagination needed

    const prevDisabled = currentPage === 1 ? 'disabled' : '';
    $pagination.append(`
      <li class="${prevDisabled}">
        <a href="#" aria-label="Previous" data-page="${currentPage - 1}">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
    `);

    for (let i = 1; i <= totalPages; i++) {
      const activeClass = i === currentPage ? 'active' : '';
      $pagination.append(`
        <li class="${activeClass}">
          <a href="#" data-page="${i}">${i}</a>
        </li>
      `);
    }

    const nextDisabled = currentPage === totalPages ? 'disabled' : '';
    $pagination.append(`
      <li class="${nextDisabled}">
        <a href="#" aria-label="Next" data-page="${currentPage + 1}">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    `);
  }
});
