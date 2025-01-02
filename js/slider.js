$(document).ready(function () {
  const dataUrl = 'data.json';
  
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
              <span class="aa-top-slider-catg">${f.Property_StatusStr || 'Property'}</span>
               <a href="property_details.html?id=${property.id}"><h2 class="aa-top-slider-title">${f.Name || 'Untitled Property'}</h2></a>
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
  
    
    });
  });
  