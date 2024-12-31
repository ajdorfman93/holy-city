$(document).ready(function() {
    // 1. Fetch the JSON (adjust the URL/path if needed)
    $.getJSON('js/web_content.json')
      .done(function(data) {
        // 2. Assuming only one record with data:
        if (data.records && data.records.length > 0) {
          const fields = data.records[0].fields || {};
  
          // 3. List our JSON keys + the desired class names
          //    (one-to-one mapping).
          const fieldMapping = {
            "Home_Page_About_Us_Image":  "home-page-about-us-image",
            "About_Us_Image":            "aa-about-us-left",
            "Properties_Banner_Image":   "properties-banner-image",
            "About_Us_Banner_Image":     "about-us-banner-image",
            "Contact_Banner_Image":      "contact-banner-image",
            "About_Us_Page_Article":     "about-us-page-article",
            "About_Us_Bottom_Image":     "about-us-bottom-image"
          };
  
          // 4. For each key in the mapping, populate the corresponding <div>
          $.each(fieldMapping, function(jsonKey, divClass) {
            if (fields.hasOwnProperty(jsonKey)) {
              const value = fields[jsonKey];
              
              // If it's an "image" field (by name), create an <img>
              if (jsonKey.toLowerCase().includes('image')) {
                $("." + divClass).html(`<img src="${value}" alt="${divClass}">`);
              } else {
                // Otherwise, treat it as text/HTML
                $("." + divClass).html(value);
              }
            }
          });
        }
      })
      .fail(function(err) {
        console.error("Failed to fetch JSON:", err);
      });
  });
  