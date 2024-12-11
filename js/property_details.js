$(document).ready(function() {
  const dataUrl = 'https://holy-city.getgrist.com/api/docs/boNNWd9gfif2YNdvrfcx97/tables/Properties/records';
  
  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = parseInt(urlParams.get('id'), 10);
  
  if (!propertyId) {
    console.error("No property ID provided in the URL.");
    return;
  }
  
  $.getJSON(dataUrl, function(data) {
    const records = data.records || [];
    const record = records.find(r => r.id === propertyId);
  
    if (!record) {
      console.error("Property not found for ID:", propertyId);
      return;
    }
  
    const f = record.fields;
    // Populate fields
    $('#property-title').text(f.Name || 'Property Details');
    $('#property-breadcrumb-title').text(f.Name || 'Property');
    $('#property-name').text(f.Name || 'Untitled Property');
    $('#property-price').text('₪' + (f.Price ? parseInt(f.Price).toLocaleString() : 'N/A'));
    $('#property-description').text(f.Description || '');
  
// Display Neighborhood Names with Icon
const neighborhoodContainer = $('#property-neighborhood');
neighborhoodContainer.empty();
if (f.Neighborhood_Names) {
  neighborhoodContainer.html(`
    <i class="fa fa-map-marker"></i> ${f.Neighborhood_Names}
  `);
}
    // Image Gallery with Fancybox
    const imagesContainer = $('#property-images-container');
    imagesContainer.empty();
    if (f.Img_Urls) {
      const urls = f.Img_Urls.split(',');
      urls.forEach(url => {
        url = url.trim();
        if (url) {
          // Wrap each image in an anchor tag for Fancybox gallery
          imagesContainer.append(`
            <a href="${url}" data-fancybox="gallery">
              <img src="${url}" alt="${f.Name || 'Property'}" style="max-height:400px;    object-fit: cover;" />
            </a>
          `);
        }
      });
    }
    // Initialize fancybox on the gallery links
    $("[data-fancybox='gallery']").fancybox();

    // Features
    const featuresList = $('#property-features');
    featuresList.empty();
    if (f.Features) {
      const htmlContent = f.Features.replace(/\n/g, '<br>');
      // Now wrap it however you like, for example as one `<li>`:
      featuresList.append(`<li>${htmlContent}</li>`);
    }
    
  
    // About
    const aboutList = $('#property-about');
    aboutList.empty();
    if (f.About) {
      const htmlContent = f.About.replace();
      // Now wrap it however you like, for example as one `<li>`:
      aboutList.append(`${htmlContent}`);
    }
    
  
  // Video
  const videoContainer = $('#property-video-container');
  videoContainer.empty();
  
  if (f.VideoUrl) {
      videoContainer.html(`
          <h4>Property Video</h4>
          <div class="video-wrapper">
              <iframe 
                  src="${f.VideoUrl}" 
                  frameborder="0" 
                  allowfullscreen
                  style="
                      position: absolute;
                      top: 0;
                      left: 0;
                      width: 100%;
                      height: 100%;
                      max-width: none;
                      max-height: none;
                      object-fit: cover;
                      display: block;
                  "
              ></iframe>
          </div>
      `);
  }
  

    // Popular Properties
    const popularRecords = records.filter(r => r.fields.Popular_Properties === true);
    const popularContainer = $('#popular-properties-sidebar');
    popularContainer.empty();
    popularRecords.forEach(rp => {
      const fp = rp.fields;
      popularContainer.append(`
        <div class="media">
          <div class="media-left">
            <a href="property_details.html?id=${rp.id}">
              <img class="media-object" src="${fp.Img_Urls || 'img/default.jpg'}" alt="${fp.Name || 'Property'}">
            </a>
          </div>
          <div class="media-body">
            <h4 class="media-heading"><a href="property_details.html?id=${rp.id}">${fp.Name || 'Untitled Property'}</a></h4>
            <p>${fp.Street1 || ''}, ${fp.City || ''}</p>                
            <span>₪${(fp.Price ? parseInt(fp.Price).toLocaleString() : 'N/A')}</span>
          </div>              
        </div>
      `);
    });
  
    // Nearby properties (just an example)
    const nearbyContainer = $('#nearby-properties-container');
    nearbyContainer.empty();
    const nearbyRecords = records.filter(r => r.id !== propertyId).slice(0, 2);
    nearbyRecords.forEach(nr => {
      const nf = nr.fields;
      let tagClass = '';
      if (nf.Property_Status && nf.Property_Status.toLowerCase() === 'sale') {
        tagClass = 'for-sale';
      } else if (nf.Property_Status && nf.Property_Status.toLowerCase() === 'rent') {
        tagClass = 'for-rent';
      } else if (nf.Property_Status && nf.Property_Status.toLowerCase().includes('sold')) {
        tagClass = 'sold-out';
      }
  
      nearbyContainer.append(`
        <div class="col-md-6">
          <article class="aa-properties-item">
            <a class="aa-properties-item-img" href="property_details.html?id=${nr.id}">
              <img alt="img" src="${nf.Img_Urls || 'img/default.jpg'}">
            </a>
            <div class="aa-tag ${tagClass}">
              ${nf.Property_Status || ''}
            </div>
            <div class="aa-properties-item-content">
              <div class="aa-properties-info">
                <span>${nf.Bedrooms || 'N/A'} Beds</span>
              </div>
              <div class="aa-properties-about">
                <h3><a href="property_details.html?id=${nr.id}">${nf.Name || 'Untitled Property'}</a></h3>
                <p>${nf.Description || ''}</p>                      
              </div>
              <div class="aa-properties-detial">
                <span class="aa-price">
                  ₪${(nf.Price ? parseInt(nf.Price).toLocaleString() : 'N/A')}
                </span>
                <a class="aa-secondary-btn" href="property_details.html?id=${nr.id}">View Details</a>
              </div>
            </div>
          </article>
        </div>
      `);
    });
  });
});
