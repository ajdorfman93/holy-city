$(document).ready(function() {
    $.getJSON('json/web_content.json')
      .done(function(data) {
        // We'll just use the first record
        if (data.records && data.records.length > 0) {
          const fields = data.records[0].fields;
  
          // Insert the banner URLs into each section's style attribute
          $('#aa-property-header')
            .attr('style', `background-image: url('${fields.Properties_Banner_Image}');`);
          
          $('#aa-about-header')
            .attr('style', `background-image: url('${fields.About_Us_Banner_Image}');`);
          
          $('#aa-contact-header')
            .attr('style', `background-image: url('${fields.Contact_Banner_Image}');`);
          
          $('#aa-client-testimonial')
            .attr('style', `background-image: url('${fields.About_Us_Bottom_Image}');`);
  
          // Add more if needed, or handle dynamically in a loop
        }
      })
      .fail(function(error) {
        console.error("Error fetching JSON:", error);
      });
  });
  