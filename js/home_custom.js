

jQuery(function($){

  jQuery(window).bind('scroll', function () {
    if (jQuery(window).scrollTop() > 200) {
        jQuery('.main-navbar').addClass('navbar-fixed-top');
      } else {
        jQuery('.main-navbar').removeClass('navbar-fixed-top');          
      }
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

  jQuery('#mixit-container').mixItUp();

  jQuery(document).ready(function() {
    jQuery(".fancybox").fancybox();
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
