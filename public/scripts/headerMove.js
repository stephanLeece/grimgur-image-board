


var lastScrollTop = 0;
var delta = 5;
var navbarHeight = 120;

var didScroll;
$(window).scroll(function(event){
  didScroll = true;
  console.log(navbarHeight);
});

setInterval(function() {
  if (didScroll) {
    hasScrolled();
    didScroll = false;
  }
}, 250);
function hasScrolled() {
  var scrollTop = $(this).scrollTop();
  if (Math.abs(lastScrollTop - scrollTop) <= delta) {
    return;
  }
  if (scrollTop > lastScrollTop && scrollTop > navbarHeight){
    // Scroll Down
  $('nav').addClass('navUp');
  } else {
    if(scrollTop + $(window).height() < $(document).height()) {
      $('nav').removeClass('navUp');
    }
  }
  lastScrollTop = scrollTop;
}
