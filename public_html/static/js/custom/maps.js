(function( mapPage, $, undefined ) {
    
    $.ajax({
      url: "https://maps.googleapis.com/maps/api/js?key=API_KEY&callback=initMap",
      dataType: "script",
      success: success
    });
    
    function success () {
        console.log('holy shit it worked');
    }
    
}( window.mapPage = window.mapPage || {}, jQuery ));