// Global variables to hold price range
var priceMin = 0;
var priceMax = 50000000; // default end range, will update on slider changes

jQuery(function($){

  jQuery(window).bind('scroll', function () {
    if (jQuery(window).scrollTop() > 200) {
        jQuery('.main-navbar').addClass('navbar-fixed-top');
      } else {
        jQuery('.main-navbar').removeClass('navbar-fixed-top');          
      }
  });

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
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
    ]
  });

  jQuery('.aa-testimonial-slider').slick({
    dots: false,      
    infinite: true,
    speed: 500,      
    cssEase: 'linear'
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
      { breakpoint:600, settings: { slidesToShow:2, slidesToScroll:2 }},
      { breakpoint:480, settings: { slidesToShow:1, slidesToScroll:1 }}
    ]
  });


  jQuery('.aa-properties-details-img').slick({
    dots: false,
    infinite: true,
    arrows: true,
    speed: 500,      
    cssEase: 'linear'
  });

  // Hover dropdown
  jQuery('ul.nav li.dropdown').hover(function() {
    jQuery(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(200);
  }, function() {
    jQuery(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(200);
  });

  // Price range slider
  jQuery(function() {
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

      var skipSlider = document.getElementById('aa-sqrfeet-range');
      var sliderConfig = {
        range: originalRange,
        snap: true,
        connect: true,
        start: [0, 50000000]
      };
      noUiSlider.create(skipSlider, sliderConfig);

      var skipValues = [
        document.getElementById('skip-value-lower'),
        document.getElementById('skip-value-upper')
      ];

      skipSlider.noUiSlider.on('update', function(values, handle) {
        skipValues[handle].innerHTML = '₪' + parseInt(values[handle]).toLocaleString();
      });

      // On slider change, update global priceMin/priceMax and re-apply filters
      skipSlider.noUiSlider.on('change', function(values) {
        priceMin = parseInt(values[0], 10);
        priceMax = parseInt(values[1], 10);
        if (typeof applyFilters === 'function') {
          applyFilters();
        }
      });

      
      document.getElementById('property-status').addEventListener('change', function() {
        var selectedValue = this.value;
        var newRange = selectedValue === "2" ? rentRange : originalRange;
        skipSlider.noUiSlider.updateOptions({ range: newRange });
        // Reset the slider positions when status changes
        if (selectedValue === "2") {
          skipSlider.noUiSlider.set([0, 50000]);
          priceMax = 50000;
        } else {
          skipSlider.noUiSlider.set([0, 50000000]);
          priceMax = 50000000;
        }
        if (typeof applyFilters === 'function') {
          applyFilters();
        }
      });
    }
  });

  $(window).on("load", function() {
    applyFilters();
  });

  jQuery(window).scroll(function(){
    if (jQuery(this).scrollTop() > 300) {
      jQuery('.scrollToTop').fadeIn();
    } else {
      jQuery('.scrollToTop').fadeOut();
    }
  });

  jQuery('.scrollToTop').click(function(){
    jQuery('html, body').animate({scrollTop : 0},800);
    return false;
  });

  jQuery(window).load(function() { 
    jQuery('#aa-preloader-area').delay(300).fadeOut('slow');     
  });

  jQuery("#aa-list-properties").click(function(e){
    e.preventDefault(e);
    jQuery(".aa-properties-nav").addClass("aa-list-view");
  });
  jQuery("#aa-grid-properties").click(function(e){
    e.preventDefault(e);
    jQuery(".aa-properties-nav").removeClass("aa-list-view");
  });

  jQuery('.aa-related-item-slider').slick({
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      { breakpoint:1024, settings:{ slidesToShow:3, slidesToScroll:3, infinite:true, dots:true }},
      { breakpoint:600, settings:{ slidesToShow:2, slidesToScroll:2 }},
      { breakpoint:480, settings:{ slidesToShow:1, slidesToScroll:1 }}
    ]
  });

});

$(document).on("scroll", function () {
  var pageTop = $(document).scrollTop();
  var pageBottom = pageTop + $(window).height();
  var tags = $(".fadein");

  for (var i = 0; i < tags.length; i++) {
    var tag = tags[i];
    if ($(tag).offset().top < pageBottom) {
      $(tag).addClass("visible");
    } else {
      $(tag).removeClass("visible");
    }
  }
});
