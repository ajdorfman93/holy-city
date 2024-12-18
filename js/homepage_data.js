$(document).ready(function() {
  const dataUrl = 'js/data.json';
  
    console.log("Fetching data from:", dataUrl);
  
    $.getJSON(dataUrl, function(data) {
      console.log("Data fetched:", data);
      const records = data.records || [];
  

      // Populate Latest 6 Properties by date
      const latestContainer = $('#latest-properties-list');
      latestContainer.empty();
  
      const datedRecords = records.filter(r => r.fields.DateStr);
      console.log("Dated Records:", datedRecords);
      datedRecords.sort((a, b) => {
        const dateA = new Date(a.fields.DateStr);
        const dateB = new Date(b.fields.DateStr);
        return dateB - dateA; // Descending
      });
  
      const latestSix = datedRecords.slice(0, 6);
      console.log("Latest 6 Properties:", latestSix);
  
      latestSix.forEach(prop => {
        const f = prop.fields;
        let tagClass = '';
        if (f.Property_Status && f.Property_Status.toLowerCase() === 'sale') {
          tagClass = 'for-sale';
        } else if (f.Property_Status && f.Property_Status.toLowerCase() === 'rent') {
          tagClass = 'for-rent';
        } else if (f.Property_Status && f.Property_Status.toLowerCase().includes('sold')) {
          tagClass = 'sold-out';
        }
  
        let imageUrl = 'img/default.jpg';
        if (f.Img_Urls) {
          const urls = f.Img_Urls.split(',');
          if (urls.length > 0) {
            imageUrl = urls[0].trim();
          }
        }
  
        const latestItem = `
          <div class="col-md-4">
            <article class="aa-properties-item fadein">
              <a href="property_details.html?id=${prop.id}" class="aa-properties-item-img">
                <img src="${imageUrl}" alt="img">
              </a>
              <div class="aa-tag ${tagClass}">
                ${f.Property_Status || ''}
              </div>
              <div class="aa-properties-item-content">
                <div class="aa-properties-info">
                  <span>${f.Bedrooms || 'N/A'} Beds</span>
                </div>
                <div class="aa-properties-about">
                  <h3><a href="property_details.html?id=${prop.id}">${f.Name || 'Untitled Property'}</a></h3>
                  <p>${f.Description || ''}</p>
                </div>
                <div class="aa-properties-detial">
                  <span class="aa-price">
                    ₪${(f.Price ? parseInt(f.Price).toLocaleString() : 'N/A')}
                  </span>
                  <a href="property_details.html?id=${prop.id}" class="aa-secondary-btn">View Details</a>
                </div>
              </div>
            </article>
          </div>
        `;
        latestContainer.append(latestItem);
      });
  
      console.log("Homepage data populated successfully.");
    })
    .fail(function(jqxhr, textStatus, error) {
      console.error("Failed to fetch data:", textStatus, error);
    });
  });
  