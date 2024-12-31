$(document).ready(function() {
  const dataUrl = 'js/data.json';
  
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
              <img src="${url}" alt="${f.Name || 'Property'}" style="max-height:400px;    object-fit: contain;" />
            </a>
          `);
        }
      });
    }
    // Initialize fancybox on the gallery links
    $("[data-fancybox='gallery']").fancybox();

// Property Details Columns
const detailsContainer = $('#property-features'); // Target container
detailsContainer.empty(); // Clear existing content

const propertyDetails = [
  { header: 'Size', data: (f.Property_Size ? `${f.Property_Size} SQM` : 'N/A') },
    { header: 'Bedrooms', data: f.StrBedrooms || 'N/A' },
    { header: 'Neighborhood', data: f.Neighborhood_Names || 'N/A' },
    { header: 'Address', data: f.Street1 || 'N/A' },
    { header: 'Floor', data: f.Floor || 'N/A' },
    { header: 'Type', data: f.Property_Type || 'N/A' },
    { header: 'Property Status', data: f.Property_Status || 'N/A' },
];

// Render each property detail in the list-group layout
propertyDetails.forEach(detail => {
    detailsContainer.append(`
        <div class="list-group-item">
            <span class="header">${detail.header}</span>
            <span class="data">${detail.data}</span>
        </div>
    `);
});

  
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
  
// Features Section
const featuresContainer = $('#property-features-list'); // Target container for features
featuresContainer.empty(); // Clear existing content

if (f.FeaturesStr) {
  // Filter out "L" and trim other features
  const featuresArray = f.FeaturesStr
      .filter(feature => feature !== "L") // Remove "L"
      .map(feature => feature.trim()); // Ensure other features are trimmed
  console.log(featuresArray);
  
    // Render each feature
    featuresArray.forEach(feature => {
        let wheelchairIcon = ''; // Default: No wheelchair icon

        // Add wheelchair icon for Accessible
        if (feature.toLowerCase().includes('accessible')) {
            wheelchairIcon = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-wheelchair" viewBox="0 0 16 16">
  <path d="M12 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m-.663 2.146a1.5 1.5 0 0 0-.47-2.115l-2.5-1.508a1.5 1.5 0 0 0-1.676.086l-2.329 1.75a.866.866 0 0 0 1.051 1.375L7.361 3.37l.922.71-2.038 2.445A4.73 4.73 0 0 0 2.628 7.67l1.064 1.065a3.25 3.25 0 0 1 4.574 4.574l1.064 1.063a4.73 4.73 0 0 0 1.09-3.998l1.043-.292-.187 2.991a.872.872 0 1 0 1.741.098l.206-4.121A1 1 0 0 0 12.224 8h-2.79zM3.023 9.48a3.25 3.25 0 0 0 4.496 4.496l1.077 1.077a4.75 4.75 0 0 1-6.65-6.65z"/>
</svg>`;
        }

        // Append the feature to the container
        featuresContainer.append(`
          <div class="list-checks-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                  <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
              </svg>
              ${wheelchairIcon}
              <span class="data">${feature}</span>
          </div>
      `);
  });
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
                <span>${nf.StrBedrooms || 'N/A'} Beds</span>
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
