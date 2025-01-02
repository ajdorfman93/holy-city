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
          <div class="aa-top-slider-single hebrew">
            <img src="${f.Img_Urls ? f.Img_Urls.split(',')[0].trim() : 'img/default.jpg'}" alt="${f.Name_Hebrew || 'Property'}">
            <div class="aa-top-slider-content">
              <span class="aa-top-slider-catg">${f.Property_Status_Hebrew || 'Property'}</span>
               <a href="property_details.html?id=${property.id}"><h2 class="aa-top-slider-title hebrew">${f.Name_Hebrew || 'Untitled Property'}</h2></a>
              <p class="aa-top-slider-location hebrew" style="font-size: 22px">${f.Neighborhood_Hebrew || ''}<i class="fa fa-map-marker"></i></p>
              <span class="aa-top-slider-off">${f.Discount ? `${f.Discount}% OFF` : ''}</span>
              <p class="aa-top-slider-price">₪${f.Price ? parseInt(f.Price).toLocaleString() : 'N/A'}</p>
              <a href="property_details.html?id=${property.id}" class="aa-top-slider-btn" style="font-size: 22px;"><span class="fa fa-angle-double-right"  style="transform: translateY(2px)"></span>קרא עוד</a>
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
  