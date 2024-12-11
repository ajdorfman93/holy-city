$(document).ready(function () {
    const dataUrl = 'https://holy-city.getgrist.com/api/docs/boNNWd9gfif2YNdvrfcx97/tables/Properties/records';
  
    $.getJSON(dataUrl, function (data) {
      const records = data.records || [];
  
      // Populate Top Slider
      const popularProperties = records.filter(rec => rec.fields.Popular_Properties === true);
      const $slider = $('.aa-top-slider');
      $slider.empty();
  
      popularProperties.forEach(property => {
        const f = property.fields;
        $slider.append(`
          <div class="aa-top-slider-single">
            <img src="${f.Img_Urls ? f.Img_Urls.split(',')[0].trim() : 'img/default.jpg'}" alt="${f.Name || 'Property'}">
            <div class="aa-top-slider-content">
              <span class="aa-top-slider-catg">${f.Property_Status || 'Property'}</span>
              <h2 class="aa-top-slider-title">${f.Name || 'Untitled Property'}</h2>
              <p class="aa-top-slider-location"><i class="fa fa-map-marker"></i>${f.Neighborhood_Names || ''}</p>
              <span class="aa-top-slider-off">${f.Discount ? `${f.Discount}% OFF` : ''}</span>
              <p class="aa-top-slider-price">₪${f.Price ? parseInt(f.Price).toLocaleString() : 'N/A'}</p>
              <a href="property_details.html?id=${property.id}" class="aa-top-slider-btn">Read More <span class="fa fa-angle-double-right"></span></a>
            </div>
          </div>
        `);
      });
  
      // Initialize Slick Slider
      $slider.slick({
        autoplay: true,
        autoplaySpeed: 6000,
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
      });
  
      // Populate Latest Properties
      const sortedByDate = records.sort((a, b) => new Date(b.fields.DateStr) - new Date(a.fields.DateStr)).slice(0, 6);
      const $latestProperties = $('#latest-properties-list');
      $latestProperties.empty();
  
      sortedByDate.forEach(property => {
        const f = property.fields;
        let tagClass = '';
        if (f.Property_Status && f.Property_Status.toLowerCase() === 'sale') {
          tagClass = 'for-sale';
        } else if (f.Property_Status && f.Property_Status.toLowerCase() === 'rent') {
          tagClass = 'for-rent';
        } else if (f.Property_Status && f.Property_Status.toLowerCase().includes('sold')) {
          tagClass = 'sold-out';
        }
  
        $latestProperties.append(`
          <div class="col-md-4">
            <article class="aa-properties-item">
              <a href="property_details.html?id=${property.id}" class="aa-properties-item-img">
                <img src="${f.Img_Urls ? f.Img_Urls.split(',')[0].trim() : 'img/default.jpg'}" alt="${f.Name || 'Property'}">
              </a>
              <div class="aa-tag ${tagClass}">
                ${f.Property_Status || ''}
              </div>
              <div class="aa-properties-item-content">
                <div class="aa-properties-info">
                  <span>${f.Bedrooms || 'N/A'} Beds</span>
                 
                </div>
                <div class="aa-properties-about">
                  <h3><a href="property_details.html?id=${property.id}">${f.Name || 'Untitled Property'}</a></h3>
                  <p>${f.Description || ''}</p>
                </div>
                <div class="aa-properties-detial">
                  <span class="aa-price">₪${f.Price ? parseInt(f.Price).toLocaleString() : 'N/A'}</span>
                  <a href="property_details.html?id=${property.id}" class="aa-secondary-btn">View Details</a>
                </div>
              </div>
            </article>
          </div>
        `);
      });
    });
  });
  