$(document).ready(function () {
    const dataUrl = 'js/testimonials.json'; // Your testimonials JSON
  
    $.getJSON(dataUrl, function (testimonials) {
      // data.records should be an array of testimonial objects
      const records = testimonials.records || [];
  
            // Populate Top Slider
            const includedTestimonials = records.filter(rec => rec.fields.Included === true);
      // Select the slider container (your <ul> or <div> with class "aa-testimonial-slider")
      const $slider = $('.aa-testimonial-slider');
      
      // Clear any existing content
      $slider.empty();
  
      // Loop through the JSON records and build your testimonial slides
      includedTestimonials.forEach(testimonial => {
        // Destructure fields from each record
        const {
          Name,
          Img_Url,
          Info,
          Title
        } = testimonial.fields;
  
        // Append a slide to the slider container
        // You can use <div> or <li> for each slide; Slick handles both fine
        $slider.append(`
            <li>
          <div class="aa-testimonial-single">
            <div class="aa-testimonial-img">
              <img src="${Img_Url}" alt="testimonial img">
            </div>
            <div class="aa-testimonial-info">
              <p>${Info}</p>
            </div>
            <div class="aa-testimonial-bio">
              <p>${Name}</p>
              <span>${Title}</span>
            </div>
          </div>
          </li>
        `);
      });
  
      // Now initialize the Slick slider on this container
      // Adjust the settings as you prefer
      $slider.slick({
        autoplay: true,
        autoplaySpeed: 5000,
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
        nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>'
      });
    });
  });
  