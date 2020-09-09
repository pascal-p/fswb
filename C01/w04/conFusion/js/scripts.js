$(document).ready(function() {
  $("#mycarousel").carousel( { interval: 2000 } ); // define wait time for carousel item

  $("#carouselBtn").click(function() {
    if ($("#carouselBtn").children("span").hasClass('fa-pause')) {
      // pause btn -> play btn
      $("#mycarousel").carousel('pause');
      $("#carouselBtn").children("span").removeClass('fa-pause');
      $("#carouselBtn").children("span").addClass('fa-play');
    }
    else {
      // means ($("#carouselBtn").children("span").hasClass('fa-play'))
      // play btn -> pause btn
      $("#mycarousel").carousel('cycle');
      $("#carouselBtn").children("span").removeClass('fa-play');
      $("#carouselBtn").children("span").addClass('fa-pause');
    }
  });

  // t2, t3 - add js code to toggle modals when related buttons are clicked
  $("#toggleLoginModal").click(function() {
    $('#loginModal').modal('toggle');
  });

  $("#toggleReserveFormModal").click(function() {
    $('#reserveFormModal').modal('toggle');
  });
});
