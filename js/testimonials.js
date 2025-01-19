  // ==========================
  // languageToggle + Slider JS
  // ==========================
  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("language-toggle");

    // URL to your testimonials JSON
    const dataUrl = "json/testimonials.json";
    // Will store records that have Included == true
    let includedTestimonials = [];

    // A function to build (or rebuild) the Slick slider
    function populateSlider(isEnglish) {
      const $slider = $(".aa-testimonial-slider");

      // If Slick is already initialized, destroy it before rebuilding
      if ($slider.hasClass("slick-initialized")) {
        $slider.slick("unslick");
      }

      // Clear old slides
      $slider.empty();

      // Build slides from JSON
      if (isEnglish) {
        // English version
        includedTestimonials.forEach(testimonial => {
          const { Name, Img_Url, Info, Title } = testimonial.fields;
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
      } else {
        // Hebrew version
        includedTestimonials.forEach(testimonial => {
          const { Name_Hebrew, Img_Url, Info_Hebrew, Title_Hebrew } = testimonial.fields;
          $slider.append(`
            <li>
              <div class="aa-testimonial-single hebrew">
                <div class="aa-testimonial-img">
                  <img src="${Img_Url}" alt="testimonial img">
                </div>
                <div class="aa-testimonial-info">
                  <p id="light">${Info_Hebrew}</p>
                </div>
                <div class="aa-testimonial-bio">
                  <p>${Name_Hebrew}</p>
                  <span id="light">${Title_Hebrew}</span>
                </div>
              </div>
            </li>
          `);
        });
      }

      // Reinitialize Slick on the new slides
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
    }

    // Fetch the JSON
    $.getJSON(dataUrl, function (testimonials) {
      const records = testimonials.records || [];
      // Only keep those with Included === true
      includedTestimonials = records.filter(rec => rec.fields.Included === true);

      // Determine initial language from localStorage; default to English if none saved
      const storedLanguage = localStorage.getItem("language");
      const isEnglish = !storedLanguage || storedLanguage === "english";
      // Set the toggle to match the saved preference
      toggle.checked = isEnglish;

      // Populate the slider for the first time
      populateSlider(isEnglish);

      // Listen for changes on the toggle to switch language
      toggle.addEventListener("change", () => {
        const newIsEnglish = toggle.checked;
        // Save preference
        localStorage.setItem("language", newIsEnglish ? "english" : "hebrew");
        // Rebuild the slider in the chosen language
        populateSlider(newIsEnglish);
      });
    });
  });