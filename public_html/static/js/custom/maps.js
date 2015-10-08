function initialize() {
  
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
  var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
  
  var marker = new google.maps.Marker ({
    position: new google.maps.LatLng(38.301511, -77.474094),
    animation: google.maps.Animation.BOUNCE
  });
  
  marker.setMap(map);
  google.maps.event.addListener(map,'center_changed', function() { checkBounds(); });
  
  var infowindow = new google.maps.InfoWindow ({
  content:"You're here-ish"
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });
  
  // responsivly update map size based on screen
  $(window).resize(function() {
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center);
  });
  
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
} 



/*function loadScript() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://maps.googleapis.com/maps/api/js?v=3.key=AIzaSyDeovcMJI1fqgbiZeyKwNDiBI3N8ghcmEc&callback=initialize";
  document.body.appendChild(script);
}*/

//window.onload = loadScript;





