// homepage_data.js
$(document).ready(function() {
  const dataUrl = 'js/data.json';

  console.log("Fetching data from:", dataUrl);

  $.getJSON(dataUrl)
    .done(function(data) {
      console.log("Data fetched:", data);
      const records = data.records || [];

      // 1. Filter only records that have Display === true
      const displayRecords = records.filter(r => {
        return r.fields && r.fields.Display === true;
      });

      // 2. Filter further by those that actually have a DateStr
      const datedRecords = displayRecords.filter(r => r.fields.DateStr);
      console.log("Dated Records (Display === true, with DateStr):", datedRecords);

      // Sort descending by date
      datedRecords.sort((a, b) => {
        const dateA = new Date(a.fields.DateStr);
        const dateB = new Date(b.fields.DateStr);
        return dateB - dateA; // Descending order
      });

      // Get only the latest 6
      const latestSix = datedRecords.slice(0, 6);
      console.log("Latest 6 Properties:", latestSix);

      // Clear container before appending
      const latestContainer = $('#latest-properties-list');
      latestContainer.empty();

      // If none found, display a message
      if (latestSix.length === 0) {
        latestContainer.append('<p>No latest properties found.</p>');
        console.log("No properties found to display.");
        return;
      }

      // Populate Latest 6 Properties
      latestSix.forEach(prop => {
        const f = prop.fields || {};

        // Use Property_StatusStr from JSON for the displayed text
        const statusText = f.Property_StatusStr || '';

        // Single CSS class for the tag
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
              <div class="aa-tag">
                ${statusText}
              </div>
              <div class="aa-properties-item-content">
                <div class="aa-properties-info">
                  <span>${f.Bedrooms || 'N/A'} Beds</span>
                </div>
                <div class="aa-properties-about">
                  <h3>
                    <a href="property_details.html?id=${prop.id}">
                      ${f.Name || 'Untitled Property'}
                    </a>
                  </h3>
                  <p>${f.Description || ''}</p>
                </div>
                <div class="aa-properties-detial">
                  <span class="aa-price">
                    ₪${f.Price ? parseInt(f.Price, 10).toLocaleString() : 'N/A'}
                  </span>
                  <a href="property_details.html?id=${prop.id}" class="aa-secondary-btn">
                    View Details
                  </a>
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
