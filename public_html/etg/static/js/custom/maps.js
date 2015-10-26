/*loadScript('https://maps.googleapis.com/maps/api/js?v=3.key=AIzaSyDeovcMJI1fqgbiZeyKwNDiBI3N8ghcmEc',
          function() { 
            console.log('google-loader has been loaded, but not the maps-API ');
          });
          
function loadScript(src,callback){

  var script = document.createElement("script");
  script.type = "text/javascript";
  if(callback)script.onload=callback;
  script.src = src;
  document.body.appendChild(script);
}*/

var map

$(function () {
  
  console.log('maps-API has been loaded, ready to use');
  
  var mapProp = {
    center: new google.maps.LatLng(38.301461, -77.473635),
    zoom: 13,
    panControl:true,
    zoomControl:true,
    mapTypeControl:true,
    scaleControl:true,
    streetViewControl:true,
    overviewMapControl:true,
    rotateControl:true, 
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map($("#googleMap")[0], mapProp);
  $(window).resize(function() {
    google.maps.event.trigger($("#googleMap")[0], 'resize');
  });
  
  google.maps.event.addListener(map,'center_changed', function() { checkBounds(); });
 
  google.maps.event.addListener(map,'resize', function() { resize(); });
  
  var allowedBounds = new google.maps.LatLngBounds (
   new google.maps.LatLng(38.273763, -77.485478), 
   new google.maps.LatLng(38.352718, -77.460838)
  );
  
  function checkBounds() {    
    if(! allowedBounds.contains(map.getCenter())) {
      var C = map.getCenter();
      var X = C.lng();
      var Y = C.lat();
  
      var AmaxX = allowedBounds.getNorthEast().lng();
      var AmaxY = allowedBounds.getNorthEast().lat();
      var AminX = allowedBounds.getSouthWest().lng();
      var AminY = allowedBounds.getSouthWest().lat();
  
      if (X < AminX) {X = AminX;}
      if (X > AmaxX) {X = AmaxX;}
      if (Y < AminY) {Y = AminY;}
      if (Y > AmaxY) {Y = AmaxY;}
  
      map.setCenter(new google.maps.LatLng(Y,X));
    }
  }
  
  var markerGet = $.getJSON("/loadMarkers");

  var essayGet = $.getJSON("/loadEssays");
  
  $.when(markerGet).done(function(markerResponse) {
    console.log(markerResponse);
    $.each(markerResponse, function() {
      $.each(this, function(key, value) {
        $.getJSON("/loadEssays", {markerID: this['id']}).done(function(essayResponse) {
          console.log(this['id']);
          placeMarkers(markerResponse, essayResponse);
        });
      });
    });
  });
  
  function placeMarkers(markersJSON, essayJSON) {
    $.each(markersJSON, function() {
      $.each(this, function(key, val) {
        var newMarker = new google.maps.Marker ({
          position: new google.maps.LatLng(this['latitude'], this['longitude']),
          animation: google.maps.Animation.BOUNCE,
        });
        var infowindow = new google.maps.InfoWindow ({
          content: getEssays(essayJSON)
        });
        google.maps.event.addListener(newMarker, 'click', function() {
          infowindow.open(map, newMarker);
        });
        newMarker.setMap(map);
      }); 
    }); 
  }
  
  function getEssays(essayJSON) {
    var someElement; //to be appended to as html element
    $.each(essayJSON, function() {
      $.each(this, function(key, val) {
        console.log(this['location'])
       // return this['location'];  
      });
      return "jlsdkfj"
    });
  }
});
