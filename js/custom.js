
  // Global variables to hold price range
  var priceMin = 0;
  var priceMax = 50000000; // default end range, will update on slider changes

  jQuery(document).ready(function($) {

    /********************************
     * Sticky Navbar on Scroll
     ********************************/
    jQuery(window).on('scroll', function () {
      if (jQuery(window).scrollTop() > 200) {
        jQuery('.main-navbar').addClass('navbar-fixed-top');
      } else {
        jQuery('.main-navbar').removeClass('navbar-fixed-top');
      }
    });

    /********************************
     * Slick Sliders
     ********************************/
    jQuery('.aa-agents-slider').slick({
      dots: false,
      arrows: false,
      infinite: true,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2500,
      responsive: [
        { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3, infinite: true, dots: true } },
        { breakpoint: 600,  settings: { slidesToShow: 2, slidesToScroll: 2 } },
        { breakpoint: 480,  settings: { slidesToShow: 1, slidesToScroll: 1 } }
      ]
    });

    jQuery('.aa-client-brand-slider').slick({
      dots: false,
      arrows: false,
      infinite: true,
      speed: 300,
      slidesToShow: 5,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2500,
      responsive: [
        { breakpoint: 1024, settings: { slidesToShow:4, slidesToScroll:4, infinite:true, dots:true }},
        { breakpoint:600,  settings: { slidesToShow:2, slidesToScroll:2 }},
        { breakpoint:480,  settings: { slidesToShow:1, slidesToScroll:1 }}
      ]
    });

    jQuery('.aa-properties-details-img').slick({
      dots: false,
      infinite: true,
      arrows: true,
      speed: 500,
      cssEase: 'linear'
    });

    /********************************
     * Hover Dropdown
     ********************************/
    jQuery('ul.nav li.dropdown').hover(
      function() {
        jQuery(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(200);
      },
      function() {
        jQuery(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(200);
      }
    );

/********************************
 * Price Range Slider (noUiSlider)
 ********************************/
if (jQuery('body').is('.aa-price-range')) {
  var originalRange = {
    'min': 0,
    '10%': 2000000,
    '20%': 5000000,
    '30%': 10000000,
    '40%': 15000000,
    '50%': 20000000,
    '60%': 25000000,
    '70%': 30000000,
    '80%': 35000000,
    '90%': 40000000,
    'max': 50000000
  };

  var rentRange = {
    'min': 0,
    '10%': 5000,
    '20%': 10000,
    '30%': 15000,
    '40%': 20000,
    '50%': 25000,
    '60%': 30000,
    '70%': 35000,
    '80%': 40000,
    '90%': 45000,
    'max': 50000
  };

  // Get the slider element
  var skipSlider = document.getElementById('.aa-price-range');

  // Default config for "Sale"
  var sliderConfig = {
    range: originalRange,
    snap: true,
    connect: true,
    start: [0, 50000000] // default
  };
  noUiSlider.create(skipSlider, sliderConfig);

  var skipValues = [
    document.getElementById('skip-value-lower'),
    document.getElementById('skip-value-upper')
  ];

  // Update displayed values as the slider moves
  skipSlider.noUiSlider.on('update', function(values, handle) {
    skipValues[handle].innerHTML = '₪' + parseInt(values[handle]).toLocaleString();
  });

  // On slider change, update global min/max & re-apply filters
  skipSlider.noUiSlider.on('change', function(values) {
    priceMin = parseInt(values[0], 10);
    priceMax = parseInt(values[1], 10);
    if (typeof applyFilters === 'function') {
      applyFilters();
    }
  });

  window.updatePriceRangeBasedOnSaleType = function(saleTypeValue) {
    // Just an example. 
    // You can do if (saleTypeValue === 'Rent') { ... } else { ... }
    // Or combine with your existing slider logic.
  
    console.log("Sale Type is:", saleTypeValue);
    
    // For instance:
    if (saleTypeValue === "Rent") {
      // Switch to a rent range
      skipSlider.noUiSlider.updateOptions({ range: rentRange });
      skipSlider.noUiSlider.set([0, 50000]);
    } else {
      // Switch to a sale range
      skipSlider.noUiSlider.updateOptions({ range: originalRange });
      skipSlider.noUiSlider.set([0, 50000000]);
    }
  
    // Then apply filters if you like
    if (typeof applyFilters === 'function') {
      applyFilters();
    }
  };
  
}

    /********************************
     * mixItUp
     ********************************/
    jQuery('#mixit-container').mixItUp();

    /********************************
     * Fancybox
     ********************************/
    jQuery(".fancybox").fancybox();

    /********************************
     * Scroll to Top
     ********************************/
    jQuery(window).scroll(function(){
      if (jQuery(this).scrollTop() > 300) {
        jQuery('.scrollToTop').fadeIn();
      } else {
        jQuery('.scrollToTop').fadeOut();
      }
    });
    jQuery('.scrollToTop').click(function(){
      jQuery('html, body').animate({scrollTop : 0}, 800);
      return false;
    });

    /********************************
     * Preloader
     ********************************/
    jQuery(window).on('load', function() {
      jQuery('#aa-preloader-area').delay(300).fadeOut('slow');
    });

    /********************************
     * Property View Toggle
     ********************************/
    jQuery("#aa-list-properties").click(function(e){
      e.preventDefault(e);
      jQuery(".aa-properties-nav").addClass("aa-list-view");
    });
    jQuery("#aa-grid-properties").click(function(e){
      e.preventDefault(e);
      jQuery(".aa-properties-nav").removeClass("aa-list-view");
    });

    /********************************
     * Related Item Slider
     ********************************/
    jQuery('.aa-related-item-slider').slick({
      dots: false,
      infinite: false,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 4,
      responsive: [
        { breakpoint:1024, settings:{ slidesToShow:3, slidesToScroll:3, infinite:true, dots:true }},
        { breakpoint:600,  settings:{ slidesToShow:2, slidesToScroll:2 }},
        { breakpoint:480,  settings:{ slidesToShow:1, slidesToScroll:1 }}
      ]
    });
  }); // end document.ready

  // Ensures everything (images, DOM, etc.) is fully loaded
  jQuery(window).on('load', function() {
    // Once the page is fully loaded, call applyFilters() if it exists
    if (typeof applyFilters === 'function') {
      applyFilters();
    }
  });

  /********************************
   * Fade-in on Scroll
   ********************************/
  jQuery(document).on("scroll", function () {
    var pageTop = jQuery(document).scrollTop();
    var pageBottom = pageTop + jQuery(window).height();
    var tags = jQuery(".fadein");

    for (var i = 0; i < tags.length; i++) {
      var tag = tags[i];
      if (jQuery(tag).offset().top < pageBottom) {
        jQuery(tag).addClass("visible");
      } else {
        jQuery(tag).removeClass("visible");
      }
    }
  });