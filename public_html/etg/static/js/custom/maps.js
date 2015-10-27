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

  var essayGet = $.getJSON("/loadMarkerEssays");
  
  $.when(markerGet).done(function(markerResponse) {
    var markers = markerResponse['markerList'];
    $.each(markers, function() {
      var marker = this;
      $.getJSON("/loadMarkerEssays", {
        markerID: this['id']
      }).done(function(essayResponse) {  
        var essay = essayResponse['essayList'][0];
        placeMarkers(marker, essay);
      });
    });
  });
  
  function placeMarkers(markersJSON, essayJSON) {
    var newMarker = new google.maps.Marker ({
      position: new google.maps.LatLng(markersJSON['latitude'], markersJSON['longitude']),
      animation: google.maps.Animation.DROP,
    });
    if (essayJSON != undefined) {
      var infowindow = new google.maps.InfoWindow ({
        content: getEssays(essayJSON)
      });
      google.maps.event.addListener(newMarker, 'click', function() {
        if (newMarker.getAnimation() !== null) {
          newMarker.setAnimation(null);
        } else {
          newMarker.setAnimation(google.maps.Animation.BOUNCE);
        }
        infowindow.open(map, newMarker);
      });
    }
    newMarker.setMap(map);
  }
  
  function getEssays(essayJSON) {
    var someElement = "<div class='mapEssayLink'> \
                        <h6 class='essayLinkTitle'>" + essayJSON['title'] + "</h6> \
                        <a href='" + essayJSON['location'] + "' type='button' class='eassayLinkButton btn btn-sm btn-info' target='_blank'>View</a> \
                      </div>";
    return someElement;
  }
});
