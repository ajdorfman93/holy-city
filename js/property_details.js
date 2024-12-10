$(document).ready(function() {
    const dataUrl = 'https://holy-city.getgrist.com/api/docs/boNNWd9gfif2YNdvrfcx97/tables/Properties/records';
  
    // Parse the ?id= parameter
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
  
      // Images
      const imagesContainer = $('#property-images-container');
      imagesContainer.empty();
      if (f.Img_Urls) {
        // Assume Img_Urls is a comma-separated list or single URL
        const urls = f.Img_Urls.split(',');
        urls.forEach(url => {
          url = url.trim();
          if (url) {
            imagesContainer.append(`<img src="${url}" alt="${f.Name || 'Property'}">`);
          }
        });
      }
  
      // Features (assuming f.Features is a comma-separated list of features)
      const featuresList = $('#property-features');
      featuresList.empty();
      if (f.Features) {
        const features = f.Features.split(',');
        features.forEach(feat => {
          featuresList.append(`<li>${feat.trim()}</li>`);
        });
      }
  
      // Video 
      const videoContainer = $('#property-video-container');
      videoContainer.empty();
      if (f.VideoUrl) {
        videoContainer.html(`<iframe width="100%" height="480" src="${f.VideoUrl}" frameborder="0" allowfullscreen></iframe>`);
      }

  
      // Popular Properties and Nearby properties could be implemented similarly if needed
      // For now, you can replicate logic from your main data.js or hardcode
  
      // Example of Popular Properties: 
      // Filter records for Popular_Properties === true and display in sidebar
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
  
      // Nearby properties logic (example)
      // In reality, you'd filter by geographic location or same neighborhood
      const nearbyContainer = $('#nearby-properties-container');
      nearbyContainer.empty();
      // For demonstration: show the first 2 other properties as "nearby"
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
  